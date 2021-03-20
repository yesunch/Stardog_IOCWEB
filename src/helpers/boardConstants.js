const { Connection } = require("stardog");



const columnData = [
  {
    selector: "board",
    label: "Board"
  },
  {
    selector: "id",
    label: "Id"
  },
  {
    selector: "desc",
    label: "Description"
  }
]

const listColumnData = [
  {
    selector: "list",
    label: "List"
  },
  {
    selector: "id",
    label: "Id"
  }
]

const cardColumnData = [
  {
    selector: "card",
    label: "Card"
  },
  {
    selector: "id",
    label: "Id"
  }
]


const queryColumnData = [
  {
    selector: "board",
    label: "Board"
  },
  {
    selector: "component",
    label: "component"
  }
]

const listWithCardData = [
  {
    selector: "list",
    label: "List"
  },
  {
    selector: "card",
    label: "Card"
  }
]

// For convenience, we'll also produce the array of selectors just once, and
// export it for re-use.
const columnSelectors = columnData.reduce(
  (selectors, { selector }) => [...selectors, selector],
  []
);

const queryColumnSelectors = queryColumnData.reduce(
  (selectors,{ selector }) => [...selectors, selector],
  []
);

const queryListsSelectors = listColumnData.reduce(
  (selectors,{ selector }) => [...selectors, selector],
  []
);
const queryCardSelectors = cardColumnData.reduce(
  (selectors,{ selector }) => [...selectors, selector],
  []
);
const queryListWithCardSelectors = listWithCardData.reduce(
  (selectors,{ selector }) => [...selectors, selector],
  []
);

// In a typical application, the connection would be changeable. For our
// present purposes, though, this is unchanging and hard-coded.
const conn = new Connection({
  username: "admin",
  password: "admin",
  endpoint: "http://localhost:5820"
});

// An "enum" for the status of our request to Stardog for data.
const TableDataAvailabilityStatus = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  LOADING: "LOADING",
  LOADED: "LOADED",
  FAILED: "FAILED"
};

module.exports = {
  dbName: 'TrelloDb',
  columnData,
  listColumnData,
  cardColumnData,
  listWithCardData,
  queryColumnSelectors,
  queryListsSelectors,
  queryCardSelectors,
  queryListWithCardSelectors,
  columnSelectors,
  conn,
  TableDataAvailabilityStatus,
};
