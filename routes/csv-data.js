"use strict";

var csv = require("csv");
/*
    -read each individual file
    -first file should have zipcode
    -second file and onward should be easy since zipcode can be mapped to anything

*/


function read_file(file_name, zip, columns, callback) {
    var names = [];
    csv().from.path(__dirname + "/../Data/" + file_name, {
        delimiter: ",",
        escape: '"'
    })

    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var zip_provided, obj;
        // skip the header row
        if (index === 0) {
            return;
        }
        // for()
        // read in the data from the row
        zip_provided = row[2].trim();
        // // lastName = row[1].trim();

        if (zip_provided !== zip)
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

module.exports.dataZip = {
    handler: function(request, reply) {
        var file_name = ["SNAP_Particpation_and_Race_Merged.csv"];
        var allNames = [];
        var columns = [{
            "name": "zip",
            "index": 2
        }, {
            "name": "county",
            "index": 0
<<<<<<< HEAD
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
            "name": "recipients65+",
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
            "name": "incomeEligible65+",
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
            "name": "incomeEligibleButNotReceiving65+",
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
            "name": "participationRate65+",
            "index": 21
        }, {
            "name": "recipientRate_NativeAmerican",
            "index": 22
        }, {
            "name": "recipientRate_Asian",
            "index": 23
        }, {
            "name": "recipientRate_Black",
            "index": 24
        }, {
            "name": "recipientRate_Pacific_Islander",
            "index": 25
        }, {
            "name": "recipientRate_White",
            "index": 26
        }, {
            "name": "recipientRate_Multi_Race",
            "index": 27
        }, {
            "name": "recipientRate_Unknown_Missing",
            "index": 28
        }, {
            "name": "recipientEthnicity_hispanic",
            "index": 29
        }, {
            "name": "recipientEthnicity_Non_Hispanic",
            "index": 30
        }, {
            "name": "householdIncomeWithEarnedIncome",
            "index": 31
        }, {
            "name": "householdncomeWithOnlyEarnedIncome",
            "index": 32
=======
        },{
            "name": "total snap households",
            "index": 3
        },{
        	"name": "average monthly snap benefit per household",
        	"index": 4

        },{
        	"name": "total benefits 12/13",
        	"index": 5 
        },{
        	"name": "total snap recipients",
        	"index": 6
        },{
        	"name": "recipients 0-17",
        	"index": 7
        },{
        	"name": "recipients 18-64",
        	"index": 8
        },{
        	"name": "recipients 65+",
        	"index": 9
        },{
        	"name": "total income eligible individuals",
        	"index": 10
        },{
        	"name": "income eligible 0-17",
        	"index": 11
        },{
        	"name": "income eligible 18-64",
        	"index": 12
        },{
        	"name": "income eligible 65+",
        	"index": 13
        },{
        	"name": "total income eligible but not receiving",
        	"index": 14
        },{
        	"name": "income eligible but not receiving 0-17",
        	"index": 15
        },{
        	"name": "income eligible but not receiving 18-64",
        	"index": 16
        },{
        	"name": "income eligible but not receiving 65+",
        	"index": 17
        },{
        	"name": "total participation rate",
        	"index": 18
        },{
        	"name": "participation rate 0-17",
        	"index": 19
        },{
        	"name": "participation rate 18-64",
        	"index": 20
        },{
        	"name": "participation rate 65+",
        	"index": 21
        },{
        	"name": "recepient rate - native american",
        	"index": 22
        },{
        	"name": "recepient rate - asian",
        	"index": 23
        },{
        	"name": "recepient rate - black",
        	"index": 24
        },{
        	"name": "recepient rate - pacific islander",
        	"index": 25
        },{
        	"name": "recepient rate - white",
        	"index": 26
        },{
        	"name": "recepient rate - multi-race",
        	"index": 27
        },{
        	"name": "recepient rate - unknown/missing",
        	"index": 28
        },{
        	"name": "recepient ethnicity - hispanic",
        	"index": 29
        },{
        	"name": "recepient ethnicity - non-hispanic",
        	"index": 30
        },{
        	"name": "household income with earned income",
        	"index": 31
        },{
        	"name": "household income with only earned income",
        	"index": 32
>>>>>>> 2d2dd10a92ff214a557cd3c2576858a9e61bf20c
        }];
        read_file(file_name[0], request.params.zip, columns, function(names) {
            allNames.push(names);
<<<<<<< HEAD
            // read_file(file_name[1], columns, function(names) {
            //     allNames.push(names);
            // });
            reply(allNames);
=======
>>>>>>> 2d2dd10a92ff214a557cd3c2576858a9e61bf20c
        });
    }
};
