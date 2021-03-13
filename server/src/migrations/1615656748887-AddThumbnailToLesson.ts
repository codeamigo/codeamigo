import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnailToLesson1615656748887 implements MigrationInterface {
  name = "AddThumbnailToLesson1615656748887";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "thumbnail" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "thumbnail"`);
  }
}
