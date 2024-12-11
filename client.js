import pg from "pg";
import { z } from "zod";

const env = z
  .object({
    POSTGRES_HOST: z.coerce.string(),
    POSTGRES_PORT: z.coerce.number(),
  })
  .parse(process.env);

const client = new pg.Client({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: "postgres",
  password: "postgres",
  database: "postgres",
});

client.connect();

await client.query(
  "CREATE TABLE student(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, age INT, address VARCHAR(80), email VARCHAR(40))"
);

await client.query(
  "INSERT INTO student(firstname, lastname, age, address, email) VALUES($1, $2, $3, $4, $5) RETURNING *",
  [
    "Mona the",
    "Octocat",
    9,
    "88 Colin P Kelly Jr St, San Francisco, CA 94107, United States",
    "octocat@github.com",
  ]
);

const students = await client.query("SELECT * FROM student");

console.log(students.rows);

await client.end();
