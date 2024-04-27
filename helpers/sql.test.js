const express = require('express');
const app = express();
const request = require('supertest')
const { sqlForPartialUpdate } = require('./sql')


test("Check if js column name converts to sql column name", function() {
    let dataToUpdate = { firstName: 'Kacy', lastName: 'Bryson', isAdmin: 'false'};
    let jsToSql = {
        firstName: 'first_name',
        lastName: 'last_name',
        isAdmin: 'is_admin'
    }
    let result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    console.log(result)
    expect(result).toEqual({ 
            setCols: `"first_name"=$1, "last_name"=$2, "is_admin"=$3`,
            values: [ 'Kacy', 'Bryson', 'false' ]
        })
})