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
import { DEFAULT_MD } from "./step";

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
    const code = await CodeModule.create({ name: "app.tsx", value: "" }).save();
    const dependency = await Dependency.create({
      package: "codeamigo-jest-lite",
      version: "1.0.0-alpha.7",
    }).save();
    const step = await Step.create({
      codeModules: [code],
      dependencies: [dependency],
      instructions: DEFAULT_MD,
      name: "Step 1",
    }).save();

    const lesson = Lesson.create({ ...options, owner, steps: [step] }).save();

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
