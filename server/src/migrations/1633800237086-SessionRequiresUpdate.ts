import { MigrationInterface, QueryRunner } from 'typeorm';

export class SessionRequiresUpdate1633800237086 implements MigrationInterface {
  name = 'SessionRequiresUpdate1633800237086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ADD "requiresUpdate" boolean`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP COLUMN "requiresUpdate"`
    );
  }
}
