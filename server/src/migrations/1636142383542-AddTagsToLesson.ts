import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTagsToLesson1636142383542 implements MigrationInterface {
    name = 'AddTagsToLesson1636142383542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag_lessons_lesson" ("tagId" integer NOT NULL, "lessonId" integer NOT NULL, CONSTRAINT "PK_994c7f8b1d841c86e59701288ec" PRIMARY KEY ("tagId", "lessonId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9bd52e0584455d00dfd8b7568e" ON "tag_lessons_lesson" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c3ee515628f74fe826090ae8f" ON "tag_lessons_lesson" ("lessonId") `);
        await queryRunner.query(`CREATE TABLE "lesson_tags_tag" ("lessonId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_52257d2fd270457b3bc470883df" PRIMARY KEY ("lessonId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0d3decff90421aaa56345e189" ON "lesson_tags_tag" ("lessonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0b8f8d3bab741c25404649868e" ON "lesson_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "tag_lessons_lesson" ADD CONSTRAINT "FK_9bd52e0584455d00dfd8b7568ef" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_lessons_lesson" ADD CONSTRAINT "FK_4c3ee515628f74fe826090ae8fd" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_tags_tag" ADD CONSTRAINT "FK_c0d3decff90421aaa56345e1891" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_tags_tag" ADD CONSTRAINT "FK_0b8f8d3bab741c25404649868e4" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_tags_tag" DROP CONSTRAINT "FK_0b8f8d3bab741c25404649868e4"`);
        await queryRunner.query(`ALTER TABLE "lesson_tags_tag" DROP CONSTRAINT "FK_c0d3decff90421aaa56345e1891"`);
        await queryRunner.query(`ALTER TABLE "tag_lessons_lesson" DROP CONSTRAINT "FK_4c3ee515628f74fe826090ae8fd"`);
        await queryRunner.query(`ALTER TABLE "tag_lessons_lesson" DROP CONSTRAINT "FK_9bd52e0584455d00dfd8b7568ef"`);
        await queryRunner.query(`DROP INDEX "IDX_0b8f8d3bab741c25404649868e"`);
        await queryRunner.query(`DROP INDEX "IDX_c0d3decff90421aaa56345e189"`);
        await queryRunner.query(`DROP TABLE "lesson_tags_tag"`);
        await queryRunner.query(`DROP INDEX "IDX_4c3ee515628f74fe826090ae8f"`);
        await queryRunner.query(`DROP INDEX "IDX_9bd52e0584455d00dfd8b7568e"`);
        await queryRunner.query(`DROP TABLE "tag_lessons_lesson"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
