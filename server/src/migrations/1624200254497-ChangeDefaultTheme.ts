import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDefaultTheme1624200254497 implements MigrationInterface {
  name = 'ChangeDefaultTheme1624200254497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "user"."theme" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "theme" SET DEFAULT 'IDLE'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "theme" SET DEFAULT 'Cobalt'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user"."theme" IS NULL`);
  }
}
