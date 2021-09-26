import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeToExecutableType1631984990362 implements MigrationInterface {
    name = 'ChangeToExecutableType1631984990362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" RENAME COLUMN "isExecutableByBrowser" TO "executionType"`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "executionType"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "executionType" text NOT NULL DEFAULT 'sandpack'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "executionType"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "executionType" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "step" RENAME COLUMN "executionType" TO "isExecutableByBrowser"`);
    }

}
