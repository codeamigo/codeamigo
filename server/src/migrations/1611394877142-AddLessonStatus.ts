import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonStatus1611394877142 implements MigrationInterface {
  name = "AddLessonStatus1611394877142";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "status" character varying DEFAULT 'EDITTING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
  }
}
