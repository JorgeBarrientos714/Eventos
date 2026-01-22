import { AppDataSource } from './ormconfig';

(async () => {
  const ds = await AppDataSource.initialize();
  const addCol = async (ddl: string) => {
    await ds.query(
      "BEGIN EXECUTE IMMEDIATE '" +
        ddl +
        "'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -1430 THEN RAISE; END IF; END;",
    );
  };

  await addCol('ALTER TABLE NET_EVENTOS ADD (IMAGEN_BLOB BLOB)');
  await addCol('ALTER TABLE NET_EVENTOS ADD (IMAGEN_MIME VARCHAR2(100))');
  console.log('columns added (or already existed)');
  await ds.destroy();
})();
