"use strict";

var Hapi = require("hapi"),
    async = require("async"),
    extend = require("xtend"),
    parseCSV = require("../lib/parse-csv"),
    csvContents = require("../csv/contents.json");

module.exports.allData = {
    handler: function(request, reply) {

        async.waterfall([
            function(waterfallCallback) {
                // first we search all the CSV files that we can key off zip code
                async.parallel([
                    function(parallelCallback) {
                        var fileName, columns, zipColumnIndex;

                        /*
                         * SNAP_Particpation_and_Race_Merged.csv
                         */
                        fileName = csvContents.SNAP_Particpation_and_Race_Merged.fileName;
                        columns = csvContents.SNAP_Particpation_and_Race_Merged.columns;

                        // find the zip column index within this CSV
                        zipColumnIndex = parseCSV.findColumnIndex("zip", columns);

                        parseCSV.parse(fileName, request.params.zip, zipColumnIndex, columns, false, function(err, data) {
                            parallelCallback(err, data);
                        });
                    },
                    function(parallelCallback) {
                        var fileName, columns, zipColumnIndex;

                        /*
                         * SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv
                         */
                        fileName = csvContents.SNAP_Eligibility_vs_Participation_plus_SNAP_meals.fileName;
                        columns = csvContents.SNAP_Eligibility_vs_Participation_plus_SNAP_meals.columns;

                        // find the zip column index within this CSV
                        zipColumnIndex = parseCSV.findColumnIndex("zip", columns);

                        parseCSV.parse(fileName, request.params.zip, zipColumnIndex, columns, false, function(err, data) {
                            parallelCallback(err, data);
                        });

                    }
                ], function(err, results) {
                    var zipcodeData;

                    if (err) {
                        waterfallCallback(err);
                        return;
                    }

                    zipcodeData = {};

                    // combine all the data into one object
                    for (var i = 0; i < results.length; i++) {
                        zipcodeData = extend(zipcodeData, results[i]);
                    }

                    waterfallCallback(null, zipcodeData);
                });

            }
        ], function(err, zipcodeData) {
            var county;

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

            // grab the county from the zipcode data we've found so far
            county = zipcodeData.county;

            // now we grab all the data from the CSVs we can key off county
            async.parallel([
                function(parallelCallback) {
                    var fileName, columns, countyColumnIndex;

                    /*
                     * Food_Banks.csv
                     */
                    fileName = csvContents.Food_Banks.fileName;
                    columns = csvContents.Food_Banks.columns;

                    // find the county column index within this CSV
                    countyColumnIndex = parseCSV.findColumnIndex("county", columns);

                    parseCSV.parse(fileName, county, countyColumnIndex, columns, false, function(err, data) {
                        parallelCallback(err, data);
                    });
                },
                function(parallelCallback) {
                    var fileName, columns, countyColumnIndex;

                    /*
                     * Food_Insecurity.csv
                     */
                    fileName = csvContents.Food_Insecurity.fileName;
                    columns = csvContents.Food_Insecurity.columns;

                    // find the county column index within this CSV
                    countyColumnIndex = parseCSV.findColumnIndex("county", columns);

                    parseCSV.parse(fileName, county, countyColumnIndex, columns, false, function(err, data) {
                        parallelCallback(err, data);
                    });
                }
            ], function(err, results) {
                var allData, i;

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

                // now combine all the data we've collected so far
                // into one giant object
                allData = zipcodeData;
                for (i = 0; i < results.length; i++) {
                    allData = extend(allData, results[i]);
                }

                // send it back to the user
                reply(allData);
            });
        });
    }
};
