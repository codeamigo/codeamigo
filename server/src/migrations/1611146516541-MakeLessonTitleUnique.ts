import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeLessonTitleUnique1611146516541 implements MigrationInterface {
  name = "MakeLessonTitleUnique1611146516541";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD "title" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "UQ_19967be71e1113334304a55fa63" UNIQUE ("title")`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "description" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."description" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."description" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "description" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "UQ_19967be71e1113334304a55fa63"`
    );
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "title" character varying NOT NULL`
    );
  }
}
