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

import { Checkpoint } from "../entities/Checkpoint";
import { CodeModule } from "../entities/CodeModule";
import { Dependency } from "../entities/Dependency";
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
  @UseMiddleware(isAuth)
  async session(
    @Arg("lessonId", () => Int) lessonId: number,
    @Ctx() { req }: MyContext
  ): Promise<Session | undefined> {
    const student = await User.findOne({ id: req.session.userId });

    const session = await Session.findOne({
      relations: ["steps"],
      where: { lessonId, student },
    });

    return session;
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
    await lesson.save();

    try {
      const steps = await Promise.all(
        lesson.steps.map(async ({ id }) => {
          const step = await Step.findOne(id, {
            relations: ["codeModules", "checkpoints", "dependencies"],
          });

          const { createdAt } = step!;

          const codeModules = await Promise.all(
            step!.codeModules.map(async (codeModule) => {
              const { id, createdAt, updatedAt, ...rest } = codeModule;

              return await CodeModule.create({
                ...rest,
              }).save();
            })
          );

          const checkpoints = await Promise.all(
            step!.checkpoints.map(async (checkpoint) => {
              const { id, createdAt, updatedAt, ...rest } = checkpoint;

              return await Checkpoint.create({ ...rest }).save();
            })
          );

          const dependencies = await Promise.all(
            step!.dependencies.map(async (dependency) => {
              const { id, createdAt, updatedAt, ...rest } = dependency;

              return await Dependency.create({ ...rest }).save();
            })
          );

          return await Step.create({
            checkpoints,
            codeModules,
            createdAt,
            dependencies,
            instructions: step?.instructions || "",
            // name: step?.name || "",
          }).save();
        })
      );

      console.log(steps);

      const currentStep = steps.sort((a, b) =>
        b.createdAt < a.createdAt ? 1 : -1
      )[0].id;

      const session = await Session.create({
        currentStep,
        lessonId,
        steps,
        student,
      }).save();

      return session;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deleteSession(@Arg("id") id: number): Promise<boolean> {
    await Session.delete(id);
    return true;
  }
}
