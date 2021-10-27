import {MigrationInterface, QueryRunner} from "typeorm";

export class AddViewsToLesson1635297054417 implements MigrationInterface {
    name = 'AddViewsToLesson1635297054417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "views" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "views"`);
    }

}
