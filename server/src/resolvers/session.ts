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
import { isStudent } from "../middleware/isStudent";
import { MyContext } from "../types";

@InputType()
class SessionInput {
  @Field()
  lessonId!: number;
}

@InputType()
class UpdateSessionInput {
  @Field()
  lessonId!: number;
  @Field()
  sessionId!: number;
}

@InputType()
class NextStepInput {
  @Field()
  sessionId!: number;
  @Field()
  stepId!: number;
}

@Resolver()
export class SessionResolver {
  @Query(() => [Session])
  @UseMiddleware(isAuth)
  async sessions(@Ctx() { req }: MyContext): Promise<Session[]> {
    const student = await User.findOne({ id: req.session.userId });

    if (!student) {
      return [];
    }

    const sessions = await Session.createQueryBuilder()
      .where("Session.student.id = :studentId", {
        studentId: student.id,
      })
      .leftJoinAndSelect("Session.steps", "steps")
      .leftJoinAndSelect("Session.lesson", "lesson")
      .leftJoinAndSelect("lesson.owner", "owner")
      .leftJoinAndSelect("lesson.students", "students")
      .addOrderBy("Session.updatedAt", "DESC")
      .getMany();

    return sessions;
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
      .leftJoinAndSelect("Session.lesson", "lesson")
      .leftJoinAndSelect("lesson.owner", "owner")
      .leftJoinAndSelect("Session.steps", "steps")
      .leftJoinAndSelect("steps.codeModules", "codeModules")
      .leftJoinAndSelect("steps.checkpoints", "checkpoints")
      .addOrderBy("steps.createdAt", "ASC")
      .getOne();

    return session;
  }

  stepComponentsFactory = async (step: Step) => {
    const checkpoints = await Promise.all(
      step!.checkpoints.map(async (checkpoint) => {
        const { id, ...rest } = checkpoint;

        return await Checkpoint.create({ ...rest }).save();
      })
    );

    const codeModules = await Promise.all(
      step!.codeModules.map(async (codeModule) => {
        const { id, ...rest } = codeModule;

        return await CodeModule.create({
          ...rest,
        }).save();
      })
    );

    const dependencies = await Promise.all(
      step!.dependencies.map(async (dependency) => {
        const { id, ...rest } = dependency;

        return await Dependency.create({ ...rest }).save();
      })
    );

    return { checkpoints, codeModules, dependencies };
  };

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
      { relations: ["steps", "students", "sessions"] }
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

          const {
            checkpoints,
            codeModules,
            dependencies,
          } = await this.stepComponentsFactory(step!);

          return await Step.create({
            checkpoints,
            codeModules,
            createdAt,
            dependencies,
            executionType: step?.executionType,
            instructions: step?.instructions || "",
            lang: step?.lang,
            name: step?.name || "",
            originalStepId: step?.id,
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

      await lesson.sessions.push(session);
      await lesson.save();

      return session;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Mutation(() => Session, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSession(
    @Arg("options") options: UpdateSessionInput,
    @Ctx() { req }: MyContext
  ): Promise<Session | null> {
    try {
      const student = await User.findOne({ id: req.session.userId });
      const session = await Session.findOne({
        relations: ["steps"],
        where: { id: options.sessionId, student },
      });
      const lesson = await Lesson.findOne(
        {
          id: options.lessonId,
        },
        { relations: ["steps"] }
      );

      if (!lesson) {
        return null;
      }

      if (!session) {
        return null;
      }

      const steps = await Promise.all(
        lesson.steps.map(async ({ id }) => {
          const sessionStep = await session.steps.find(
            ({ originalStepId }) => originalStepId === id
          );

          if (sessionStep?.isCompleted) return sessionStep;
          else sessionStep?.remove();

          const updatedStep = await Step.findOne(id, {
            relations: ["codeModules", "checkpoints", "dependencies"],
          });

          const { createdAt } = updatedStep!;

          const {
            checkpoints,
            codeModules,
            dependencies,
          } = await this.stepComponentsFactory(updatedStep!);

          return await Step.create({
            checkpoints,
            codeModules,
            createdAt,
            dependencies,
            executionType: updatedStep?.executionType,
            instructions: updatedStep?.instructions || "",
            lang: updatedStep?.lang,
            name: updatedStep?.name || "",
            originalStepId: updatedStep?.id,
          }).save();
        })
      );

      const currentStep = steps
        .filter(({ isCompleted }) => !isCompleted)
        .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))[0].id;

      Object.assign(session, { currentStep, requiresUpdate: false, steps });

      return session.save();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(isStudent)
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

  @Mutation(() => Session, { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(isStudent)
  async setNextStep(
    @Arg("options") options: NextStepInput
  ): Promise<Session | null> {
    const session = await Session.findOne({ id: options.sessionId });

    if (!session) {
      return null;
    }

    await Session.update(
      { id: options.sessionId },
      { ...session, currentStep: options.stepId }
    );

    return session;
  }
}
