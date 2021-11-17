import { MigrationInterface, QueryRunner } from "typeorm";

export class CodeModuleUseUUID1637069918771 implements MigrationInterface {
  name = "CodeModuleUseUUID1637069918771";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "code_module" RENAME COLUMN "id" TO "uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" RENAME CONSTRAINT "PK_2f27e8cca5d582e82fabeb997c9" TO "PK_499cf8daf9050fa9510cf065a18"`
    );
    await queryRunner.query(
      `ALTER SEQUENCE "code_module_id_seq" RENAME TO "code_module_uuid_seq"`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" DROP CONSTRAINT "PK_499cf8daf9050fa9510cf065a18"`
    );
    await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "code_module" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" ADD CONSTRAINT "PK_499cf8daf9050fa9510cf065a18" PRIMARY KEY ("uuid")`
    );
    await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "moduleId"`);
    await queryRunner.query(
      `ALTER TABLE "checkpoint" ADD "moduleId" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "moduleId"`);
    await queryRunner.query(`ALTER TABLE "checkpoint" ADD "moduleId" integer`);
    await queryRunner.query(
      `ALTER TABLE "code_module" DROP CONSTRAINT "PK_499cf8daf9050fa9510cf065a18"`
    );
    await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "code_module" ADD "uuid" SERIAL NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" ADD CONSTRAINT "PK_499cf8daf9050fa9510cf065a18" PRIMARY KEY ("uuid")`
    );
    await queryRunner.query(
      `ALTER SEQUENCE "code_module_uuid_seq" RENAME TO "code_module_id_seq"`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" RENAME CONSTRAINT "PK_499cf8daf9050fa9510cf065a18" TO "PK_2f27e8cca5d582e82fabeb997c9"`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" RENAME COLUMN "uuid" TO "id"`
    );
  }
}
