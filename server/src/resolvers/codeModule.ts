import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { CodeModule } from "../entities/CodeModule";
import { Step } from "../entities/Step";

@InputType()
class CodeModuleInput {
  @Field()
  name: string;
  @Field()
  value: string;
}

@Resolver()
export class CodeModuleResolver {
  @Query(() => [CodeModule])
  codeModules(): Promise<CodeModule[]> {
    return CodeModule.find({ relations: ["step"] });
  }

  @Query(() => CodeModule, { nullable: true })
  codeModule(
    @Arg("id", () => Int) id: number
  ): Promise<CodeModule | undefined> {
    return CodeModule.findOne(id);
  }

  @Mutation(() => CodeModule, { nullable: true })
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
  async updateCodeModule(
    @Arg("id") id: number,
    @Arg("options") options: CodeModuleInput
  ): Promise<CodeModule | null> {
    const codeModule = await CodeModule.findOne(id);
    if (!codeModule) {
      return null;
    }

    await CodeModule.update({ id }, { ...options });
    const newCodeModule = await CodeModule.findOne(id);

    if (!newCodeModule) {
      return null;
    }

    return newCodeModule;
  }

  @Mutation(() => Boolean)
  async deleteCodeModule(@Arg("id") id: number): Promise<boolean> {
    await CodeModule.delete(id);
    return true;
  }
}
