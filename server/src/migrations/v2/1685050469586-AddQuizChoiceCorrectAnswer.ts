import {MigrationInterface, QueryRunner} from "typeorm";

export class AddQuizChoiceCorrectAnswer1685050469586 implements MigrationInterface {
    name = 'AddQuizChoiceCorrectAnswer1685050469586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" ADD "isCorrectAnswer" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" DROP COLUMN "isCorrectAnswer"`);
    }

}
