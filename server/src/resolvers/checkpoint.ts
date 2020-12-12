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

import { Checkpoint } from "../entities/Checkpoint";
import { Step } from "../entities/Step";

@InputType()
class CheckpointInput {
  @Field()
  stepId: number;
  @Field()
  description: string;
  @Field()
  initialCode: string;
  @Field()
  userCode: string;
  @Field()
  test: string;
}

@Resolver()
export class CheckpointResolver {
  @Query(() => [Checkpoint])
  checkpoints(): Promise<Checkpoint[]> {
    return Checkpoint.find({ relations: ["step"] });
  }

  @Query(() => Checkpoint, { nullable: true })
  checkpoint(@Arg("id", () => Int) id: number): Promise<Checkpoint | undefined> {
    return Checkpoint.findOne(id);
  }

  @Mutation(() => Checkpoint)
  @UseMiddleware(isAuth)
  async createCheckpoint(@Arg("options") options: CheckpointInput): Promise<Checkpoint> {
    const step = await Step.findOne({ id: options.stepId })
    
    return Checkpoint.create({ ...options, step }).save();
  }

  @Mutation(() => Checkpoint, { nullable: true })
  async updateCheckpoint(
    @Arg("id") id: number,
    @Arg("options") options: CheckpointInput
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
    await Checkpoint.delete(id);
    return true;
  }
}
