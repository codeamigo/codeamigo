import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { Dependency } from "../entities/Dependency";
import { Step } from "../entities/Step";

@InputType()
class DependencyInput {
  @Field()
  package: string;
  @Field()
  version: string;
}

@Resolver()
export class DependencyResolver {
  @Query(() => [Dependency])
  dependencies(): Promise<Dependency[]> {
    return Dependency.find({ relations: ["step"] });
  }

  @Query(() => Dependency, { nullable: true })
  dependency(
    @Arg("id", () => Int) id: number
  ): Promise<Dependency | undefined> {
    return Dependency.findOne(id);
  }

  @Mutation(() => Dependency, { nullable: true })
  async createDependency(
    @Arg("stepId") stepId: number,
    @Arg("options") options: DependencyInput
  ): Promise<Dependency | null> {
    const step = await Step.findOne(stepId, { relations: ["dependencies"] });
    const dependency = await Dependency.create({ ...options }).save();
    if (!step) {
      return null;
    }

    step.dependencies.push(dependency);
    await step.save();

    return dependency;
  }

  @Mutation(() => Dependency, { nullable: true })
  async updateDependency(
    @Arg("id") id: number,
    @Arg("options") options: DependencyInput
  ): Promise<Dependency | null> {
    const dependency = await Dependency.findOne(id);
    if (!dependency) {
      return null;
    }

    await Dependency.update({ id }, { ...options });

    return dependency;
  }

  @Mutation(() => Boolean)
  async deleteDependency(@Arg("id") id: number): Promise<boolean> {
    await Dependency.delete(id);
    return true;
  }
}
