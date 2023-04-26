import { Arg, Query, Resolver } from 'type-graphql';

import { Step } from '../../entities/v2/Step';

@Resolver()
export class StepResolver {
  @Query(() => [Step])
  steps(): Promise<Step[]> {
    return Step.find();
  }

  @Query(() => Step, { nullable: true })
  async step(
    @Arg('slug', () => String) slug: string
  ): Promise<(Step & { nextSlug: string; prevSlug: string }) | undefined> {
    const step = await Step.createQueryBuilder()
      .where('Step.slug = :slug', { slug })
      .leftJoinAndSelect('Step.lesson', 'lesson')
      .leftJoinAndSelect('Step.codeModules', 'codeModules')
      .leftJoinAndSelect('Step.checkpoints', 'checkpoints')
      .addOrderBy('checkpoints.createdAt', 'ASC')
      .getOne();

    if (!step) {
      return undefined;
    }

    const nextStep = await Step.createQueryBuilder()
      .where('Step.lessonId = :lessonId', { lessonId: step.lesson.id })
      .andWhere('Step.position > :position', { position: step.position })
      .orderBy('Step.position', 'ASC')
      .addOrderBy('Step.createdAt', 'ASC')
      .getOne();

    const prevStep = await Step.createQueryBuilder()
      .where('Step.lessonId = :lessonId', { lessonId: step.lesson.id })
      .andWhere('Step.position < :position', { position: step.position })
      .orderBy('Step.position', 'DESC')
      .addOrderBy('Step.createdAt', 'DESC')
      .getOne();

    // BUG: typeorm escapes backslashes
    // change \\n in step.instructions
    step.instructions = step.instructions.replace(/\\n/g, '\n');

    return {
      ...step,
      nextSlug: nextStep?.slug,
      prevSlug: prevStep?.slug,
    } as Step & {
      nextSlug: string;
      prevSlug: string;
    };
  }
}
