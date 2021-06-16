import request from "supertest";
import { createApp } from "../app";

import { TestRepository } from "../repositories/test.repository";
import { StatsRepository } from "../repositories/stats.repository";
import {
  TOMORROW_HEALTHY,
  clearDb,
  getCountryTestsStats,
  TODAY_MIXED,
  THE_DAY_BEFORE_YESTERDAY_NO_TESTS,
  setDb,
  setupInMemoryMongoDB,
  YESTERDAY_ALL_SICK,
} from "../fixtures/fixtures";
import { IAppDeps } from "src/interfaces/app.deps";
import { ICountryStats } from "src/interfaces/country.stats";

describe("StatsController", () => {
  const PER_DAY_FIXTURES_COUNT = 10;
  let appDeps: IAppDeps;

  beforeAll(async () => {
    await setupInMemoryMongoDB();
    appDeps = {
      testRepository: new TestRepository(),
      statsRepository: new StatsRepository(),
    };
  });

  beforeEach(async () => {
    await setDb(PER_DAY_FIXTURES_COUNT);
  });

  afterEach(async () => {
    await clearDb();
  });

  describe("GET /stats/daily should", () => {
    beforeAll(() => {});
    it("return total number of tests per day", (done) => {
      request(createApp(appDeps))
        .get(`/stats/daily/${TOMORROW_HEALTHY}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res: { body: { total: number; positive: number } }) => {
          expect(res.body.total).toBe(PER_DAY_FIXTURES_COUNT);
        })
        .end(done);
    });

    it("return total number of positive tests per day", (done) => {
      request(createApp(appDeps))
        .get(`/stats/daily/${TODAY_MIXED}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res: { body: { total: number; positive: number } }) => {
          expect(res.body.positive).toBe(PER_DAY_FIXTURES_COUNT / 2);
        })
        .end(done);
    });

    it("return zero if there were not any tests during the day", (done) => {
      request(createApp(appDeps))
        .get(`/stats/daily/${THE_DAY_BEFORE_YESTERDAY_NO_TESTS}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res: { body: { total: number; positive: number } }) => {
          expect(res.body.total).toBe(0);
        })
        .end(done);
    });

    it("return zero if there every test was negative", (done) => {
      request(createApp(appDeps))
        .get(`/stats/daily/${TOMORROW_HEALTHY}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((res: { body: { total: number; positive: number } }) => {
          expect(res.body.positive).toBe(0);
        })
        .end(done);
    });
  });

  describe("GET /stats/country should", () => {
    it.each([
      {
        testDay: THE_DAY_BEFORE_YESTERDAY_NO_TESTS,
        expected: [],
      },
      {
        testDay: YESTERDAY_ALL_SICK,
        expected: getCountryTestsStats(
          PER_DAY_FIXTURES_COUNT,
          YESTERDAY_ALL_SICK
        ),
      },
      {
        testDay: TODAY_MIXED,
        expected: getCountryTestsStats(PER_DAY_FIXTURES_COUNT, TODAY_MIXED),
      },
      {
        testDay: TOMORROW_HEALTHY,
        expected: getCountryTestsStats(
          PER_DAY_FIXTURES_COUNT,
          TOMORROW_HEALTHY
        ),
      }
    ])(
      "return total number of tests from all countries",
      async ({testDay, expected}) => {
        await request(createApp(appDeps))
          // .get(`/stats/country/${dataSet.testDay}`)
          .get(`/stats/country/${testDay}`)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .expect(200)
          .expect("Content-Type", /json/)
          .expect((res: { body: ICountryStats[] }) => {
            expect(res.body).toEqual(expect.arrayContaining(expected));
          });
      }
    );
  });
});
