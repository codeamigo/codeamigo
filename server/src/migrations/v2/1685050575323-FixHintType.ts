import {MigrationInterface, QueryRunner} from "typeorm";

export class FixHintType1685050575323 implements MigrationInterface {
    name = 'FixHintType1685050575323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" DROP COLUMN "hint"`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" ADD "hint" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" DROP COLUMN "hint"`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" ADD "hint" boolean`);
    }

}
