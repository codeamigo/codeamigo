import {MigrationInterface, QueryRunner} from "typeorm";

export class UserLessonPosition1682618158209 implements MigrationInterface {
    name = 'UserLessonPosition1682618158209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson_position" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5eb6d6083ebf39d27c38c4e7f81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_lesson_position" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastSlugSeen" text NOT NULL, "currentPosition" integer NOT NULL DEFAULT '0', "lessonId" text NOT NULL, "userId" text NOT NULL, CONSTRAINT "PK_0a4047fa394ad362577e8c22227" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_lesson_position"`);
        await queryRunner.query(`DROP TABLE "lesson_position"`);
    }

}
