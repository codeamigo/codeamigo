import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeStepOptional1609603842059 implements MigrationInterface {
  name = "MakeStepOptional1609603842059";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "step" ADD "name" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "name"`);
  }
}
