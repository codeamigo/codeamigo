import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsTested1612001073224 implements MigrationInterface {
  name = "AddIsTested1612001073224";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkpoint" ADD "isTested" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "status" text DEFAULT 'EDITTING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "status" character varying DEFAULT 'EDITTING'`
    );
    await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "isTested"`);
  }
}
