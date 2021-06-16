import { Request, Response, Router } from "express";
import { ITest } from "src/model/test";
import { TestRepository } from "src/repositories/test.repository";

export class TestController {
  testRepository: TestRepository;
  constructor(testRepository: TestRepository) {
    this.testRepository = testRepository;
  }
  getRouter(): Router {
    const router = Router();
    router.post("/", this.postTest.bind(this));
    return router;
  }

  async postTest(request: Request, response: Response) {
    try {
      const test = request.body;
      const result = await this.testRepository.saveTest(test as ITest);
      return response.status(201).json(result);
    } catch (err) {
      return response.status(500).json(err);
    }
  }
}
