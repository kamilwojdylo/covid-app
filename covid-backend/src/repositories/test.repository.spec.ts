import { TestRepository } from "./test.repository";
import { setupInMemoryMongoDB, test } from "../fixtures/fixtures";
import { ITest } from "../model/test";

describe("TestRepository", () => {
  beforeAll(async () => {
    await setupInMemoryMongoDB();
  });

  describe("saveTest should", () => {
    it("store a new test to DB", async () => {
      const testRepository = new TestRepository();

      const result = await testRepository.saveTest(test as ITest);

      expect(result._id).toBeDefined();
    });

    describe("throw when required field is missing", () => {
      it.each(Object.keys(test))('throws when "%s" field is missing', async (missingField) => {
        const testRepository = new TestRepository();

        try {
          await testRepository.saveTest({...test, [missingField]: undefined} as ITest);
        } catch (err) {
          return;
        }

        fail(`saveTest did not throw when ${missingField} data was passed`);
      });
    });
  });
});
