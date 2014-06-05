"use strict";

var Hapi = require("hapi"),
    parseCSV = require("../lib/parse-csv"),
    csvContents = require("../csv/contents.json");

module.exports.county = {
    handler: function(request, reply) {
        var fileName, columns, countyColumnIndex;

        /*
         * constituentstories.csv
         */
        fileName = csvContents.constituentstories.fileName;
        columns = csvContents.constituentstories.columns;

        // find the county column index within this CSV
        countyColumnIndex = parseCSV.findColumnIndex("county", columns);

        parseCSV.parse(fileName, request.params.county, countyColumnIndex, columns, false, function(err, story) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            reply(story);
        });
    }
};
