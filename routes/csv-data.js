"use strict";

var Hapi = require("hapi"),
    csv = require("csv"),
    async = require("async"),
    extend = require("xtend"),
    csvContents = require("../csv/contents.json");

function readFile(fileName, rowToMatchItemValue, rowToMatchItemIndex, columns, matchAll, callback) {
    var foundRow, allMatches;

    foundRow = false;

    // used if we're matching on multiple rows
    allMatches = [];

    csv().from.path(__dirname + "/../csv/" + fileName, {
        delimiter: ",",
        escape: '"'
    })
    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var item, value, rowValues;

        // skip the header row
        if (index === 0) {
            return;
        }

        item = row[rowToMatchItemIndex].trim();
        if (item.toLowerCase() !== rowToMatchItemValue.toLowerCase()) {
            // skip it, not our item
            return;
        }

        // if we got here, we found the right row
        foundRow = true;

        // grab the row values in our object
        rowValues = {};
        for (var i = 0; i < columns.length; i++) {
            value = row[columns[i].index].trim();
            value = value.replace(/\$/, "");
            value = value.replace(/\#/, "");
            rowValues[columns[i].name] = value;
        }

        // if we match all rows that have our item to match, then
        // we keep looking. If not, and we're only matching on the
        // first occurrance, we stop here and return
        if (matchAll) {
            // add this rowValues to our matches
            allMatches.push(rowValues);
        } else {
            // we're done, no errors
            callback(null, rowValues);
        }
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        if (foundRow) {
            if (matchAll) {
                // return all our matches
                callback(null, allMatches);
            } else {
                // do nothing, we've already returned
            }
        } else {
            callback({
                code: 404,
                message: "Unable to find data for " + rowToMatchItemValue
            });
        }
    })
    // if any errors occur
    .on("error", function(error) {
        callback(error);
    });
}

function sortDescending(names) {
    var retArray = [];
    var values = [];

    var maxVal = -1;
    var amountAdded = 0;

    for (var a = 0; a < names.length; a++) {
        var add = false;
        var total = parseInt(names[a].totalIncomeEligibleButNotReceiving);

        if (amountAdded < 5) {
            add = true;
            values.push({
                total: total,
                index: retArray.length - 1
            });
        } else {
            // check if this value is higher than any value currently in array
            for (var i = 0; i < values.length; i++) {
                if (values[i].total < total) {
                    // should be added
                    retArray.splice(values[i].index, 1, names[a]);
                    values[i].total = total;

                    // don't add it later though
                    add = false;
                    break;
                } else {
                    // should not be added
                    add = false;
                }
            }
        }

        if (add) {
            retArray.push(names[a]);
            amountAdded++;
        }
    }

    retArray.sort(function(a, b) {
        if (parseInt(a.totalIncomeEligibleButNotReceiving) > parseInt(b.totalIncomeEligibleButNotReceiving)) {
            return -1;
        } else if (parseInt(a.totalIncomeEligibleButNotReceiving) < parseInt(b.totalIncomeEligibleButNotReceiving)) {
            return 1;
        } else {
            return 0;
        }
    });

    return retArray;
}

module.exports.dataZip = {
    handler: function(request, reply) {

        async.waterfall([
            function(waterfallCallback) {
                // first we search all the CSV files that we can key off zip code
                async.parallel([
                    function(parallelCallback) {
                        var fileName, columns;

                        /*
                         * SNAP_Particpation_and_Race_Merged.csv
                         */
                        fileName = csvContents.SNAP_Particpation_and_Race_Merged.fileName;
                        columns = csvContents.SNAP_Particpation_and_Race_Merged.columns;

                        readFile(fileName, request.params.zip, 2, columns, false, function(err, data) {
                            parallelCallback(err, data);
                        });
                    },
                    function(parallelCallback) {
                        var fileName, columns;

                        /*
                         * SNAP_Particpation_and_Race_Merged.csv
                         */
                        fileName = csvContents.SNAP_Particpation_and_Race_Merged.fileName;
                        columns = csvContents.SNAP_Eligibility_vs_Participation_plus_SNAP_meals.columns;

                        readFile(fileName, request.params.zip, 2, columns, false, function(err, data) {
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
                    var fileName, columns;

                    /*
                     * Food_Banks.csv
                     */
                    fileName = csvContents.Food_Banks.fileName;
                    columns = csvContents.Food_Banks.columns;

                    readFile(fileName, county, 0, columns, false, function(err, data) {
                        parallelCallback(err, data);
                    });
                },
                function(parallelCallback) {
                    var fileName, columns;

                    /*
                     * Food_Insecurity.csv
                     */
                    fileName = csvContents.Food_Insecurity.fileName;
                    columns = csvContents.Food_Insecurity.columns;

                    readFile(fileName, county, 0, columns, false, function(err, data) {
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

module.exports.dataCounty = {
    handler: function(request, reply) {
        var fileName, columns;

        /*
         * SNAP_Particpation_and_Race_Merged.csv
         */
        fileName = csvContents.SNAP_Particpation_and_Race_Merged.fileName;
        columns = csvContents.SNAP_Particpation_and_Race_Merged.columns;

        readFile(fileName, request.params.county, 0, columns, true, function(err, countyData) {
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
