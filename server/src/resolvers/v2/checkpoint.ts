import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { CheckpointTypeEnum } from '../../entities/v2/Checkpoint';
import { Checkpoint } from '../../entities/v2/Checkpoint';
import { User } from '../../entities/v2/User';

@Resolver()
export class CheckpointResolver {
  @Mutation(() => Checkpoint)
  async completeCheckpoint(
    @Arg('id') id: string,
    @Ctx() { req }: MyContext
  ): Promise<Checkpoint | null> {
    const checkpoint = await Checkpoint.findOne(id, { relations: ['user'] });
    const user = await User.findOne({ id: req.session.userId });

    if (!checkpoint) {
      return null;
    }

    if (checkpoint?.user.id !== user?.id) {
      return null;
    }

    checkpoint.isCompleted = true;
    await checkpoint.save();

    return checkpoint;
  }

  @Mutation(() => Checkpoint)
  async createCheckpoint(
    @Arg('stepId') stepId: string,
    @Arg('description') description: string,
    @Arg('type') type: CheckpointTypeEnum,
    @Arg('matchRegex', { nullable: true }) matchRegex: string,
    @Ctx() { req }: MyContext
  ): Promise<Checkpoint> {
    const newCheckpoint = await Checkpoint.create({
      description,
      matchRegex,
      step: {
        id: stepId,
      },
      type,
    });
    const user = await User.findOne({ id: req.session.userId });

    if (req.session.userId && user) {
      newCheckpoint.user = user;
    }

    const dbCheckpoint = await newCheckpoint.save();

    return dbCheckpoint;
  }

  @Query(() => [Checkpoint])
  async checkpoints(
    @Arg('stepId') stepId: string,
    @Ctx() ctx: MyContext
  ): Promise<Checkpoint[]> {
    const { req } = ctx;
    const checkpoints = await Checkpoint.find({
      order: {
        createdAt: 'ASC',
      },
      relations: ['step', 'user'],
      where: {
        step: {
          id: stepId,
        },
        user: null,
      },
    });

    const user = await User.findOne({ id: req.session.userId });

    if (user) {
      const userCheckpoints = await Checkpoint.find({
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

      if (!userCheckpoints.length) {
        const newCheckpoints: Checkpoint[] = [];
        for (const c of checkpoints) {
          const newCheckpoint = await this.createCheckpoint(
            c.step.id,
            c.description,
            c.type as CheckpointTypeEnum,
            c.matchRegex,
            ctx
          );
          const checkpoint = await Checkpoint.findOne(newCheckpoint.id, {
            relations: ['step', 'user'],
          });

          newCheckpoints.push(checkpoint!);
        }

        return newCheckpoints;
      } else {
        return userCheckpoints;
      }
    }

    return checkpoints;
  }
}
