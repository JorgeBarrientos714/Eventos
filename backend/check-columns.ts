import { AppDataSource } from './ormconfig';
(async () => {
  const ds = await AppDataSource.initialize();
  const r = await ds.query("SELECT column_name FROM user_tab_cols WHERE table_name = 'NET_EVENTOS' AND column_name LIKE 'IMAGEN%'");
  console.log(r);
  await ds.destroy();
})();
