import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { MultipleChoiceQuizQuestion } from '../../entities/v2/MultipleChoiceQuizQuestion';
import { User } from '../../entities/v2/User';

@Resolver()
export class MultipleChoiceQuizQuestionResolver {
  @Mutation(() => MultipleChoiceQuizQuestion)
  async updateMultipleChoiceQuizQuestion(
    @Arg('multipleChoiceQuizQuestionId') questionId: string,
    @Arg('isCorrect') isCorrect: boolean,
    @Ctx() { req }: MyContext
  ): Promise<MultipleChoiceQuizQuestion> {
    if (!req.session.userId) {
      throw new Error('Not authorized');
    }

    const multipleChoiceQuizQuestion = await MultipleChoiceQuizQuestion.findOne(
      {
        id: questionId,
      }
    );

    if (!multipleChoiceQuizQuestion) {
      throw new Error('MultipleChoiceQuizQuestion not found');
    }

    if (multipleChoiceQuizQuestion.user.id !== req.session.userId) {
      throw new Error('Not authorized');
    }

    multipleChoiceQuizQuestion.isCorrect = isCorrect;

    await multipleChoiceQuizQuestion.save();

    return multipleChoiceQuizQuestion;
  }

  @Mutation(() => MultipleChoiceQuizQuestion)
  async createMultipleChoiceQuizQuestion(
    @Arg('questionId') questionId: string,
    @Ctx() { req }: MyContext
  ): Promise<MultipleChoiceQuizQuestion> {
    const originalMultipleChoiceQuizQuestion = await MultipleChoiceQuizQuestion.findOne(
      {
        id: questionId,
      }
    );

    if (!originalMultipleChoiceQuizQuestion) {
      throw new Error('MultipleChoiceQuizQuestion not found');
    }

    const newMultipleChoiceQuizQuestion = await MultipleChoiceQuizQuestion.create(
      {
        ...originalMultipleChoiceQuizQuestion,
        step: {
          id: originalMultipleChoiceQuizQuestion.step.id,
        },
      }
    );
    const user = await User.findOne({ id: req.session.userId });

    if (req.session.userId && user) {
      newMultipleChoiceQuizQuestion.user = user;
    }

    await newMultipleChoiceQuizQuestion.save();

    return newMultipleChoiceQuizQuestion;
  }

  @Query(() => [MultipleChoiceQuizQuestion])
  async multipleChoiceQuizQuestions(
    @Arg('stepId') stepId: string,
    @Ctx() ctx: MyContext
  ): Promise<MultipleChoiceQuizQuestion[]> {
    const { req } = ctx;
    const questions = await MultipleChoiceQuizQuestion.find({
      order: {
        createdAt: 'ASC',
      },
      relations: ['step', 'user', 'choices'],
      where: {
        step: {
          id: stepId,
        },
        user: null,
      },
    });

    const user = await User.findOne({ id: req.session.userId });

    if (user) {
      const userMultipleChoiceQuizQuestions = await MultipleChoiceQuizQuestion.find(
        {
          relations: ['user', 'step', 'choices'],
          where: {
            step: {
              id: stepId,
            },
            user: {
              id: user?.id,
            },
          },
        }
      );

      if (!userMultipleChoiceQuizQuestions.length) {
        const newMultipleChoiceQuizQuestions: MultipleChoiceQuizQuestion[] = [];
        for (const q of questions) {
          const newMultipleChoiceQuizQuestion = await this.createMultipleChoiceQuizQuestion(
            q.id,
            ctx
          );
          const multipleChoiceQuizQuestion = await MultipleChoiceQuizQuestion.findOne(
            newMultipleChoiceQuizQuestion.id,
            {
              relations: ['step', 'user', 'choices'],
            }
          );

          newMultipleChoiceQuizQuestions.push(multipleChoiceQuizQuestion!);
        }

        return newMultipleChoiceQuizQuestions;
      } else {
        return userMultipleChoiceQuizQuestions;
      }
    }

    return questions;
  }
}
