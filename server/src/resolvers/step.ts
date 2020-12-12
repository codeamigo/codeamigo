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
  @Field()
  lessonId: number;
  @Field()
  title: string;
  @Field()
  description: string;
}

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find({ relations: ["lesson", "checkpoints"] });
  }

  @Query(() => Step, { nullable: true })
  step(@Arg("id", () => Int) id: number): Promise<Step | undefined> {
    return Step.findOne(id);
  }

  @Mutation(() => Step)
  @UseMiddleware(isAuth)
  async createStep(@Arg("options") options: StepInput): Promise<Step> {
    const lesson = await Lesson.findOne({ id: options.lessonId })
    
    return Step.create({ ...options, lesson }).save();
  }

  @Mutation(() => Step, { nullable: true })
  async updateStep(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Step | null> {
    const lesson = await Step.findOne(id);
    if (!lesson) {
      return null;
    }

    await Step.update({ id }, { title });

    return lesson;
  }

  @Mutation(() => Boolean)
  async deleteStep(@Arg("id") id: number): Promise<boolean> {
    await Step.delete(id);
    return true;
  }
}
