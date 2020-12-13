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
import { Lesson } from "../entities/Lesson";

@InputType()
class StepInput {
  @Field({ nullable: true })
  id: number;
  @Field()
  lessonId: number;
  @Field()
  instructions: string;
}

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find({ relations: ["lesson", "checkpoints"] });
  }

  @Query(() => Step, { nullable: true })
  step(@Arg("id", () => Int) id: number): Promise<Step | undefined> {
    return Step.findOne(id, { relations: ["lesson"] });
  }

  @Mutation(() => Step)
  @UseMiddleware(isAuth)
  async createOrUpdateStep(@Arg("options") options: StepInput): Promise<Step> {
    const lesson = await Lesson.findOne({ id: options.lessonId });
    let step = await Step.findOne({ id: options.id });

    if (!step) {
      return Step.create({ ...options, lesson }).save();
    } else {
      await Step.update(
        { id: options.id },
        { instructions: options.instructions }
      );
      return step;
    }
  }

  @Mutation(() => Boolean)
  async deleteStep(@Arg("id") id: number): Promise<boolean> {
    await Step.delete(id);
    return true;
  }
}
