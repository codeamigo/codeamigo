import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteLessonSessions1611325908947 implements MigrationInterface {
  name = "DeleteLessonSessions1611325908947";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_09786128e2cb5082286858209a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_09786128e2cb5082286858209a9" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_09786128e2cb5082286858209a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_09786128e2cb5082286858209a9" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
