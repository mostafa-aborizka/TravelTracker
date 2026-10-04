# Travel Tracker

A simple web application for tracking countries you have visited. Users enter a country name, and the application looks up its country code in PostgreSQL, saves it to the visited countries table, and highlights it on the map.

## Features

- Display visited countries on an SVG world map
- Show the total number of visited countries
- Add countries by name
- Case-insensitive and partial country-name search
- Display validation and database errors in the country input
- Prevent duplicate countries from being added

## Built With

- Node.js
- Express
- EJS
- PostgreSQL
- `pg`
- `body-parser`

## Prerequisites

- Node.js 20.6 or later
- PostgreSQL
- A PostgreSQL database containing the required tables and data

## Database Setup

The application expects a database with these tables:

```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) UNIQUE NOT NULL,
  country_name VARCHAR(100) NOT NULL
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,  
  country_code CHAR(2) NOT NULL UNIQUE
);
```

The `countries` table must be populated with country IDs, names, and two-letter country codes. The country code must also be unique because `visited_countries` references it.

### Importing Country Data from CSV

The included `countries.csv` file has this column order:

```text
id,country_code,country_name
1,AF,Afghanistan
2,AX,Aland Islands
```

Then import it from the `psql` prompt:

```sql
\copy countries(id, country_code, country_name) FROM './countries.csv' WITH (FORMAT csv, HEADER true)
```

Use the actual CSV filename if it differs from `countries.csv`. If your existing `countries` table already exists, make sure its columns match the CSV before importing.

## Configuration

Create a `.env` file in the project root. It is ignored by Git so database credentials are not committed.

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=world
PGPASSWORD=your-password
PGPORT=5432
PORT=3000
```

## Installation

Install the dependencies:

```bash
npm install
```

## Running the Application

Node.js must load the `.env` file when starting the application:

```bash
node --env-file=.env index.js
```

The application will be available at:

http://localhost:3000

For development with nodemon:

```bash
nodemon --exec "node --env-file=.env" index.js
```

## Project Structure

```text
.
├── index.js              # Express server and database routes
├── package.json          # Project metadata and dependencies
├── public/styles/        # Application styles
└── views/index.ejs       # Main page template and world map
```

## Routes

- `GET /` - Displays the map and visited-country count
- `POST /add` - Looks up and saves a country by name

## License

This project is for educational and personal use.
