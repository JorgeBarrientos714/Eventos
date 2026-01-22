import { AppDataSource } from './ormconfig';
(async () => {
  const ds = await AppDataSource.initialize();
  const r = await ds.query("SELECT * FROM migrations ORDER BY id DESC");
  console.log(r);
  await ds.destroy();
})();
