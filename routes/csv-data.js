"use strict";

var csv = require("csv");

module.exports.something = {
    handler: function(request, reply) {
    	var names = [];
        csv().from.path("../Data/Cost_of_Food.csv", {
            delimiter: ",",
            escape: '"'
        })
        // when a record is found in the CSV file (a row)
        .on("record", function(row, index) {
            var firstName, lastName;

            // skip the header row
            if (index === 0) {
                return;
            }

            // read in the data from the row
            firstName = row[0].trim();
            lastName = row[1].trim();
            names.push(firstName);
            // perform some operation with the data
            // ...


        })
        // when the end of the CSV document is reached
        .on("end", function() {
        	
            reply(names);
        })
        // if any errors occur
        .on("error", function(error) {
            console.log(error.message);
        });
    }
};
