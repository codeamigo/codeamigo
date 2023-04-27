import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { CodeModule } from '../../entities/v2/CodeModule';
import { User } from '../../entities/v2/User';

@Resolver()
export class CodeModuleResolver {
  @Mutation(() => CodeModule)
  async createCodeModule(
    @Arg('stepId') stepId: string,
    @Arg('code') code: string,
    @Arg('name') name: string,
    @Arg('isEntry') isEntry: boolean,
    @Ctx() { req }: MyContext
  ): Promise<CodeModule> {
    const newCodeModule = await CodeModule.create({
      code,
      isEntry,
      name,
      step: {
        id: stepId,
      },
    });
    const user = await User.findOne({ id: req.session.userId });

    if (req.session.userId && user) {
      newCodeModule.user = user;
    }

    await newCodeModule.save();

    return newCodeModule;
  }

  @Mutation(() => CodeModule)
  async updateCodeModule(
    @Arg('id') id: string,
    @Arg('code') code: string,
    @Ctx() { req }: MyContext
  ): Promise<CodeModule> {
    const user = await User.findOne({ id: req.session.userId });
    const codeModule = await CodeModule.findOne(id, {
      relations: ['user'],
      where: { user: { id: user?.id } },
    });

    if (!codeModule) {
      throw new Error('CodeModule not found');
    }

    if (codeModule?.user.id !== user?.id) {
      throw new Error('Not authorized');
    }
    console.log(user);

    codeModule.code = code;

    await codeModule.save();

    return codeModule;
  }

  @Query(() => [CodeModule])
  async codeModules(
    @Arg('stepId', () => String) stepId: string,
    @Ctx() ctx: MyContext
  ): Promise<CodeModule[] | undefined> {
    const { req } = ctx;
    const codeModules = await CodeModule.find({
      relations: ['step', 'user'],
      where: {
        step: {
          id: stepId,
        },
        user: null,
      },
    });

    if (!codeModules) {
      return undefined;
    }

    const user = await User.findOne({ id: req.session.userId });

    if (user) {
      const userCodeModules = await CodeModule.find({
        relations: ['user', 'step'],
        where: {
          step: {
            id: stepId,
          },
          user: {
            id: user?.id,
          },
        },
      });

      if (!userCodeModules.length) {
        const newCodeModules: CodeModule[] = [];
        for (const codeModule of codeModules) {
          const newCodeModule = await this.createCodeModule(
            codeModule.step.id,
            codeModule.code,
            codeModule.name,
            codeModule.isEntry,
            ctx
          );

          newCodeModules.push(newCodeModule);
        }

        return newCodeModules;
      } else {
        return userCodeModules;
      }
    }

    return codeModules;
  }
}
