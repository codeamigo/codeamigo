import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExecutionTypeAndTemplate1682688216417 implements MigrationInterface {
    name = 'AddExecutionTypeAndTemplate1682688216417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" ADD "executionType" text NOT NULL DEFAULT 'sandpack'`);
        await queryRunner.query(`ALTER TABLE "step" ADD "template" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "template"`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "executionType"`);
    }

}
