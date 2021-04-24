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
  async dependencies(): Promise<Dependency[]> {
    const dependencies = await Dependency.createQueryBuilder()
      .leftJoinAndSelect("Dependency.step", "step")
      .leftJoinAndSelect("step.lesson", "lesson")
      .where("lesson.status = 'PUBLISHED'")
      .getMany();

    let deps: Dependency[] = [];

    dependencies.forEach((value) => {
      if (
        !deps.find(
          (dep) =>
            dep.step.lesson?.id === value.step.lesson?.id &&
            dep.package === value.package
        )
      ) {
        deps.push(value);
      }
    });

    return deps;
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

  @Mutation(() => Dependency, { nullable: true })
  async updateDependencyVersion(
    @Arg("id") id: number,
    @Arg("version") version: String
  ): Promise<Dependency | null> {
    const dependency = await Dependency.findOne(id);
    if (!dependency) {
      return null;
    }

    Object.assign(dependency, { version });
    await dependency.save();

    return dependency;
  }

  @Mutation(() => Boolean)
  async deleteDependency(@Arg("id") id: number): Promise<boolean> {
    await Dependency.delete(id);
    return true;
  }
}
