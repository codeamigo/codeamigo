import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import {
  Lesson,
  LessonLabelEnum,
  LessonStatusTypeEnum,
} from "../entities/Lesson";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { FieldError } from "../resolvers/user";
import { MyContext } from "../types";
import { TemplatesType } from "../utils/templates";
import { StepResolver } from "./step";

@InputType()
class LessonInput {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  template: TemplatesType;
}

@InputType()
class LessonsInput {
  @Field()
  status: LessonStatusTypeEnum;
  @Field({ nullable: true })
  ownerId?: number;
  @Field({ nullable: true })
  labels?: string;
  @Field({ nullable: true })
  dependencies?: string;
}

@ObjectType()
class CreateLessonResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Lesson, { nullable: true })
  lesson?: Lesson;
}

const relations = ["owner", "steps", "students", "steps.dependencies"];

@Resolver()
export class LessonResolver {
  @Query(() => [Lesson])
  async lessons(@Arg("options") options: LessonsInput): Promise<Lesson[]> {
    const { status, ownerId, labels, dependencies } = options;
    const owner = await User.findOne({ id: ownerId });

    if (owner) {
      return Lesson.find({
        relations,
        where: { owner, status },
      });
    } else {
      let query = Lesson.createQueryBuilder()
        .where("Lesson.status = :status", { status })
        .leftJoinAndSelect("Lesson.owner", "owner")
        .leftJoinAndSelect("Lesson.students", "students");

      if (labels) {
        query.andWhere("Lesson.label IN (:...labels)", {
          labels: labels.split("|"),
        });
      }
      if (dependencies) {
        const queryDeps = dependencies.split("|");
        query
          .leftJoinAndSelect("Lesson.steps", "steps")
          .leftJoinAndSelect("steps.codeModules", "codeModules")
          .andWhere("codeModules.name = :name", {
            name: "/package.json",
          });
        const lessonWithDeps = await query.getMany();
        const lookForDeps = lessonWithDeps.filter((value) => {
          return value.steps.filter((step) => {
            return step.codeModules.find((codeModule) => {
              if (codeModule.name === "/package.json") {
                const value = JSON.parse(codeModule.value!);
                return Object.keys(value.dependencies).some((value) =>
                  queryDeps.includes(value)
                );
              }

              return false;
            });
          }).length;
        });

        console.log(lookForDeps);

        return lookForDeps;
      }

      return query.getMany();
    }
  }

  // Move filtering to BE
  // const showLesson = (lesson: LessonsQuery['lessons'][0]) => {
  //   if (queryLevels.length === 0 && queryDeps.length === 0) return true;

  //   return (
  //     queryLevels.includes(lesson.label || '') ||
  //     lesson.steps?.some((step) => {
  //       return step.codeModules?.some((codeModule) => {
  //         if (codeModule.name === '/package.json') {
  //           const value = JSON.parse(codeModule.value!);
  //           return Object.keys(value.dependencies).some((value) =>
  //             queryDeps.includes(value)
  //           );
  //         }
  //       });
  //     })
  //   );
  // };

  @Query(() => Lesson, { nullable: true })
  async lesson(@Arg("id", () => Int) id: number): Promise<Lesson | undefined> {
    const lesson = await Lesson.createQueryBuilder()
      .where("Lesson.id = :id", { id })
      .leftJoinAndSelect("Lesson.owner", "owner")
      .leftJoinAndSelect("Lesson.steps", "steps")
      .addOrderBy("steps.createdAt", "ASC")
      .getOne();

    return lesson;
  }

  @Mutation(() => CreateLessonResponse)
  @UseMiddleware(isAuth)
  async createLesson(
    @Arg("options") options: LessonInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateLessonResponse> {
    try {
      const owner = await User.findOne({ id: req.session.userId });
      const stepResolver = new StepResolver();

      if (!options.title) {
        return {
          errors: [{ field: "title", message: "A title is required." }],
        };
      }

      if (!options.description) {
        return {
          errors: [
            { field: "description", message: "A description is required." },
          ],
        };
      }

      const lesson = await Lesson.create({ ...options, owner }).save();
      await stepResolver.createStep({
        lessonId: lesson.id,
        name: "Step 1",
        template: options.template,
      });

      return { lesson };
    } catch (e) {
      if (e.detail && e.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "title",
              message: "Sorry, this title is already taken.",
            },
          ],
        };
      }

      return {
        errors: [{ field: "lesson", message: "Error creating lesson." }],
      };
    }
  }

  @Mutation(() => Lesson, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLessonTitle(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne(id);
    if (!lesson) {
      return null;
    }

    await Lesson.update({ id }, { ...lesson, title });

    return lesson;
  }

  @Mutation(() => Lesson, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLessonDescription(
    @Arg("id") id: number,
    @Arg("description") description: string
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne(id);
    if (!lesson) {
      return null;
    }

    await Lesson.update({ id }, { ...lesson, description });

    return lesson;
  }

  @Mutation(() => Lesson, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLessonLabel(
    @Arg("id") id: number,
    @Arg("label") label: LessonLabelEnum
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne(id);
    if (!lesson) {
      return null;
    }

    await Lesson.update({ id }, { ...lesson, label });

    return lesson;
  }

  @Mutation(() => Lesson, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLessonStatus(
    @Arg("id") id: number,
    @Arg("status") status: LessonStatusTypeEnum
  ): Promise<Lesson | null | FieldError[]> {
    const lesson = await Lesson.findOne(id, { relations });
    if (!lesson) {
      return null;
    }

    if (status === "PENDING_PUBLISH") {
      if (!lesson.thumbnail) {
        return [{ field: "thumbnail", message: "A thumbnail is required." }];
      }

      if (!lesson.label) {
        return [{ field: "label", message: "A label is required." }];
      }
    }

    Object.assign(lesson, { status });

    return lesson.save();
  }

  @Mutation(() => Lesson, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLessonThumbnail(
    @Arg("id") id: number,
    @Arg("thumbnail", { nullable: true }) thumbnail?: string
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne({
      relations,
      where: { id },
    });

    if (!lesson) {
      return null;
    }

    Object.assign(lesson, { thumbnail });

    return lesson.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteLesson(@Arg("id") id: number): Promise<boolean> {
    await Lesson.delete(id);
    return true;
  }
}
