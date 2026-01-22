import { MigrationInterface, QueryRunner } from 'typeorm';

export class WidenClaseAndSeedClases20260116095000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Aumentar longitud del nombre de clase
    await queryRunner.query(`
      ALTER TABLE "NET_CLASES" MODIFY ("NOMBRE_CLASE" VARCHAR2(120 BYTE))
    `);

    // ===== GERIATRIA =====
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Brigadas de Salud La Paz', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Brigadas de Salud Comayagua', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Brigadas de Salud Danli', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Brigadas de Salud Siguatepeque y Taulabe', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Brigadas de Salud Tegucigalpa', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA'))
    `);

    // ===== TERAPIA OCUPACIONAL =====
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Jornadas recreativas 1', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Jornada Recreativa 2', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Jornada Recreativa 3', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Encuentro de Terapia Ocupacional', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Adulto Mayor', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Terapias Ocupacionales Taller de manualidades', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Jornadas Navideñas', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Expo Ventas', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Capacitacion para emprendedores', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='TERAPIA OCUPACIONAL'))
    `);

    // ===== PSICOLOGIA =====
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Campamento por la Vida (3)', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Capacitaciones del Cuidado al Cuidador (2)', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Encuentros de formacion (10)', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Acompañamiento psicologico', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Celebración del Dia de Madre y Padre', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Sobrevivencia', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
    // Acortar para encajar en 120 y evitar truncado
    await queryRunner.query(`
      INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('Conferencia de Preparacion: vida del jubilado/pensionado (entrega de Oficio)', (SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='PSICOLOGIA'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar las clases insertadas
    const nombres = [
      'Brigadas de Salud La Paz',
      'Brigadas de Salud Comayagua',
      'Brigadas de Salud Danli',
      'Brigadas de Salud Siguatepeque y Taulabe',
      'Brigadas de Salud Tegucigalpa',
      'Jornadas recreativas 1',
      'Jornada Recreativa 2',
      'Jornada Recreativa 3',
      'Encuentro de Terapia Ocupacional',
      'Adulto Mayor',
      'Terapias Ocupacionales Taller de manualidades',
      'Jornadas Navideñas',
      'Expo Ventas',
      'Capacitacion para emprendedores',
      'Campamento por la Vida (3)',
      'Capacitaciones del Cuidado al Cuidador (2)',
      'Encuentros de formacion (10)',
      'Acompañamiento psicologico',
      'Celebración del Dia de Madre y Padre',
      'Sobrevivencia',
      'Conferencia de Preparacion: vida del jubilado/pensionado (entrega de Oficio)'
    ];

    for (const nombre of nombres) {
      await queryRunner.query(`DELETE FROM "NET_CLASES" WHERE "NOMBRE_CLASE" = '${nombre.replace(/'/g, "''")}'`);
    }

    // Restaurar longitud si es necesario
    await queryRunner.query(`
      ALTER TABLE "NET_CLASES" MODIFY ("NOMBRE_CLASE" VARCHAR2(50 BYTE))
    `);
  }
}
