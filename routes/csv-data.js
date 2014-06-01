"use strict";

var csv = require("csv"),
    async = require("async"),
    extend = require("xtend");

function read_file(file_name, itemToMatchValue, itemToMatchIndex, columns, callback) {
    csv().from.path(__dirname + "/../Data/" + file_name, {
        delimiter: ",",
        escape: '"'
    })
    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var item, value, obj;

        // skip the header row
        if (index === 0) {
            return;
        }

        item = row[itemToMatchIndex].trim();
        if (item !== itemToMatchValue) {
            // skip it, not our zip
            return;
        }

        obj = {};
        for (var i = 0; i < columns.length; i++) {
            value = row[columns[i].index].trim();
            value = value.replace(/\$/, "");
            value = value.replace(/\#/, "");
            obj[columns[i].name] = value;
        }
        callback(obj);
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        // do nothing
    })
    // if any errors occur
    .on("error", function(error) {
        console.log(error.message);
    });
}

module.exports.dataZip = {
    handler: function(request, reply) {

        async.waterfall([
            function(waterfallCallback) {
                async.parallel([
                    function(parallelCallback) {
                        var file_name = "SNAP_Particpation_and_Race_Merged.csv";

                        var columns = [{
                            "name": "zip",
                            "index": 2
                        }, {
                            "name": "county",
                            "index": 0
                        }, {
                            "name": "totalSnapHouseholds",
                            "index": 3
                        }, {
                            "name": "averageMonthlySnapBenefitPerHousehold",
                            "index": 4

                        }, {
                            "name": "totalBenefits",
                            "index": 5
                        }, {
                            "name": "totalSnapRecipients",
                            "index": 6
                        }, {
                            "name": "recipients0To17",
                            "index": 7
                        }, {
                            "name": "recipients18To64",
                            "index": 8
                        }, {
                            "name": "recipients65Plus",
                            "index": 9
                        }, {
                            "name": "totalIncomeEligibleIndividuals",
                            "index": 10
                        }, {
                            "name": "incomeEligible0To17",
                            "index": 11
                        }, {
                            "name": "incomeEligible18To64",
                            "index": 12
                        }, {
                            "name": "incomeEligible65Plus",
                            "index": 13
                        }, {
                            "name": "totalIncomeEligibleButNotReceiving",
                            "index": 14
                        }, {
                            "name": "incomeEligibleButNotReceiving0To17",
                            "index": 15
                        }, {
                            "name": "incomeEligibleButNotReceiving18To64",
                            "index": 16
                        }, {
                            "name": "incomeEligibleButNotReceiving65Plus",
                            "index": 17
                        }, {
                            "name": "totalParticipationRate",
                            "index": 18
                        }, {
                            "name": "participationRate0To17",
                            "index": 19
                        }, {
                            "name": "participationRate18To64",
                            "index": 20
                        }, {
                            "name": "participationRate65Plus",
                            "index": 21
                        }, {
                            "name": "recipientRace_NativeAmerican",
                            "index": 22
                        }, {
                            "name": "recipientRace_Asian",
                            "index": 23
                        }, {
                            "name": "recipientRace_Black",
                            "index": 24
                        }, {
                            "name": "recipientRace_Pacific_Islander",
                            "index": 25
                        }, {
                            "name": "recipientRace_White",
                            "index": 26
                        }, {
                            "name": "recipientRace_Multi_Race",
                            "index": 27
                        }, {
                            "name": "recipientRace_Unknown_Missing",
                            "index": 28
                        }, {
                            "name": "recipientEthnicity_hispanic",
                            "index": 29
                        }, {
                            "name": "recipientEthnicity_Non_Hispanic",
                            "index": 30
                        }, {
                            "name": "recipientEthnicity_Unknown_Missing",
                            "index": 31
                        }, {
                            "name": "householdIncomeWithEarnedIncome",
                            "index": 32
                        }, {
                            "name": "householdncomeWithOnlyEarnedIncome",
                            "index": 33
                        }];
                        read_file(file_name, request.params.zip, 2, columns, function(data) {
                            parallelCallback(null, data);
                        });
                    },
                    function(parallelCallback) {
                        var file_name = "SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv"
                        var columns = [{
                            "name": "averageBenefitPerRecipient",
                            "index": 7,
                        }, {
                            "name": "averageBenefitperMeal",
                            "index": 8
                        }];

                        read_file(file_name, request.params.zip, 2, columns, function(data) {
                            parallelCallback(null, data);
                        });

                    }
                ], function(err, results) {
                    var data = {};

                    for (var i = 0; i < results.length; i++) {
                        data = extend(data, results[i]);
                    }

                    waterfallCallback(null, data);
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                });

            }
        ], function(err, data) {
            var county = data.county;
            async.parallel([
                function(parallelCallback) {
                    var file_name = "Food_Banks.csv";
                    var columns = [{
                        "name": "foodBank",
                        "index": 1
                    }, {
                        "name": "address",
                        "index": 2
                    }, {
                        "name": "phone",
                        "index": 3
                    }, {
                        "name": "website",
                        "index": 4
                    }];
                    read_file(file_name, county, 0, columns, function(newData) {
                        parallelCallback(null, newData);
                    });
                },
                function(parallelCallback) {
                    var file_name = "Food_Insecurity.csv";
                    var columns = [{
                        "name": "individualFoodInsecurityRate",
                        "index": 1
                    }, {
                        "name": "foodInsecureIndividuals",
                        "index": 2
                    }, {
                        "name": "childFoodInsecurityRate",
                        "index": 3
                    }, {
                        "name": "foodInsecureChildren",
                        "index": 4
                    }, {
                        "name": "costOfFoodIndex",
                        "index": 5
                    }, {
                        "name": "weightedCostPerMeal",
                        "index": 6
                    }];
                    read_file(file_name, county, 0, columns, function(newData) {
                        parallelCallback(null, newData);
                    });
                }
            ], function(err, results) {
                var i;

                for (i = 0; i < results.length; i++) {
                    data = extend(data, results[i]);
                }

                reply(data);
            });
        });
    }
};


