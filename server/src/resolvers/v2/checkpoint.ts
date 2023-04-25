import { Arg, Int, Query, Resolver } from 'type-graphql';

import { Checkpoint } from '../../entities/v2/Checkpoint';
import { Step } from '../../entities/v2/Step';

@Resolver()
export class CheckpointResolver {
  @Query(() => [Checkpoint])
  async checkpoints(@Arg('stepId') stepId: string): Promise<Checkpoint[]> {
    const step = await Step.createQueryBuilder()
      .where('Step.id = :stepId', {
        stepId,
      })
      .leftJoinAndSelect('Step.checkpoints', 'checkpoints')
      .addOrderBy('checkpoints.createdAt', 'ASC')
      .getOne();

    return step?.checkpoints || [];
  }

  @Query(() => Checkpoint, { nullable: true })
  checkpoint(
    @Arg('id', () => Int) id: number
  ): Promise<Checkpoint | undefined> {
    return Checkpoint.findOne(id);
  }
}
