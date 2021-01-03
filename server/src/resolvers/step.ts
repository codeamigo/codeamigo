import {
  Arg,
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
import { isAuth } from "../middleware/isAuth";

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
  name: string;
}

@InputType()
class CreateStepInput {
  @Field()
  name: string;
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
  step(@Arg("id", () => Int) id: number): Promise<Step | undefined> {
    return Step.findOne(id, {
      relations: ["lesson", "checkpoints", "codeModules", "dependencies"],
    });
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
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

    const code = await CodeModule.create({ name: "app.tsx", value: "" }).save();
    const dependency = await Dependency.create({
      package: "codeamigo-jest-lite",
      version: "1.0.0-alpha.7",
    }).save();

    const step = await Step.create({
      codeModules: [code],
      dependencies: [dependency],
      instructions: DEFAULT_MD,
      name: options.name,
    }).save();

    lesson.steps.push(step);
    await lesson.save();

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
  async deleteStep(@Arg("id") id: number): Promise<boolean> {
    const step = await Step.findOne(id);

    if (!step) {
      return false;
    }

    await Step.delete(id);
    return true;
  }
}
