import { Arg, Query, Resolver } from 'type-graphql';

import { Lesson } from '../../entities/v2/Lesson';

@Resolver()
export class LessonResolver {
  @Query(() => [Lesson])
  async lessons(): Promise<Lesson[]> {
    return Lesson.createQueryBuilder()
      .leftJoinAndSelect('Lesson.steps', 'steps')
      .orderBy('steps.position', 'ASC')
      .getMany();
  }

  @Query(() => Lesson, { nullable: true })
  async lesson(
    @Arg('slug', () => String) slug: string
  ): Promise<Lesson | undefined> {
    const lesson = await Lesson.createQueryBuilder()
      .where('Lesson.slug = :slug', { slug })
      .leftJoinAndSelect('Lesson.steps', 'steps')
      .orderBy('steps.position', 'ASC')
      .getOne();

    return lesson;
  }
}
