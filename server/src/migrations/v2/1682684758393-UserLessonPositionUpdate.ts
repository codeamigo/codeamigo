import {MigrationInterface, QueryRunner} from "typeorm";

export class UserLessonPositionUpdate1682684758393 implements MigrationInterface {
    name = 'UserLessonPositionUpdate1682684758393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_lesson_position" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_lesson_position" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_lesson_position" ADD CONSTRAINT "FK_d05dd03ae07cb29fd590fb54653" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_lesson_position" DROP CONSTRAINT "FK_d05dd03ae07cb29fd590fb54653"`);
        await queryRunner.query(`ALTER TABLE "user_lesson_position" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_lesson_position" ADD "userId" text NOT NULL`);
    }

}
