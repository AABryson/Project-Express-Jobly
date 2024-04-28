const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/**#sql query for performing partial update on database table
datatoUpdate - object; 
jsToSql {Object}: maps js-style data fields to database column names,
  like { firstName: "first_name", age: "age" }
#jsToSQL - object mpaping js style column names to their sql column names b/c discrepency between them
#in example below, each key represents js column and each value is sql column
#example of jsToSql: const jsToSql = {
  firstName: 'first_name',
  lastName: 'last_name',
  age: 'age',
  email: 'email_address',
};
dataToUpdate - {Object} {field1: newVal, field2: newVal, ...}*/


function sqlForPartialUpdate(dataToUpdate, jsToSql) {

/** #keys are column names
#check if there is any data to update
#Object is global constructor function; .keys is static method; 
##takes object datatoupdate and returns array of keys;
returns an array of object property names; if dataToUpdate is { firstName: 'Aliya', age: 32 }, then Object.keys(dataToUpdate) would return ['firstName', 'age'], which represents the keys of the object.
Object.keys() returns an array;
a.b. first get keys/column names out of object dataToUpdate and return an array; later will get values from object*/

  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");


/**#generates the SET clause for UPDATE;
#iterates over keys of datatoupdate object using Object.keys to get array of column names; for each column name, constructs string representing column name and sql value; 
  {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']*/


  const cols = keys.map((colName, idx) =>

    /**
     * #use template literals to interpolate column name and placeholder value($1...)
    #recall jsToSql: { firstName: "first_name", age: "age" } so I think colName is firstName and jsToSql[colName] returns fist_name;
     */

      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
      
//#produces array of column value pairs
  );
//#returns object with two properties
//#setCols: A string containing the comma-separated column-value pairs for the SET clause of the SQL query.
//#values: An array containing the values to be updated, which will be passed as parameters to the SQL query.
  return {
    setCols: cols.join(", "),
//#new values to be set in columns/keys
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
