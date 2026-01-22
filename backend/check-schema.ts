import { AppDataSource } from './ormconfig';
(async () => {
  const ds = await AppDataSource.initialize();
  const r = await ds.query("SELECT SYS_CONTEXT('USERENV','CURRENT_SCHEMA') AS SCHEMA_NAME FROM dual");
  console.log(r);
  await ds.destroy();
})();
