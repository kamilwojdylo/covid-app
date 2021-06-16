import { Request, Response, Router } from "express";
import { StatsRepository } from "../repositories/stats.repository";

export class StatsController {
  statsRepository: StatsRepository;
  constructor(statsRepository: StatsRepository) {
    this.statsRepository = statsRepository;
  }
  getRouter(): Router {
    const router = Router();
    router.get("/daily/:timestamp", this.getDailyTestsStats.bind(this));
    router.get("/country/:timestamp", this.getCountryTestsStats.bind(this));
    return router;
  }

  async getDailyTestsStats(request: Request, response: Response) {
    const day = parseInt(request.params.timestamp, 10);
    const stats = await this.statsRepository.getDailyTestsStats(day);
    return response.status(200).json(stats);
  }

  async getCountryTestsStats(request: Request, response: Response) {
    const day = parseInt(request.params.timestamp, 10);
    const stats = await this.statsRepository.getCountryTestsStats(day);
    return response.status(200).json(stats);
  }
}
