import { StatsRepository } from "../repositories/stats.repository";
import { TestRepository } from "../repositories/test.repository";

export interface IAppDeps {
  testRepository: TestRepository;
  statsRepository: StatsRepository;
}
