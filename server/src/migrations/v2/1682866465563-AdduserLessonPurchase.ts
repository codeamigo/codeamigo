import {MigrationInterface, QueryRunner} from "typeorm";

export class AdduserLessonPurchase1682866465563 implements MigrationInterface {
    name = 'AdduserLessonPurchase1682866465563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_lesson_purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" text NOT NULL, "userId" uuid, CONSTRAINT "PK_8bad8e520233946af67e6d86401" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_lesson_purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" text NOT NULL, "userId" uuid, CONSTRAINT "PK_f62a27d39c2d9274de2987c8979" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "requiresPayment" boolean`);
        await queryRunner.query(`ALTER TABLE "user_lesson_purchase" ADD CONSTRAINT "FK_97d3d3fdc7043ceb0cf329c48c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_lesson_purchases" ADD CONSTRAINT "FK_c18fa38670771ddfc51169da981" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_lesson_purchases" DROP CONSTRAINT "FK_c18fa38670771ddfc51169da981"`);
        await queryRunner.query(`ALTER TABLE "user_lesson_purchase" DROP CONSTRAINT "FK_97d3d3fdc7043ceb0cf329c48c7"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "requiresPayment"`);
        await queryRunner.query(`DROP TABLE "user_lesson_purchases"`);
        await queryRunner.query(`DROP TABLE "user_lesson_purchase"`);
    }

}
