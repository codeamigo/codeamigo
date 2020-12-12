import { Lesson } from "../entities/Lesson";
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
import { MyContext } from "../types";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";

@InputType()
class LessonInput {
  @Field()
  title: string;
  @Field()
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
    return Lesson.findOne(id, { relations: ["owner"] });
  }

  @Mutation(() => Lesson)
  @UseMiddleware(isAuth)
  async createLesson(
    @Arg("options") options: LessonInput,
    @Ctx() { req }: MyContext
  ): Promise<Lesson> {
    const owner = await User.findOne({ id: req.session.userId });

    return Lesson.create({ ...options, owner }).save();
  }

  @Mutation(() => Lesson, { nullable: true })
  async updateLesson(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Lesson | null> {
    const lesson = await Lesson.findOne(id);
    if (!lesson) {
      return null;
    }

    await Lesson.update({ id }, { title });

    return lesson;
  }

  @Mutation(() => Boolean)
  async deleteLesson(@Arg("id") id: number): Promise<boolean> {
    await Lesson.delete(id);
    return true;
  }
}
