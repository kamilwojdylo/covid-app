import { ICountryStats } from "src/interfaces/country.stats";
import { IDailyStats } from "src/interfaces/daily.stats";
import Test, { Timestamp } from "../model/test";

export class StatsRepository {
  private endOfDay(day: Timestamp) {
    return new Date(day).setUTCHours(23, 59, 59, 999);
  }

  private startOfDay(day: Timestamp) {
    return new Date(day).setUTCHours(0, 0, 0, 0);
  }
  async getDailyTestsStats(day: Timestamp): Promise<IDailyStats> {
    const start = this.startOfDay(day);
    const end = this.endOfDay(day);

    const result = await Test.aggregate([
      {
        $match: {
          $and: [{ testDate: { $gte: start } }, { testDate: { $lte: end } }],
        },
      },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: "total",
                testPerDay: {
                  $sum: 1,
                },
              },
            },
          ],
          positive: [
            { $match: { outcome: "positive" } },
            {
              $group: {
                _id: "positive",
                testPerDay: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);

    const total = result[0].total[0]?.testPerDay || 0;
    const positive = result[0].positive[0]?.testPerDay || 0;

    return ({ total, positive });
  }

  async getCountryTestsStats(day: Timestamp): Promise<ICountryStats[]> {
    const end = this.endOfDay(day);

    const result = await Test.aggregate([
      {
        $match: {testDate: {$lte: end}}
      },
      {
        $group: {
          _id: "$country",
          total: {
            $sum: 1
          }
        }
      }
    ]);

    return result;
  }
}
