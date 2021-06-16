import { Request, Response, Router } from "express";
import { setDb } from "../fixtures/fixtures";

export class HelloController {
  getRouter(): Router {
    const router = Router();
    router.get("/", this.getHello.bind(this));
    router.get("/populate", this.populateDb.bind(this));
    return router;
  }

  async getHello(request: Request, response: Response) {
    response.send("Hello world").status(200);
  }

  async populateDb(request: Request, response: Response) {
    await setDb(10);
    response.send("DB Populated").status(200);
  }
}
