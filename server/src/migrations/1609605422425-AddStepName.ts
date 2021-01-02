import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStepName1609605422425 implements MigrationInterface {
  name = "AddStepName1609605422425";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "step" ADD "name" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "name"`);
  }
}
