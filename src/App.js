import { query } from "stardog";
import Button from "@material-ui/core/Button";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import {MDCRipple} from "@material/ripple";
import {MDCFormField} from "@material/form-field";
import {MDCCheckbox} from "@material/checkbox"

import {
  TableDataAvailabilityStatus,
  columnData,
  columnSelectors,
  queryColumnSelectors,
  conn,
  dbName,
} from "./helpers/boardConstants";

// Let's not take _quite_ the entire browser screen.
const styles = {
  appInnerContainer: {
    width: "90%",
    margin: "20px auto 0"
  },
  paper: {
    overflowX: "auto"
  },
  spinner: {
    margin: "20px auto",
    display: "block"
  },
  actionCell: {
    textAligh: "center"
  }
};

const columnHeaders = columnData.map(({ label }) => <TableCell key={label}>{label}</TableCell>);
const readQuery = `SELECT ?id ?name ?dateLastActivity ?kind  {
  ?subject a ?kind ;
    :id ?id ;
    :name ?name ;
    :dateLastActivity ?dateLastActivity .
  ?kind rdfs:subClassOf :Component .
}`;

const componentHasListQuery = `SELECT ?name  ?list {
  ?subject a :Component ;
    :id ?id ;
    :name ?name ;
    :dateLastActivity ?dateLastActivity ;
    :HasList ?list .
}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataState: TableDataAvailabilityStatus.NOT_REQUESTED,
      data: [],
      queryResults: []
    };
  }

  renderRowForBinding(binding, index) {
    return (
      // Use every "selector" to extract table cell data from each binding.
      <TableRow key={binding.id}>
        {columnSelectors.map(selector => (
          <TableCell key={selector}>
            {this.getBindingValueForSelector(selector, binding)}
          </TableCell>
        ))}
        <TableCell key={-1} style={styles.actionCell}>
        <Button color="secondary" onClick={() => this.deleteItem(binding.id)}>Delete</Button>
      </TableCell>
      </TableRow>
    );
  }

  renderRowForQueryResults(binding, index) {
    return (
      // Use every "selector" to extract table cell data from each binding.
      <TableRow key={binding.id}>
        {queryColumnSelectors.map(selector => (
          <TableCell key={selector}>
            {this.getBindingValueForSelector(selector, binding)}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  render() {
    const { dataState, data, queryResults} = this.state;
    const isLoading = dataState === TableDataAvailabilityStatus.LOADING;

    return (
      <div className="App" style={styles.appInnerContainer}>
        <CssBaseline />
        <Paper style={styles.paper}>
          <Toolbar>
            <Typography variant="title">
           The whole content of DB
            </Typography>
          </Toolbar>
          <Button>
            Reasonning
          </Button>

          {isLoading ? <CircularProgress style={styles.spinner} /> : (
            <Table>
              <TableHead>
                <TableRow>
                  {columnHeaders}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((binding, index) => this.renderRowForBinding(binding, index)).concat(
                // Create an additional row for adding a new entry (by
                // iterating through our columnData and creating a table
                // cell for each column).
                <TableRow key={-1}>
                  {columnData.map(({ label, selector }) => (
                    <TableCell key={selector}>
                      <label>
                        {label}
                        <input name={selector} />
                      </label>
                    </TableCell>
                  ))}
                  <TableCell style={styles.actionCell}>
                    <Button color="primary" onClick={() => this.addItem()}>Add</Button>
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          )}
          <Toolbar>
          <Typography variant="title">
              <i>Components</i> that have lists
            </Typography>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Component
                </TableCell>
                <TableCell>
                  Lists
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {queryResults.map((binding, index) => this.renderRowForQueryResults(binding, index))}
            {console.log(queryResults)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  componentDidMount() {
    this.refreshData();
  }
  
  refreshData() {
    this.setState({
      dataState: TableDataAvailabilityStatus.LOADING
    });
    var reasoning = true;
    query.execute(conn, dbName, readQuery, 'application/sparql-results+json',{
      reasoning: reasoning
    }).then(res => {
      if (!res.ok) {
        this.setState({
          dataState: TableDataAvailabilityStatus.FAILED
        });
        return;
      }
  
      const { bindings } = res.body.results;
      // const bindingsForTable = this.getBindingsFormattedForTable(bindings);
      // console.log(bindings)
      this.setState({
        dataState: TableDataAvailabilityStatus.LOADED,
        data: bindings
      });

      console.log("data")
      console.log(bindings)
    });

    query.execute(conn, dbName, componentHasListQuery, 'application/sparql-results+json',{
      reasoning: reasoning
    }).then(res => {
      if (!res.ok) {
        this.setState({
          dataState: TableDataAvailabilityStatus.FAILED
        });
        return;
      }

      const  results  = res.body.results.bindings;
      // const bindingsForTable = this.getBindingsFormattedForTable(bindings);
      console.log("results")
      console.log(results)
      this.setState({
        dataState: TableDataAvailabilityStatus.LOADED,
        queryResults: results
      });


    });
  }

  getBindingValueForSelector(selector, binding) {
    const bindingValue = binding[selector === "movie" ? "movies" : selector];
    // NOTE: In a production app, we would probably want to do this formatting elsewhere.
    // console.log("bindingValue:")
    console.log("selector")
    console.log(selector)
    console.log("binding")
    console.log(binding)
    return bindingValue["value"]
    // return Array.isArray(bindingValue) ? bindingValue.join(", ") : bindingValue;
  }

  

  // NOTE: Does no validation and assumes certain inputs; not production-ready!
addItem() {
  // Get the input elements and create a map from their names to their
  // values.
  const inputs = document.querySelectorAll("input[name]");
  const inputsArray = Array.from(inputs);
  const valueMap = inputsArray.reduce(
    (accumulator, input) => ({
      ...accumulator,
      [input.name]: input.value
    }),
    {}
  );
  // Auto-generate a subject local name by removing all whitespace and
  // lowercasing the `name` input. This is "good enough" for our purposes.
  const subject = valueMap.name
    .trim()
    .split(/\s/)
    .join("")
    .toLowerCase();

  // const subject = valueMap.dateLastActivity
  //   .trim()
  //   .split(/\s/)
  
  const updateTriples = `:${subject} a :Board ;
    :id '${valueMap.id}' ;
    :name "${valueMap.name}" ;
    :dateLastActivity '${valueMap.dateLastActivity}' .
  `;

  // console.log(updateTriples)
  const updateQuery = `insert data { ${updateTriples} }`;

  console.log(updateQuery)
  // Add data to DB and clear the inputs when this succeeds.
  query.execute(conn, dbName, updateQuery).then(() => {
    inputsArray.forEach(input => (input.value = ""));
    // A full refresh of the data isn't really optimal here, but it serves our
    // purposes for this tutorial.
    this.refreshData();
  });
}

// Again, no validation or optimizations for this example app.
deleteItem(item) {
  var itemId = item["value"]
  // Delete all triples where the subject has the given id.
  const deleteQuery = `delete { ?s ?p ?o } where {
    ?s :id '${itemId}' ;
       ?p ?o .
  }`;

  console.log(deleteQuery)

  query.execute(conn, dbName, deleteQuery).then(() => this.refreshData());
}

}


export default App;
