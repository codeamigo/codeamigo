import { Arg, Query, Resolver } from 'type-graphql';

import { Lesson } from '../../entities/v2/Lesson';

@Resolver()
export class LessonResolver {
  @Query(() => [Lesson])
  async lessons(): Promise<Lesson[]> {
    return Lesson.find({ relations: ['steps'] });
  }

  @Query(() => Lesson, { nullable: true })
  async lesson(
    @Arg('slug', () => String) slug: string
  ): Promise<Lesson | undefined> {
    const lesson = await Lesson.createQueryBuilder()
      .where('Lesson.slug = :slug', { slug })
      .leftJoinAndSelect('Lesson.steps', 'steps')
      .orderBy('steps.position', 'ASC')
      .addOrderBy('steps.createdAt', 'ASC')
      .getOne();

    return lesson;
  }
}
