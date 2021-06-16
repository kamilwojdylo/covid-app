import request from "supertest";
import { createApp } from "../app";

import { TestRepository } from "../repositories/test.repository";
import { StatsRepository } from "../repositories/stats.repository";
import Test from "../model/test";
import { setDb, setupInMemoryMongoDB } from "../fixtures/fixtures";
import { IAppDeps } from "src/interfaces/app.deps";

describe("TestController", () => {
  const PER_DAY_FIXTURES_COUNT = 10;
  let appDeps: IAppDeps;

  beforeAll(async () => {
    await setupInMemoryMongoDB();
    appDeps = {
      testRepository: new TestRepository(),
      statsRepository: new StatsRepository()
    }
  });

  beforeEach(async () => {
    await setDb(PER_DAY_FIXTURES_COUNT);
  });

  afterEach(async () => {
      await Test.deleteMany({});
  });

  describe("POST /test should", () => {
    it("return stored document with _id", (done) => {
      const body = {
        patientName: "Jan Kowalski",
        patientAge: 99,
        location: { lat: 99, lng: 100 },
        testDate: Date.now(),
        outcome: "negative",
        country: "poland"
      };
      request(createApp(appDeps))
        .post("/test")
        .send(body)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res: { body: { _id: string } }) => {
          if (!res.body._id) {
            throw new Error("The test was not stored in DB");
          }
        })
        .end(done);
    });
    it("return an error when something goes wrong", (done) => {
      const body = {
        patientAge: 99,
        location: { lat: 99, lng: 100 },
        testDate: Date.now(),
        outcome: "negative",
      };
      request(createApp(appDeps))
        .post("/test")
        .send(body)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(500, done);
    });
  });
});
