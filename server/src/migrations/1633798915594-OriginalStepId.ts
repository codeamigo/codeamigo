import { MigrationInterface, QueryRunner } from 'typeorm';

export class OriginalStepId1633798915594 implements MigrationInterface {
  name = 'OriginalStepId1633798915594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "originalStepId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "originalStepId"`);
  }
}
