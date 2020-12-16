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
import { isAuth } from "../middleware/isAuth";

import { Step } from "../entities/Step";

@InputType()
class StepInput {
  @Field({ nullable: true })
  id: number;
  @Field()
  instructions: string;
}

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find({ relations: ["lesson", "checkpoints", "codeModules"] });
  }

  @Query(() => Step, { nullable: true })
  step(@Arg("id", () => Int) id: number): Promise<Step | undefined> {
    return Step.findOne(id, { relations: ["lesson", "codeModules"] });
  }

  @Mutation(() => Step, { nullable: true })
  @UseMiddleware(isAuth)
  async updateStep(@Arg("options") options: StepInput): Promise<Step | null> {
    const step = await Step.findOne({ id: options.id });
    if (!step) {
      return null;
    }

    await Step.update({ id: options.id }, { ...step, ...options });

    return step
  }

  @Mutation(() => Boolean)
  async deleteStep(@Arg("id") id: number): Promise<boolean> {
    await Step.delete(id);
    return true;
  }
}
