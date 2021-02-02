import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThemeToUser1612296326464 implements MigrationInterface {
  name = "AddThemeToUser1612296326464";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "theme" text DEFAULT 'COBALT'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "theme"`);
  }
}
