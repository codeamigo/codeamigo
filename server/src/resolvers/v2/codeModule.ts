import { Arg, Query, Resolver } from 'type-graphql';

import { CodeModule } from '../../entities/v2/CodeModule';

@Resolver()
export class CodeModuleResolver {
  @Query(() => [CodeModule])
  async codeModules(
    @Arg('stepId', () => String) stepId: string
  ): Promise<CodeModule[] | undefined> {
    const codeModules = await CodeModule.createQueryBuilder()
      .where('CodeModule.stepId = :stepId', { stepId })
      .getMany();

    if (!codeModules) {
      return undefined;
    }

    return codeModules;
  }
}
