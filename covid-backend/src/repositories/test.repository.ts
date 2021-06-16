import Test, { ITest, ITestDocument } from "../model/test";

export class TestRepository {
  async saveTest(test: ITest): Promise<ITestDocument> {
    const testModel = new Test(test);
    await testModel.validate();

    return await testModel.save();
  }
}
