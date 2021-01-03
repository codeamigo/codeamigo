import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStepName1609659919776 implements MigrationInterface {
  name = "AddStepName1609659919776";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "name" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "name"`);
  }
}
