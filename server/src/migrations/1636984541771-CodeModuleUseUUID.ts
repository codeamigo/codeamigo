import {MigrationInterface, QueryRunner} from "typeorm";

export class CodeModuleUseUUID1636984541771 implements MigrationInterface {
    name = 'CodeModuleUseUUID1636984541771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "PK_fb655af374a55cd33dc2af73731"`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "PK_499cf8daf9050fa9510cf065a18" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "moduleId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "moduleId"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "moduleId" integer`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "PK_499cf8daf9050fa9510cf065a18"`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "PK_fb655af374a55cd33dc2af73731" PRIMARY KEY ("uuid", "id")`);
    }

}
