"use strict";

var csv = require("csv");
/*
    -read each individual file
    -first file should have zipcode
    -second file and onward should be easy since zipcode can be mapped to anything

*/

function read_file(file_name, columns, callback) {
    var names = [];
    csv().from.path(__dirname + "/../Data/" + file_name, {
        delimiter: ",",
        escape: '"'
    })

    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var zip, obj;
        // skip the header row
        if (index === 0) {
            return;
        }
        // for()
        // read in the data from the row
        zip = row[2].trim();
        // lastName = row[1].trim();

        if (zip !== "78705")
            return;
        for (var i = 0; i < columns.length; i++) {
            obj = {};
            obj[columns[i].name] = row[columns[i].index];
            console.log(columns[i].name);
            names.push(obj);
        }

        // console.log(zip);
        // perform some operation with the data 
        // ...


    })
    // when the end of the CSV document is reached
    .on("end", function() {

        callback(names);
    })
    // if any errors occur
    .on("error", function(error) {
        console.log(error.message);
    });
}


module.exports.something = {
    handler: function(request, reply) {
        var file_name = ["SNAP_Particpation_and_Race_Merged.csv", "Cost_of_Food.csv", "Food_Banks.csv"];
        var allNames = [];
        var columns = [{
            "name": "zip",
            "index": 2
        },{
            "name": "county",
            "index": 0
        },{
            "name": ""
        }];
        read_file(file_name[0], columns, function(names) {
            allNames.push(names);
            read_file(file_name[1], columns, function(names) {
                allNames.push(names);
                reply(allNames);
            });
        });
    }
};
