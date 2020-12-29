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
import { Session } from "../entities/Session";
import { Step } from "../entities/Step";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class SessionInput {
  @Field()
  lessonId!: number;
}

@Resolver()
export class SessionResolver {
  @Query(() => [Session])
  sessions(): Promise<Session[]> {
    return Session.find({ relations: ["steps"] });
  }

  @Query(() => Session, { nullable: true })
  session(@Arg("id", () => Int) id: number): Promise<Session | undefined> {
    return Session.findOne(id, { relations: ["steps"] });
  }

  @Mutation(() => Session, { nullable: true })
  @UseMiddleware(isAuth)
  async createSession(
    @Arg("options") options: SessionInput,
    @Ctx() { req }: MyContext
  ): Promise<Session | null> {
    const student = await User.findOne({ id: req.session.userId });

    if (!student) {
      return null;
    }

    const lessonId = options.lessonId;
    const lesson = await Lesson.findOne(
      { id: lessonId },
      { relations: ["steps", "students"] }
    );

    if (!lesson) {
      return null;
    }

    await lesson.students.push(student);

    const currentStep = lesson.steps.sort((a, b) =>
      b.createdAt < a.createdAt ? 1 : -1
    )[0].id;

    const session = Session.create({
      currentStep,
      lessonId,
      student,
    }).save();

    return session;
  }

  @Mutation(() => Boolean)
  async deleteSession(@Arg("id") id: number): Promise<boolean> {
    await Session.delete(id);
    return true;
  }
}
