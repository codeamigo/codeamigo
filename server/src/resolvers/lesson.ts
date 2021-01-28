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

import { Lesson, LessonStatusTypeEnum } from "../entities/Lesson";
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
}

@ObjectType()
class CreateLessonResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Lesson, { nullable: true })
  lesson?: Lesson;
}

@Resolver()
export class LessonResolver {
  @Query(() => [Lesson])
  async lessons(@Arg("options") options: LessonsInput): Promise<Lesson[]> {
    const { status, ownerId } = options;
    const owner = await User.findOne({ id: ownerId });
    const where = owner ? { owner, status } : { status };

    return Lesson.find({
      relations: [
        "owner",
        "steps",
        "students",
        "steps.dependencies",
        "steps.codeModules",
      ],
      where,
    });
  }

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
  async updateLessonStatus(
    @Arg("id") id: number,
    @Arg("status") status: LessonStatusTypeEnum
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne(id);
    if (!lesson) {
      return null;
    }

    await Lesson.update({ id }, { ...lesson, status });

    return lesson;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteLesson(@Arg("id") id: number): Promise<boolean> {
    await Lesson.delete(id);
    return true;
  }
}
