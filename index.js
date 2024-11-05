const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Function to fetch all the companies in the database
async function fetchAllCompanies() {
  let query = 'SELECT * FROM companies';
  let response = await db.all(query, []);

  return { companies: response };
}

//Endpoint 1: Fetch All Companies
app.get('/companies', async (req, res) => {
  try {
    let results = await fetchAllCompanies();

    if (results.companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the companies based on industry from the database
async function fetchCompaniesByIndustry(industry) {
  let query = 'SELECT * FROM companies WHERE industry = ?';
  let response = await db.all(query, [industry]);

  return { companies: response };
}

//Endpoint 2: Fetch Companies by Industry
app.get('/companies/industry/:industry', async (req, res) => {
  try {
    let industry = req.params.industry;
    let results = await fetchCompaniesByIndustry(industry);

    if (results.companies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No companies found for this industry' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the companies from the database having range between min and max revenue
async function fetchCompaniesByRevenue(minRevenue, maxRevenue) {
  let query = 'SELECT * FROM companies WHERE revenue BETWEEN ? AND ?';
  let response = await db.all(query, [minRevenue, maxRevenue]);

  return { companies: response };
}

//Endpoint 3: Fetch Companies by Revenue Range
app.get('/companies/revenue', async (req, res) => {
  try {
    let minRevenue = parseInt(req.query.minRevenue);
    let maxRevenue = parseInt(req.query.maxRevenue);
    let results = await fetchCompaniesByRevenue(minRevenue, maxRevenue);

    if (results.companies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No companies found for this revenue range' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the companies having employee having less than employeesCount from the database
async function fetchCompaniesByEmployeesCount(employeesCount) {
  let query = 'SELECT * FROM companies WHERE employee_count < ?';
  let response = await db.all(query, [employeesCount]);

  return { companies: response };
}

//Endpoint 4 : Fetch Companies by Employee Count
app.get('/companies/employees/:employeesCount', async (req, res) => {
  try {
    let employeesCount = parseInt(req.params.employeesCount);
    let results = await fetchCompaniesByEmployeesCount(employeesCount);

    if (results.companies.length === 0) {
      return res.status(404).json({ message: 'No companies found' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the companies by founded_year from the database
async function fetchCompaniesByfoundedYear(founded_year) {
  let query = 'SELECT * FROM companies WHERE founded_year = ?';
  let response = await db.all(query, [founded_year]);

  return { companies: response };
}

//Endpoint 5: Fetch Companies by founded_year
app.get('/companies/founded_year/:founded_year', async (req, res) => {
  try {
    let founded_year = parseInt(req.params.founded_year);
    let results = await fetchCompaniesByfoundedYear(founded_year);

    if (results.companies.length === 0) {
      return res.status(404).json({ message: 'No companies found' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
