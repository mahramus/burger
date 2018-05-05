var orm = require("/connection");

// * In the `orm.js` file, create the methods that will execute the necessary MySQL commands in the controllers. These are the methods you will need to use in order to retrieve and store data in your database.

// * `selectAll()`
// * `insertOne()`
// * `updateOne()`

// * Export the ORM object in `module.exports`.


var connection = require("../config/connection.js");



function printQuestionMarks(num) {
  var arr = [];
  
  for (var i = 0; i < num; i++) {
    arr.push("?");
  }
  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];
  // loop through the keys and push the key/value as a string into the array
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      
      // if string with spaces, add quotations
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      arr.push(key + "=" + value);
    }
  }
  // translate array of strings to a single comma-separated string
  return arr.toString();
}

var orm = {
  // function to select all values in the table
  selectAll: function(table, cb) {
    var queryString = "SELECT * FROM " + table + ";";
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  
  // function to add a new row to the table
  insertOne: function(table, cols, vals, cb) {
    var queryString = "INSERT INTO " + table;
    
    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";
    
    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  
  // function to update a value in the table
  updateOne: function(table, objColVals, condition, cb) {
    var queryString = "UPDATE " + table;
    
    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;
    
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  }
}

module.exports = orm;