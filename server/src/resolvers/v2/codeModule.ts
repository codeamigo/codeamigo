import { Query, Resolver } from 'type-graphql';

import { CodeModule } from '../../entities/v2/CodeModule';

@Resolver()
export class CodeModuleResolver {
  @Query(() => [CodeModule])
  codeModules(): Promise<CodeModule[]> {
    return CodeModule.find();
  }
}
