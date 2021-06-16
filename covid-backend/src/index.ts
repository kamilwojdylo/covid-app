import { config as dotenvConfig } from "dotenv";
import { connect } from "mongoose";
import { createApp } from "./app";
import { IAppDeps } from "./interfaces/app.deps";
import { StatsRepository } from "./repositories/stats.repository";
import { TestRepository } from "./repositories/test.repository";

connect(process.env["MONGO_URL"]).then(() => {
  dotenvConfig();

  const testRepository = new TestRepository();
  const statsRepository = new StatsRepository();

  const appDeps: IAppDeps = {
    testRepository,
    statsRepository,
  };

  const app = createApp(appDeps);
  const port = Number(process.env["PORT"]);
  app.listen(port, () => console.log(`App listening on :${port}`));
});
