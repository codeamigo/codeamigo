import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Lesson } from '../../entities/v2/Lesson';
import { User } from '../../entities/v2/User';
import { UserLessonPosition } from '../../entities/v2/UserLessonPosition';

@Resolver()
export class UserLessonPositionResolver {
  @Mutation(() => UserLessonPosition)
  async updateUserLessonCurrentPosition(
    @Arg('lessonId') lessonId: string,
    @Arg('currentPosition') currentPosition: number,
    @Ctx() { req }: MyContext
  ): Promise<UserLessonPosition> {
    if (!req.session.userId) {
      throw new Error('Not authorized');
    }

    const userLessonPosition = await UserLessonPosition.findOne({
      where: {
        lessonId: lessonId,
        user: {
          id: req.session.userId,
        },
      },
    });

    if (!userLessonPosition) {
      throw new Error('UserLessonPosition not found');
    }

    userLessonPosition.currentPosition = currentPosition;

    await userLessonPosition.save();

    return userLessonPosition;
  }

  @Mutation(() => UserLessonPosition)
  async updateUserLessonLastSlugSeen(
    @Arg('lessonId') lessonId: string,
    @Arg('lastSlugSeen') lastSlugSeen: string,
    @Ctx() { req }: MyContext
  ): Promise<UserLessonPosition> {
    if (!req.session.userId) {
      throw new Error('Not authorized');
    }

    const userLessonPosition = await UserLessonPosition.findOne({
      where: {
        lessonId: lessonId,
        user: {
          id: req.session.userId,
        },
      },
    });

    if (!userLessonPosition) {
      throw new Error('UserLessonPosition not found');
    }

    userLessonPosition.lastSlugSeen = lastSlugSeen;

    await userLessonPosition.save();

    return userLessonPosition;
  }

  @Mutation(() => UserLessonPosition)
  async createUserLessonPosition(
    @Arg('lessonId') lessonId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserLessonPosition> {
    const lesson = await Lesson.findOne(
      { id: lessonId },
      { relations: ['steps'] }
    );
    const user = await User.findOne({ id: req.session.userId });

    if (!user) {
      throw new Error('Not authorized');
    }

    const userLessonPosition = await UserLessonPosition.create({
      currentPosition: 0,
      lastSlugSeen: lesson?.steps[0].slug,
      lessonId,
      user,
    });

    await userLessonPosition.save();

    return userLessonPosition;
  }

  @Query(() => UserLessonPosition, { nullable: true })
  async userLessonPosition(
    @Arg('lessonId', () => String) lessonId: string,
    @Ctx() ctx: MyContext
  ): Promise<UserLessonPosition> {
    const { req } = ctx;
    const user = await User.findOne({ id: req.session.userId });

    if (!user) {
      throw new Error('Not authorized');
    }

    const userLessonPosition = await UserLessonPosition.findOne({
      where: {
        lessonId: lessonId,
        user: {
          id: req.session.userId,
        },
      },
    });

    if (!userLessonPosition) {
      const newUserLessonPosition = this.createUserLessonPosition(
        lessonId,
        ctx
      );

      return newUserLessonPosition;
    }

    return userLessonPosition;
  }
}
