import express from "express";
import cors from 'cors';
import { HelloController } from "./controller/hello.controller";
import { StatsController } from "./controller/stats.controller";
import { TestController } from './controller/test.controller';
import { IAppDeps } from './interfaces/app.deps';

export function createApp(appDeps: IAppDeps) {
  const helloController = new HelloController();
  const testController = new TestController(appDeps.testRepository);
  const statsController = new StatsController(appDeps.statsRepository);

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use("/", helloController.getRouter());
  app.use("/test", testController.getRouter());
  app.use("/stats", statsController.getRouter());
  return app;
}
