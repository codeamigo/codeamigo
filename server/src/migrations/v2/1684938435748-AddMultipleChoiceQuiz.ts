import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMultipleChoiceQuiz1684938435748 implements MigrationInterface {
    name = 'AddMultipleChoiceQuiz1684938435748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "multiple_choice_quiz_choice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "hint" boolean, "questionId" uuid, CONSTRAINT "PK_78b6078e57f642e159725bc090f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "multiple_choice_quiz_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "isCorrect" boolean, "userId" uuid, "stepId" uuid, CONSTRAINT "PK_7a38f3291508eafefb6f8ffe5fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "default_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "stepId" uuid, CONSTRAINT "PK_3d7b8aed2b4034f7b9bda8f180f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" ADD CONSTRAINT "FK_56b1ed92d8b47982c3f5aa97723" FOREIGN KEY ("questionId") REFERENCES "multiple_choice_quiz_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_question" ADD CONSTRAINT "FK_32209b19bfc7c1c24d27ac9df45" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_question" ADD CONSTRAINT "FK_9d5f6f8c32c3953f2d1cb179859" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "default_question" ADD CONSTRAINT "FK_f1496a752fd909af4cf9eca2acf" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "default_question" DROP CONSTRAINT "FK_f1496a752fd909af4cf9eca2acf"`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_question" DROP CONSTRAINT "FK_9d5f6f8c32c3953f2d1cb179859"`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_question" DROP CONSTRAINT "FK_32209b19bfc7c1c24d27ac9df45"`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_quiz_choice" DROP CONSTRAINT "FK_56b1ed92d8b47982c3f5aa97723"`);
        await queryRunner.query(`DROP TABLE "default_question"`);
        await queryRunner.query(`DROP TABLE "multiple_choice_quiz_question"`);
        await queryRunner.query(`DROP TABLE "multiple_choice_quiz_choice"`);
    }

}
