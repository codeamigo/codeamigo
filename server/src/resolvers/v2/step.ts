import { Arg, Query, Resolver } from 'type-graphql';

import { Step } from '../../entities/v2/Step';

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find();
  }

  @Query(() => Step, { nullable: true })
  async step(@Arg('id', () => String) id: string): Promise<Step | undefined> {
    const step = await Step.createQueryBuilder()
      .where('Step.id = :id', { id })
      .leftJoinAndSelect('Step.lesson', 'lesson')
      .leftJoinAndSelect('Step.codeModules', 'codeModules')
      .leftJoinAndSelect('Step.checkpoints', 'checkpoints')
      .addOrderBy('checkpoints.createdAt', 'ASC')
      .getOne();

    if (!step) {
      return undefined;
    }

    return step;
  }
}
