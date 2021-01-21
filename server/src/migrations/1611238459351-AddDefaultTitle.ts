import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultTitle1611238459351 implements MigrationInterface {
  name = "AddDefaultTitle1611238459351";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."title" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "title" SET DEFAULT ''`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "title" DROP DEFAULT`
    );
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."title" IS NULL`);
  }
}
