import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';

import { Checkpoint } from '../../entities/v2/Checkpoint';
import { Step } from '../../entities/v2/Step';

@Resolver()
export class CheckpointResolver {
  @Query(() => [Checkpoint])
  async checkpoints(
    @Arg('stepId') stepId: string,
    @Ctx() { req }: MyContext
  ): Promise<Checkpoint[]> {
    const checkpoints = await Checkpoint.createQueryBuilder().where(
      'Checkpoint.stepId = :stepId',
      {
        stepId,
      }
    );

    if (req.session.userId) {
      const userCheckpoints = checkpoints
        .leftJoinAndSelect('Checkpoint.user', 'user')
        .where('user.id = :userId', {
          userId: req.session.userId,
        })
        .getMany();

      if (!userCheckpoints) {
        // create them
        checkpoints.getMany().then((checkpoints) => {
          checkpoints.forEach((checkpoint) => {
            const newCheckpoint = Checkpoint.create({
              ...checkpoint,
              user: req.session.userId,
            });
          });
        }
      }
    }

    return checkpoints.getMany();
  }

  @Query(() => Checkpoint, { nullable: true })
  checkpoint(
    @Arg('id', () => Int) id: number
  ): Promise<Checkpoint | undefined> {
    return Checkpoint.findOne(id);
  }
}
