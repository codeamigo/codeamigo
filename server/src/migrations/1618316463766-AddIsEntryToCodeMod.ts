import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsEntryToCodeMod1618316463766 implements MigrationInterface {
    name = 'AddIsEntryToCodeMod1618316463766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_module" ADD "isEntry" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "isEntry"`);
    }

}
