import { MyContext } from "src/types";
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
import { Lesson } from "../entities/Lesson";
import { Step } from "../entities/Step";
import { isAuth } from "../middleware/isAuth";
import { isStudentOrTeacher } from "../middleware/isStudentOrTeacher";
import { isTeacher } from "../middleware/isTeacher";

@InputType()
class CodeModuleInput {
  @Field()
  name: string;
  @Field()
  value: string;
  @Field({ nullable: true })
  lessonId?: number;
}

@InputType()
class CodeModuleUpdateInput {
  @Field()
  name: string;
  @Field()
  value: string;
  @Field({ nullable: true })
  sessionId?: number;
  @Field({ nullable: true })
  lessonId?: number;
}

@InputType()
class CodeModuleUpdateEntryInput {
  @Field({ nullable: true })
  newId?: number;
  @Field({ nullable: true })
  oldId?: number;
}

@Resolver()
export class CodeModuleResolver {
  @Query(() => [CodeModule])
  codeModules(): Promise<CodeModule[]> {
    return CodeModule.find({ relations: ["step"] });
  }

  @Query(() => [String])
  async deps(): Promise<String[]> {
    const mods = await CodeModule.createQueryBuilder()
      .leftJoinAndSelect("CodeModule.step", "step")
      .leftJoinAndSelect("step.lesson", "lesson")
      .where("lesson.status = 'PUBLISHED'")
      .getMany();

    const pkgs = mods.filter(({ name }) => name === "/package.json");
    const depsPerLesson = pkgs.reduce((acc, { value, step }) => {
      const deps = JSON.parse(value).dependencies;
      if (acc[step.lesson.id]) {
        return {
          ...acc,
          [step.lesson.id]: [
            ...new Set([...acc[step.lesson.id], ...Object.keys(deps)]),
          ],
        };
      } else {
        return {
          ...acc,
          [step.lesson.id]: Object.keys(deps),
        };
      }
    }, {} as { [key in number]: string[] });

    const deps = [] as string[];

    Object.keys(depsPerLesson).forEach((lesson: string) => {
      const lessonDeps = depsPerLesson[parseInt(lesson)];
      lessonDeps.forEach((val) => deps.push(val));
    });

    return deps;
  }

  @Query(() => CodeModule, { nullable: true })
  codeModule(
    @Arg("id", () => Int) id: number
  ): Promise<CodeModule | undefined> {
    return CodeModule.findOne(id);
  }

  @Mutation(() => CodeModule, { nullable: true })
  @UseMiddleware(isAuth)
  async createCodeModule(
    @Arg("stepId") stepId: number,
    @Arg("options") options: CodeModuleInput
  ): Promise<CodeModule | null> {
    const step = await Step.findOne(stepId, { relations: ["codeModules"] });
    const codeModule = await CodeModule.create({ ...options }).save();
    if (!step) {
      return null;
    }

    step.codeModules.push(codeModule);
    await step.save();

    return codeModule;
  }

  @Mutation(() => CodeModule, { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(isStudentOrTeacher)
  async updateCodeModule(
    @Arg("id") id: number,
    @Arg("options") options: CodeModuleUpdateInput,
    @Ctx() { req }: MyContext
  ): Promise<CodeModule | null> {
    const codeModule = await CodeModule.findOne(id);
    if (!codeModule) {
      return null;
    }

    let lesson;
    if (options.lessonId) {
      lesson = await Lesson.findOne(
        { id: options.lessonId },
        { relations: ["owner"] }
      );

      if (lesson?.owner.id !== req.session.userId) {
        return null;
      }
    }

    const { lessonId, sessionId, ...rest } = options;

    await CodeModule.update({ id }, { ...rest });
    const newCodeModule = await CodeModule.findOne(id);

    if (!newCodeModule) {
      return null;
    }

    return newCodeModule;
  }

  @Mutation(() => CodeModule, { nullable: true })
  async updateCodeModuleEntryFile(
    @Arg("options") options: CodeModuleUpdateEntryInput
  ): Promise<CodeModule | null> {
    const oldEntry = await CodeModule.findOne(options.oldId);
    const newEntry = await CodeModule.findOne(options.newId);
    if (!oldEntry || !newEntry) {
      return null;
    }

    Object.assign(oldEntry, { isEntry: false });
    await oldEntry.save();

    Object.assign(newEntry, { isEntry: true });
    await newEntry.save();

    return newEntry;
  }

  @Mutation(() => Boolean)
  async deleteCodeModule(@Arg("id") id: number): Promise<boolean> {
    await CodeModule.delete(id);
    return true;
  }
}
