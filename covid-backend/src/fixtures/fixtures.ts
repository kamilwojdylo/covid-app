import mongoose from "mongoose";
import Test, { Country, Outcome, Timestamp } from "../model/test";

const DAY_LENGTH = 1000 * 60 * 60 * 24;
const TODAY = (new Date()).getTime();

const OUTCOME_RATIO = 2;
const COUNTRY_RATIO = 3;

export const THE_DAY_BEFORE_YESTERDAY_NO_TESTS = TODAY - 2 * DAY_LENGTH;
export const YESTERDAY_ALL_SICK = TODAY - DAY_LENGTH;
export const TODAY_MIXED = TODAY;
export const TOMORROW_HEALTHY = TODAY + DAY_LENGTH;

export const test = {
  patientName: "Jan Kowalski",
  patientAge: 99,
  location: { lat: 99, lng: 100 },
  testDate: TODAY,
  outcome: "negative",
  country: "poland",
};

export async function setDb(perDayFixturesCount: number): Promise<number> {
  const test = {
    patientName: "Jan Kowalski",
    patientAge: 99,
    location: { lat: 99, lng: 100 },
  };

  const promises = [];
  let outcome: Outcome;
  let testDate: Timestamp;
  let country: Country;
  let testDocument;

  for (let i = 0; i < perDayFixturesCount; i += 1) {
    outcome = "positive";
    testDate = YESTERDAY_ALL_SICK;
    country = i % COUNTRY_RATIO ? "usa" : "poland";

    testDocument = new Test({ ...test, outcome, testDate, country });

    promises.push(testDocument.save());
  }

  for (let i = 0; i < perDayFixturesCount; i += 1) {
    outcome = i % OUTCOME_RATIO ? "positive" : "negative";
    testDate = TODAY_MIXED;
    country = i % COUNTRY_RATIO ? "usa" : "poland";

    testDocument = new Test({ ...test, outcome, testDate, country });

    promises.push(testDocument.save());
  }

  for (let i = 0; i < perDayFixturesCount; i += 1) {
    outcome = "negative";
    testDate = TOMORROW_HEALTHY;
    country = i % COUNTRY_RATIO ? "usa" : "poland";

    testDocument = new Test({ ...test, outcome, testDate, country });

    promises.push(testDocument.save());
  }

  await Promise.all(promises);
  return promises.length;
}

export async function clearDb() {
  await Test.deleteMany({});
}

export async function setupInMemoryMongoDB() {
  const dbUri = process.env["MONGO_URL"];
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export function numberOfTestInPoland(perDayFixturesCount: number) {
  const minor = Math.floor(perDayFixturesCount / 3) + 1;
  return perDayFixturesCount - minor + 2 * minor;
}

export function numberOfTestInUsa(perDayFixturesCount: number) {
  const minor = Math.floor(perDayFixturesCount / 3) + 1;
  const major = perDayFixturesCount - minor;

  return minor + 2 * major;
}

function prepareCountryTestsStats(poland: number, usa: number) {
  return [
    { _id: "poland", total: poland },
    { _id: "usa", total: usa },
  ];
}
export function getCountryTestsStats(perDayFixturesCount: number, day: number) {
  const minor = Math.floor(perDayFixturesCount / 3) + 1;
  const major = perDayFixturesCount - minor;

  switch (day) {
    case THE_DAY_BEFORE_YESTERDAY_NO_TESTS:
      return prepareCountryTestsStats(0, 0);

    case YESTERDAY_ALL_SICK:
      return prepareCountryTestsStats(minor, major);

    case TODAY_MIXED:
      const mixedHealthDayCountryRatio = COUNTRY_RATIO - 1;
      return prepareCountryTestsStats(
        mixedHealthDayCountryRatio * minor,
        mixedHealthDayCountryRatio * major
      );

    case TOMORROW_HEALTHY:
      return prepareCountryTestsStats(
        COUNTRY_RATIO * minor,
        COUNTRY_RATIO * major
      );

    default:
      return prepareCountryTestsStats(3 * minor, 3 * major);
  }
}