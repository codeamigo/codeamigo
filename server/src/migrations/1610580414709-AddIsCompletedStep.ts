import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsCompletedStep1610580414709 implements MigrationInterface {
  name = 'AddIsCompletedStep1610580414709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "isCompleted" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "isCompleted"`);
  }
}
