import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrenctCheckpointCol1614351220445
  implements MigrationInterface {
  name = 'AddCurrenctCheckpointCol1614351220445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "step" ADD "currentCheckpointId" integer`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "step" DROP COLUMN "currentCheckpointId"`
    );
  }
}
