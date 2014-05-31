"use strict";

var csv = require("csv");

function read_file(file_name, callback) {
    var names = {};
    csv().from.path(__dirname + "/../Data/" + file_name, {
        delimiter: ",",
        escape: '"'
    })

    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var zip, lastName;
        // skip the header row
        if (index === 0) {
            return;
        }

        // read in the data from the row
        zip = row[2].trim();
        //lastName = row[1].trim();
        console.log(zip);
        if (zip !== "78705")
            return;

        

        names.push(row);
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
        read_file(file_name[0], function(names){
            allNames.push(names);
            read_file(file_name[1], function(names) {
                allNames.push(names);
            });
                reply(allNames);
        });
    }
};
