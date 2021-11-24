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
import { Lesson, TemplatesEnum } from "../entities/Lesson";
import { Step } from "../entities/Step";
import { isAuth } from "../middleware/isAuth";
import { isTeacher } from "../middleware/isTeacher";
import { getTemplate, ITemplate } from "../utils/templates";

export const DEFAULT_MD = `## Step \#

### Instructions
1. Add instructions for the step here.
2. You can use markdown to add [links](https://google.com)
3. Or use it to add \`code\` snippets.

\`\`\`
You can also write code in blocks.
\`\`\`

Remember to be short and sweet. 😘
`;

@InputType()
class StepInstructionsInput {
  @Field()
  id: number;
  @Field()
  instructions: string;
}

@InputType()
class StepNameInput {
  @Field()
  id: number;
  @Field()
  lessonId: number;
  @Field()
  name: string;
}

@InputType()
class UpdateStepInput {
  @Field()
  id: number;
}

@InputType()
class UpdateStepCheckpointInput {
  @Field()
  id: number;
  @Field()
  checkpointId: number;
}

@InputType()
class UpdateStepPositionInput {
  @Field()
  id: number;
  @Field()
  lessonId: number;
  @Field()
  changeY: number;
}

@InputType()
class CreateStepInput {
  @Field()
  name: string;
  @Field()
  lessonId: number;
  @Field({ nullable: true })
  currentStepId?: number;
  @Field({ nullable: true })
  template?: TemplatesEnum;
}

@InputType()
class DeleteStepInput {
  @Field()
  id: number;
  @Field()
  lessonId: number;
}

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find({
      relations: ["lesson", "checkpoints", "codeModules", "dependencies"],
    });
  }

  @Query(() => Step, { nullable: true })
  async step(@Arg("id", () => Int) id: number): Promise<Step | undefined> {
    const step = await Step.createQueryBuilder()
      .where("Step.id = :id", { id })
      .leftJoinAndSelect("Step.lesson", "lesson")
      .leftJoinAndSelect("Step.codeModules", "codeModules")
      .leftJoinAndSelect("Step.dependencies", "dependencies")
      .leftJoinAndSelect("Step.checkpoints", "checkpoints")
      .addOrderBy("checkpoints.createdAt", "ASC")
      .getOne();

    if (!step) {
      return undefined;
    }

    const currentCheckpoint = step.checkpoints.find(
      (checkpoint) => !checkpoint.isCompleted
    );

    if (!step.currentCheckpointId) {
      step.currentCheckpointId = currentCheckpoint?.id;
      await Step.save(step);
    }

    return step;
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(isTeacher)
  async updateStepName(
    @Arg("options") options: StepNameInput
  ): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    if (!step) {
      return null;
    }

    await Step.update({ id: options.id }, { ...step, name: options.name });

    return step;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(isTeacher)
  async deleteStep(@Arg("options") options: DeleteStepInput): Promise<boolean> {
    const step = await Step.findOne(options.id);

    if (!step) {
      return false;
    }

    await Step.delete(options.id);
    return true;
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(isTeacher)
  async createStep(
    @Arg("options") options: CreateStepInput
  ): Promise<Step | null> {
    const lesson = await Lesson.findOne(
      { id: options.lessonId },
      { relations: ["steps"] }
    );

    if (!lesson) {
      return null;
    }

    let template: Omit<ITemplate, "templateName">;

    const prevStep = await Step.findOne(options.currentStepId, {
      relations: ["codeModules", "dependencies"],
    });

    if (options.currentStepId) {
      if (!prevStep) return null;

      template = {
        codeModules: prevStep.codeModules,
        dependencies: prevStep.dependencies,
        executionType: prevStep.executionType,
        lang: prevStep.lang,
      };
    } else {
      template = getTemplate(options.template);
    }

    const codeModules = await Promise.all(
      template.codeModules
        .filter((codeModule) => !codeModule.name.includes("spec"))
        .map(async (codeModule) => {
          // @ts-ignore
          const { uuid, ...rest } = codeModule;

          return await CodeModule.create({
            ...rest,
          }).save();
        })
    );

    const step = await Step.create({
      codeModules,
      executionType: template.executionType,
      instructions: DEFAULT_MD.replace("Step #", options.name),
      lang: template.lang,
      name: options.name,
      position: lesson.steps.length + 1,
    }).save();

    lesson.steps.push(step);
    await lesson.save();

    return step;
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  async completeStep(
    @Arg("options") options: UpdateStepInput
  ): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    if (!step) {
      return null;
    }

    await Step.update({ id: options.id }, { ...step, isCompleted: true });

    return step;
  }

  @Mutation(() => Step, { nullable: true })
  async updateStepCheckpoint(
    @Arg("options") options: UpdateStepCheckpointInput,
    @Ctx() { req }: MyContext
  ): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    if (!step) {
      return null;
    }

    step.currentCheckpointId = options.checkpointId;
    if (req.session.userId) {
      await Step.save(step);
    }

    return step;
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  async updateStepInstructions(
    @Arg("options") options: StepInstructionsInput
  ): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    if (!step) {
      return null;
    }

    await Step.update(
      { id: options.id },
      { ...step, instructions: options.instructions }
    );

    return step;
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(isTeacher)
  async updateStepPosition(
    @Arg("options") options: UpdateStepPositionInput
  ): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    const lesson = await Lesson.findOne(options.lessonId, {
      relations: ["steps"],
    });

    if (!step || !lesson || options.changeY === 0) {
      return null;
    }

    if (!step.position) return step;

    const currentPosition = step.position;
    const nextPosition = currentPosition + options.changeY;

    Promise.all(
      lesson.steps.map(async (s) => {
        if (!s.position) return;
        if (s.id === options.id) return;

        let newPosition = s.position;

        // user moving step up
        if (options.changeY < 0) {
          // only change steps below the new position
          if (s.position >= nextPosition && s.position < currentPosition) {
            newPosition += 1;
          }
          // user moving step down
        } else {
          if (s.position <= nextPosition && s.position > currentPosition) {
            newPosition -= 1 || 1;
          } else if (s.position > nextPosition) {
            newPosition += 1;
          }
        }

        Object.assign(s, { position: newPosition });
        await Step.save(s);
      })
    );

    await Step.update({ id: options.id }, { ...step, position: nextPosition });

    return step;
  }
}
