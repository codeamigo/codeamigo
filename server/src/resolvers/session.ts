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
  @UseMiddleware(isAuth)
  async sessions(@Ctx() { req }: MyContext): Promise<Session[]> {
    const student = await User.findOne({ id: req.session.userId });

    return Session.find({ relations: ["steps"], where: { student } });
  }

  @Query(() => Session, { nullable: true })
  @UseMiddleware(isAuth)
  async session(
    @Arg("lessonId", () => Int) lessonId: number,
    @Ctx() { req }: MyContext
  ): Promise<Session | undefined> {
    const student = await User.findOne({ id: req.session.userId });

    const session = await Session.createQueryBuilder()
      .where(
        "Session.lessonId = :lessonId AND Session.student.id = :studentId",
        {
          lessonId,
          studentId: student?.id,
        }
      )
      .leftJoinAndSelect("Session.steps", "steps")
      .addOrderBy("steps.createdAt", "ASC")
      .getOne();

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

    console.log(lesson);
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
              const { id, ...rest } = codeModule;

              return await CodeModule.create({
                ...rest,
              }).save();
            })
          );

          const checkpoints = await Promise.all(
            step!.checkpoints.map(async (checkpoint) => {
              const { id, ...rest } = checkpoint;

              return await Checkpoint.create({ ...rest }).save();
            })
          );

          const dependencies = await Promise.all(
            step!.dependencies.map(async (dependency) => {
              const { id, ...rest } = dependency;

              return await Dependency.create({ ...rest }).save();
            })
          );

          return await Step.create({
            checkpoints,
            codeModules,
            createdAt,
            dependencies,
            instructions: step?.instructions || "",
            name: step?.name || "",
          }).save();
        })
      );

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
  @UseMiddleware(isAuth)
  async deleteSession(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const student = await User.findOne({ id: req.session.userId });
    const session = await Session.findOne({ where: { id, student } });

    if (session) {
      await Session.delete(id);
      return true;
    }

    return false;
  }
}
