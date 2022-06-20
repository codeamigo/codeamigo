import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueTitle1611263201210 implements MigrationInterface {
  name = 'UniqueTitle1611263201210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD "title" text`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "UQ_19967be71e1113334304a55fa63" UNIQUE ("title")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "UQ_19967be71e1113334304a55fa63"`
    );
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "title" character varying`
    );
  }
}
