import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class CreateComments1606963445625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: 'comments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'post_id',
                        type: 'uuid',
                    },
                    {
                        name: 'text',
                        type: 'text'
                    }
                ]
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('comments');
    }

}
