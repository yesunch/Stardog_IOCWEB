const path = require("path");
const fs = require('fs');
const { query, db } = require('stardog');
const { conn, dbName } = require("../helpers/boardConstants");
const { wrapWithResCheck } = require("../helpers/wrapWithResCheck");

const boardsData = fs.readFileSync(path.join(__dirname, "myBoards.ttl"), "utf8");

const insertBoardsQuery = `insert boardsData { ${boardsData} }`;

const logSuccess = () => console.log(`Created ${dbName}.\n`);
const logFailure = failureReason => console.error(failureReason);

// The "main" method for this script.
const loadBoardData = () => {
  console.log(`Creating ${dbName}...\n`);
  console.log(insertBoardsQuery)

  return db
    .create(conn, dbName)
    .then(wrapWithResCheck(() => query.execute(conn, dbName, insertBoardsQuery)))
    .then(logSuccess)
    .catch(logFailure);
};

loadBoardData();