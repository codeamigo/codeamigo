import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { Lesson } from "../entities/Lesson";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { StepResolver } from "./step";

@InputType()
class LessonInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
}

@Resolver()
export class LessonResolver {
  @Query(() => [Lesson])
  lessons(): Promise<Lesson[]> {
    return Lesson.find({
      relations: ["owner", "steps", "students", "steps.dependencies"],
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

  @Mutation(() => Lesson)
  @UseMiddleware(isAuth)
  async createLesson(
    @Arg("options") options: LessonInput,
    @Ctx() { req }: MyContext
  ): Promise<Lesson> {
    const owner = await User.findOne({ id: req.session.userId });
    const stepResolver = new StepResolver();

    const lesson = await Lesson.create({ ...options, owner }).save();
    await stepResolver.createStep({ lessonId: lesson.id, name: "Step 1" });

    return lesson;
  }

  @Mutation(() => Lesson, { nullable: true })
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

  @Mutation(() => Boolean)
  async deleteLesson(@Arg("id") id: number): Promise<boolean> {
    await Lesson.delete(id);
    return true;
  }
}