function read_file_county(file_name, itemToMatchValue, columns, callback) {
    var names = [];
    csv().from.path(__dirname + "/../Data/" + file_name, {
        delimiter: ",",
        escape: '"'
    })

    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var item, obj;
        // skip the header row
        if (index === 0) {
            return;
        }
        // get item needed to match it to itemtomatchvalue
        item = itemToMatchValue.match(/^[0-9]+$/) == null ? row[0].trim() : row[2].trim();
        // console.log("dsfasdfsdaf "+itemtoMatchValue);
        // console.log("adfasdfsaf "+item);
        if (item + "" !== itemToMatchValue)
            return;
        var value;
        for (var i = 0; i < columns.length; i++) {
            obj = {};
            value = row[columns[i].index].trim();
            value = value.replace(/\$/, "");
            value = value.replace(/\#/, "");
            obj[columns[i].name] = value;
            console.log(columns[i].name);
            names.push(obj);
        }

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

module.exports.dataCounty = {
    handler: function(request, reply) {
        var file_name = ["SNAP_Particpation_and_Race_Merged.csv"];
        var allNames = [];
        var columns = [{
            "name": "zip",
            "index": 2
        }, {
            "name": "county",
            "index": 0
        }, {
            "name": "totalSnapHouseholds",
            "index": 3
        }, {
            "name": "averageMonthlySnapBenefitPerHousehold",
            "index": 4

        }, {
            "name": "totalBenefits",
            "index": 5
        }, {
            "name": "totalSnapRecipients",
            "index": 6
        }, {
            "name": "recipients0To17",
            "index": 7
        }, {
            "name": "recipients18To64",
            "index": 8
        }, {
            "name": "recipients65Plus",
            "index": 9
        }, {
            "name": "totalIncomeEligibleIndividuals",
            "index": 10
        }, {
            "name": "incomeEligible0To17",
            "index": 11
        }, {
            "name": "incomeEligible18To64",
            "index": 12
        }, {
            "name": "incomeEligible65Plus",
            "index": 13
        }, {
            "name": "totalIncomeEligibleButNotReceiving",
            "index": 14
        }, {
            "name": "incomeEligibleButNotReceiving0To17",
            "index": 15
        }, {
            "name": "incomeEligibleButNotReceiving18To64",
            "index": 16
        }, {
            "name": "incomeEligibleButNotReceiving65Plus",
            "index": 17
        }, {
            "name": "totalParticipationRate",
            "index": 18
        }, {
            "name": "participationRate0To17",
            "index": 19
        }, {
            "name": "participationRate18To64",
            "index": 20
        }, {
            "name": "participationRate65Plus",
            "index": 21
        }, {
            "name": "recipientRace_NativeAmerican",
            "index": 22
        }, {
            "name": "recipientRace_Asian",
            "index": 23
        }, {
            "name": "recipientRace_Black",
            "index": 24
        }, {
            "name": "recipientRace_Pacific_Islander",
            "index": 25
        }, {
            "name": "recipientRace_White",
            "index": 26
        }, {
            "name": "recipientRace_Multi_Race",
            "index": 27
        }, {
            "name": "recipientRace_Unknown_Missing",
            "index": 28
        }, {
            "name": "recipientEthnicity_hispanic",
            "index": 29
        }, {
            "name": "recipientEthnicity_Non_Hispanic",
            "index": 30
        }, {
            "name": "recipientEthnicity_Unknown_Missing",
            "index": 31
        }, {
            "name": "householdIncomeWithEarnedIncome",
            "index": 32
        }, {
            "name": "householdncomeWithOnlyEarnedIncome",
            "index": 33
        }];
        read_file_county(file_name[0], request.params.county, columns, function(names) {
            reply(names);
        });
    }
};
