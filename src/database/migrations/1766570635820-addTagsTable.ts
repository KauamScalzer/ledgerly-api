import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsTable1766570635820 implements MigrationInterface {
    name = 'AddTagsTable1766570635820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "owner_user_id" integer NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_owner_user_name" ON "tags" ("owner_user_id", "name") `);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_tags_owner_user" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_tags_owner_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_owner_user_name"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
