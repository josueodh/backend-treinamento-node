import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export default class CreatePosts1606617154805 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    }, {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    }, {
                        name: 'description',
                        type: 'text',
                    }, {
                        name: 'imageUrl',
                        type: 'varchar',
                    }, {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    }, {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        )
        await queryRunner.createForeignKey('posts', new TableForeignKey({
            name: 'PostUser',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('posts', 'PostUser');
        await queryRunner.dropTable('posts');
    }

}
