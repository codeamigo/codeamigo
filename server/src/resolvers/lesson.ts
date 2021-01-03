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

import { CodeModule } from "../entities/CodeModule";
import { Dependency } from "../entities/Dependency";
import { Lesson } from "../entities/Lesson";
import { Step } from "../entities/Step";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { CheckpointResolver } from "./checkpoint";
import { DEFAULT_MD, StepResolver } from "./step";

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
    return Lesson.find({ relations: ["owner", "steps"] });
  }

  @Query(() => Lesson, { nullable: true })
  lesson(@Arg("id", () => Int) id: number): Promise<Lesson | undefined> {
    return Lesson.findOne(id, { relations: ["owner", "steps"] });
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
