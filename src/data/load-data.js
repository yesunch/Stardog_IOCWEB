const path = require("path");
const fs = require('fs');
const { query, db } = require('stardog');
const { conn, dbName } = require("../helpers/constants");
const { wrapWithResCheck } = require("../helpers/wrapWithResCheck");

const data = fs.readFileSync(path.join(__dirname, "data.ttl"), "utf8");
const boardsData = fs.readFileSync(path.join(__dirname, "myBoards.ttl"), "utf8");

const insertQuery = `insert data { ${data} }`;
const insertBoardsQuery = `insert boardsData { ${boardsData} }`;

const logSuccess = () => console.log(`Created ${dbName}.\n`);
const logFailure = failureReason => console.error(failureReason);

// The "main" method for this script.
const loadData = () => {
  console.log(`Creating ${dbName}...\n`);

  return db
    .create(conn, dbName)
    .then(wrapWithResCheck(() => query.execute(conn, dbName, insertQuery)))
    .then(logSuccess)
    .catch(logFailure);
};

const loadBoardData = () => {
  console.log(`Creating ${dbName}...\n`);

  return db
    .create(conn, dbName)
    .then(wrapWithResCheck(() => query.execute(conn, dbName, insertBoardsQuery)))
    .then(logSuccess)
    .catch(logFailure);
};

// loadData();
loadBoardData();