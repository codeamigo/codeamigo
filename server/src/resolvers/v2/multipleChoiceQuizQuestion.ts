import { Arg, Query, Resolver } from 'type-graphql';

import { MultipleChoiceQuizQuestion } from '../../entities/v2/MultipleChoiceQuizQuestion';

@Resolver()
export class MultipleChoiceQuizQuestionResolver {
  @Query(() => [MultipleChoiceQuizQuestion])
  async multipleChoiceQuizQuestions(
    @Arg('stepId') stepId: string
  ): Promise<MultipleChoiceQuizQuestion[]> {
    const questions = await MultipleChoiceQuizQuestion.find({
      order: {
        createdAt: 'ASC',
      },
      relations: ['step', 'choices'],
      where: {
        step: {
          id: stepId,
        },
      },
    });

    console.log('questions', questions);
    return questions;
  }
}
