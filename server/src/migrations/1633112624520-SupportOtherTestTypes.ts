import {MigrationInterface, QueryRunner} from "typeorm";

export class SupportOtherTestTypes1633112624520 implements MigrationInterface {
    name = 'SupportOtherTestTypes1633112624520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "matchRegex" character varying`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "fileToMatchRegex" integer`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "output" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "output"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "fileToMatchRegex"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "matchRegex"`);
    }

}
