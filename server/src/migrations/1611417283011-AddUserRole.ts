import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1611417283011 implements MigrationInterface {
  name = "AddUserRole1611417283011";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" text DEFAULT 'USER'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
