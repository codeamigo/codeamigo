import { MigrationInterface, QueryRunner } from 'typeorm';

export class StepTitle1682418044375 implements MigrationInterface {
  name = 'StepTitle1682418044375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "title" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "title"`);
  }
}
