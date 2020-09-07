import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Simple Queries", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("05", "06");
  }, minutes(3));

  it(
    "should select total budget and revenue from movies, by using adjusted financial data",
    async done => {
      const query = `select ROUND(SUM(budget_adjusted), 2) as total_budget, ROUND(SUM(revenue_adjusted), 2) as total_revenue from movies`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        total_budget: 190130349695.48,
        total_revenue: 555818960433.08
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select count from movies where budget was more than 100000000",
    async done => {
      const query = `select count(*) as count from movies where budget > 100000000`;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(282);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three movies order by budget where release data is after 2009",
    async done => {
      const query = `select original_title, budget, revenue from movies order by budget DESC limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          budget: 425000000.0,
          revenue: 11087569.0
        },
        {
          original_title: "Pirates of the Caribbean: On Stranger Tides",
          budget: 380000000.0,
          revenue: 1021683000.0
        },
        {
          original_title: "Pirates of the Caribbean: At World's End",
          budget: 300000000.0,
          revenue: 961000000.0
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies where homepage is secure (starts with https)",
    async done => {
      const query = `select count(homepage) as count from movies where (lower(homepage) like '%https%')`;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(82);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies released every year",
    async done => {
      const query = `select count(release_date) as count,
      strftime('%Y',release_date) as year from movies
      group by year order by year desc`;
      const result = await db.selectMultipleRows(query);

      expect(result.length).toBe(56);
      expect(result.slice(0, 3)).toEqual([
        {
          count: 627,
          year: "2015"
        },
        {
          count: 696,
          year: "2014"
        },
        {
          count: 656,
          year: "2013"
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three users which left most ratings",
    async done => {
      const query = `select user_id, count(rating) as count from movie_ratings group by user_id order by count desc limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          user_id: 8659,
          count: 349
        },
        {
          user_id: 179792,
          count: 313
        },
        {
          user_id: 107720,
          count: 294
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of ratings left each month",
    async done => {
      const query = `select count(rating) as count,
      strftime('%m', time_created) as month from movie_ratings
     group by month order by count desc`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          count: 161252,
          month: "11"
        },
        {
          count: 146804,
          month: "12"
        },
        {
          count: 144545,
          month: "07"
        },
        {
          count: 141643,
          month: "10"
        },
        {
          count: 136058,
          month: "06"
        },
        {
          count: 131934,
          month: "01"
        },
        {
          count: 130411,
          month: "05"
        },
        {
          count: 129070,
          month: "03"
        },
        {
          count: 127299,
          month: "08"
        },
        {
          count: 119368,
          month: "04"
        },
        {
          count: 108811,
          month: "02"
        },
        {
          count: 103819,
          month: "09"
        }
      ]);

      done();
    },
    minutes(3)
  );
});
