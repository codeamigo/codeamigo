import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonLabel1615557149290 implements MigrationInterface {
  name = "AddLessonLabel1615557149290";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD "label" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "label"`);
  }
}
