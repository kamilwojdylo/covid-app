import { StatsRepository } from "./stats.repository";
import Test, { Country } from "../model/test";

import {
  TOMORROW_HEALTHY,
  getCountryTestsStats,
  TODAY_MIXED,
  THE_DAY_BEFORE_YESTERDAY_NO_TESTS,
  setDb,
  setupInMemoryMongoDB,
} from "../fixtures/fixtures";
import { ICountryStats } from "../interfaces/country.stats";

describe("StatsRepository", () => {
  const PER_DAY_FIXTURES_COUNT = 10;

  beforeAll(async () => {
    await setupInMemoryMongoDB();
  });

  beforeEach(async () => {
    await setDb(PER_DAY_FIXTURES_COUNT);
  });

  afterEach(async () => {
    await Test.deleteMany({});
  });

  describe("getDailyTestsStats should", () => {
    it("return total number of tests per given day", async () => {
      const statsRepository = new StatsRepository();
      const day = TOMORROW_HEALTHY;

      const stats = await statsRepository.getDailyTestsStats(day);

      expect(stats.total).toBe(PER_DAY_FIXTURES_COUNT);
    });

    it("return zero if there were not any test on a given day", async () => {
      const statsRepository = new StatsRepository();
      const day = THE_DAY_BEFORE_YESTERDAY_NO_TESTS;

      const stats = await statsRepository.getDailyTestsStats(day);

      expect(stats.total).toBe(0);
    });

    it("return total number of positive tests per given day", async () => {
      const statsRepository = new StatsRepository();
      const day = TODAY_MIXED;

      const stats = await statsRepository.getDailyTestsStats(day);

      expect(stats.positive).toBe(PER_DAY_FIXTURES_COUNT / 2);
    });
    it("return zero if there was not any positive tests per given day", async () => {
      const statsRepository = new StatsRepository();
      const day = TOMORROW_HEALTHY;

      const stats = await statsRepository.getDailyTestsStats(day);

      expect(stats.positive).toBe(0);
    });
  });
  describe("getCountryTestsStats should", () => {
    it("return total number of tests per country till date", async () => {
      const statsRepository = new StatsRepository();

      const stats = await statsRepository.getCountryTestsStats(TODAY_MIXED);

      expect(stats).toEqual(
        expect.arrayContaining(getCountryTestsStats(PER_DAY_FIXTURES_COUNT, TODAY_MIXED))
      );
    });

    it("return an empty array when there were not any tests", async () => {
      const statsRepository = new StatsRepository();

      const stats = await statsRepository.getCountryTestsStats(THE_DAY_BEFORE_YESTERDAY_NO_TESTS);

      expect(stats).toHaveLength(0);
    });
  });
});
