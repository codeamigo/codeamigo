import { MigrationInterface, QueryRunner } from 'typeorm';

export class LessonToSession1610574802948 implements MigrationInterface {
  name = 'LessonToSession1610574802948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_09786128e2cb5082286858209a9" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_09786128e2cb5082286858209a9"`
    );
  }
}
