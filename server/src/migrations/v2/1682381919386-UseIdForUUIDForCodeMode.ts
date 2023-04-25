import {MigrationInterface, QueryRunner} from "typeorm";

export class UseIdForUUIDForCodeMode1682381919386 implements MigrationInterface {
    name = 'UseIdForUUIDForCodeMode1682381919386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_module" RENAME COLUMN "uuid" TO "id"`);
        await queryRunner.query(`ALTER TABLE "code_module" RENAME CONSTRAINT "PK_499cf8daf9050fa9510cf065a18" TO "PK_2f27e8cca5d582e82fabeb997c9"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_module" RENAME CONSTRAINT "PK_2f27e8cca5d582e82fabeb997c9" TO "PK_499cf8daf9050fa9510cf065a18"`);
        await queryRunner.query(`ALTER TABLE "code_module" RENAME COLUMN "id" TO "uuid"`);
    }

}
