import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432)
});

db.connect();
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function renderHome(res, error) {
  const result = await db.query("SELECT country_code FROM visited_countries")
  const countries = result.rows.map(country => country.country_code)
  res.render("index.ejs", {countries: countries, total: countries.length, error: error})
}

app.get("/", async (req, res) => {
  await renderHome(res)
});

app.post("/add", async (req, res) => {
  const input = req.body["country"]?.trim();

  if (!input) {
    res.status(400);
    return renderHome(res, "Please enter a country name.");
  }

  try {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%' ",[input.toLowerCase()]
    );

    if (result.rows.length !== 0){
      const data = result.rows[0]
      const countryCode = data.country_code

      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[countryCode]
      );
      return res.redirect("/");
    }

    res.status(404);
    return renderHome(res, "Country not found. Check the spelling and try again.");
  } catch (error) {
    console.error(error);
    res.status(400);
    return renderHome(res, "That country has already been added.");
  }
} )

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
