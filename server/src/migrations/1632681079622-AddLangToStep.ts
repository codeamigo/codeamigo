import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLangToStep1632681079622 implements MigrationInterface {
    name = 'AddLangToStep1632681079622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" ADD "lang" character varying NOT NULL DEFAULT 'javascript'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "lang"`);
    }

}
