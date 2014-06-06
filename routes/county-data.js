"use strict";

var Hapi = require("hapi"),
    async = require("async"),
    extend = require("xtend"),
    parseCSV = require("../lib/parse-csv"),
    csvContents = require("../csv/contents.json");

function sortDescending(countyData) {
    // sort the data by income eligible but not receiving
    countyData.sort(function(a, b) {
        if (parseInt(a.totalIncomeEligibleButNotReceiving) > parseInt(b.totalIncomeEligibleButNotReceiving)) {
            return -1;
        } else if (parseInt(a.totalIncomeEligibleButNotReceiving) < parseInt(b.totalIncomeEligibleButNotReceiving)) {
            return 1;
        } else {
            return 0;
        }
    });

    // only take the top 5
    countyData = countyData.slice(0, 5);

    return countyData;
}

module.exports.sortedData = {
    handler: function(request, reply) {
        var fileName, columns, countyColumnIndex;

        /*
         * SNAP_Particpation_and_Race_Merged.csv
         */
        fileName = csvContents.SNAP_Particpation_and_Race_Merged.fileName;
        columns = csvContents.SNAP_Particpation_and_Race_Merged.columns;

        // find the county column index within this CSV
        countyColumnIndex = parseCSV.findColumnIndex("county", columns);

        parseCSV.parse(fileName, request.params.county, countyColumnIndex, columns, true, function(err, countyData) {
            if (err) {
                console.error(err);

                if (err.code === 404) {
                    reply(Hapi.error.notFound(err.message));
                    return;
                } else {
                    reply(Hapi.error.badImplementation(err));
                    return;
                }
            }

            countyData = sortDescending(countyData);
            reply(countyData);
        });
    }
};
