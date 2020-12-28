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

import { Checkpoint } from "../entities/Checkpoint";
import { CodeModule } from "../entities/CodeModule";
import { Step } from "../entities/Step";
import { isAuth } from "../middleware/isAuth";

const DEFAULT_TEST = `import { core, enzyme } from 'codeamigo-jest-lite'

const { describe, it, run, expect } = core
const { mount } = enzyme

describe('My Test', () => {
  it('runs', () => {
    expect(true).toBe(true)
  })
})

const runTests = async () => {
    const results = await run()
    console.log(results)
}

runTests()
`;

@InputType()
class CreateCheckpointInput {
  @Field()
  checkpointId: number;
  @Field()
  stepId: number;
}

@InputType()
class UpdateCheckpointInput {
  @Field()
  description: string;
}

@Resolver()
export class CheckpointResolver {
  @Query(() => [Checkpoint])
  checkpoints(): Promise<Checkpoint[]> {
    return Checkpoint.find({ relations: ["step"] });
  }

  @Query(() => Checkpoint, { nullable: true })
  checkpoint(
    @Arg("id", () => Int) id: number
  ): Promise<Checkpoint | undefined> {
    return Checkpoint.findOne(id);
  }

  @Mutation(() => Checkpoint, { nullable: true })
  @UseMiddleware(isAuth)
  async createCheckpoint(
    @Arg("options") options: CreateCheckpointInput
  ): Promise<Checkpoint | null> {
    let step = await Step.findOne(
      { id: options.stepId },
      { relations: ["codeModules"] }
    );

    if (!step) {
      return null;
    }

    const test = `checkpoint-${options.checkpointId}.spec.ts`;
    const newModule = await CodeModule.create({
      name: test,
      value: DEFAULT_TEST,
    }).save();

    step.codeModules.push(newModule);
    await step.save();

    return Checkpoint.create({ moduleId: newModule.id, step, test }).save();
  }

  @Mutation(() => Checkpoint, { nullable: true })
  async updateCheckpoint(
    @Arg("id") id: number,
    @Arg("options") options: UpdateCheckpointInput
  ): Promise<Checkpoint | null> {
    const checkpoint = await Checkpoint.findOne(id);
    if (!checkpoint) {
      return null;
    }

    await Checkpoint.update({ id }, { ...options });

    return checkpoint;
  }

  @Mutation(() => Boolean)
  async deleteCheckpoint(@Arg("id") id: number): Promise<boolean> {
    const checkpoint = await Checkpoint.findOne(id);

    if (!checkpoint) {
      return false;
    }

    await Checkpoint.delete(id);
    await CodeModule.delete(checkpoint.moduleId);
    return true;
  }
}
