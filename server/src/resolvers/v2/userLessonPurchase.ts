import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Lesson } from '../../entities/v2/Lesson';
import { User } from '../../entities/v2/User';
import { UserLessonPurchase } from '../../entities/v2/UserLessonPurchase';

@Resolver()
export class UserLessonPurchaseResolver {
  @Mutation(() => UserLessonPurchase)
  async createUserLessonPurchase(
    @Arg('lessonId') lessonId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserLessonPurchase> {
    const lesson = await Lesson.findOne({ id: lessonId });
    const user = await User.findOne({ id: req.session.userId });

    if (!user) {
      throw new Error('Not authorized');
    }

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const userLessonPurchase = await UserLessonPurchase.create({
      lessonId: lesson.id,
      user,
    });

    await userLessonPurchase.save();

    return userLessonPurchase;
  }

  @Query(() => UserLessonPurchase, { nullable: true })
  async userLessonPurchase(
    @Arg('lessonId', () => String) lessonId: string,
    @Ctx() ctx: MyContext
  ): Promise<UserLessonPurchase | null> {
    const { req } = ctx;
    const user = await User.findOne({ id: req.session.userId });

    if (!user) {
      throw new Error('Not authorized');
    }

    const userLessonPurchase = await UserLessonPurchase.findOne({
      where: {
        lessonId: lessonId,
        user: {
          id: req.session.userId,
        },
      },
    });

    if (!userLessonPurchase) {
      return null;
    }

    return userLessonPurchase;
  }
}
