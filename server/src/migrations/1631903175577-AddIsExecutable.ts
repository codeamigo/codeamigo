import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsExecutable1631903175577 implements MigrationInterface {
    name = 'AddIsExecutable1631903175577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" ADD "isExecutableByBrowser" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "isExecutableByBrowser"`);
    }

}
