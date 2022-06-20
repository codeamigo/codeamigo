import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPositionToStep1637508278952 implements MigrationInterface {
  name = 'AddPositionToStep1637508278952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" ADD "position" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "position"`);
  }
}
