import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTemplateToLesson1635535158184 implements MigrationInterface {
    name = 'AddTemplateToLesson1635535158184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "template" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "template"`);
    }

}
