import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStepName1609658932593 implements MigrationInterface {
  name = "AddStepName1609658932593";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "name" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "name"`);
  }
}
