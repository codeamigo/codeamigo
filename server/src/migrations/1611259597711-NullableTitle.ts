import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableTitle1611259597711 implements MigrationInterface {
  name = "NullableTitle1611259597711";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "title" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."title" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "lesson"."title" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "title" SET NOT NULL`
    );
  }
}
