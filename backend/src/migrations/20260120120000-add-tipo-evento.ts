import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTipoEvento20260120120000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'NET_EVENTOS',
      new TableColumn({
        name: 'TIPO_EVENTO',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('NET_EVENTOS', 'TIPO_EVENTO');
  }
}
