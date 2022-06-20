import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePicFields1618598282407 implements MigrationInterface {
  name = 'AddProfilePicFields1618598282407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profilePic" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profileColorScheme" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "profileColorScheme"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePic"`);
  }
}
