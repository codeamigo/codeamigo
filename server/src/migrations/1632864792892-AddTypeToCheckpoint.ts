import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTypeToCheckpoint1632864792892 implements MigrationInterface {
    name = 'AddTypeToCheckpoint1632864792892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "type" text NOT NULL DEFAULT 'spec'`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ALTER COLUMN "test" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "checkpoint"."test" IS NULL`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ALTER COLUMN "moduleId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "checkpoint"."moduleId" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "checkpoint"."moduleId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ALTER COLUMN "moduleId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "checkpoint"."test" IS NULL`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ALTER COLUMN "test" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "type"`);
    }

}
