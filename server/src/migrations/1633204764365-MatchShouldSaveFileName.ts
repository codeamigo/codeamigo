import {MigrationInterface, QueryRunner} from "typeorm";

export class MatchShouldSaveFileName1633204764365 implements MigrationInterface {
    name = 'MatchShouldSaveFileName1633204764365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "fileToMatchRegex"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "fileToMatchRegex" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "fileToMatchRegex"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "fileToMatchRegex" integer`);
    }

}
