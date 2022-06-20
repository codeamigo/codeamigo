import { MigrationInterface, QueryRunner } from 'typeorm';

export class GithubLogin1614703848554 implements MigrationInterface {
  name = 'GithubLogin1614703848554';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "githubId" text`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_0d84cc6a830f0e4ebbfcd6381dd" UNIQUE ("githubId")`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user"."password" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "user"."password" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_0d84cc6a830f0e4ebbfcd6381dd"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "githubId"`);
  }
}
