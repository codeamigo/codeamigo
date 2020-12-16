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
  async updateCodeModule(
    @Arg("id") id: number,
    @Arg("options") options: CodeModuleInput
  ): Promise<CodeModule | null> {
    const codeModule = await CodeModule.findOne(id);
    if (!codeModule) {
      return null;
    }

    await CodeModule.update({ id }, { ...options });

    return codeModule;
  }

  @Mutation(() => Boolean)
  async deleteCodeModule(@Arg("id") id: number): Promise<boolean> {
    await CodeModule.delete(id);
    return true;
  }
}
