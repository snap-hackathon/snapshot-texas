"use strict";

var Hapi = require("hapi"),
    csv = require("csv");

function parseConstituentStories(callback) {
    var stories;

    stories = [];

    csv().from.path(__dirname + "/../Data/constituentstories.csv", {
        delimiter: ",",
        escape: '"'
    })
    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var county, constituent, story;

        // skip the header row
        if (index === 0) {
            return;
        }

        county = row[1];
        constituent = row[2];
        story = row[3];

        stories.push({
            county: county,
            constituent: constituent,
            story: story
        });
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        callback(null, stories);
    })
    // if any errors occur
    .on("error", function(error) {
        callback(error);
    });
}


module.exports.get = {
    handler: function(request, reply) {
        parseConstituentStories(function(err, stories) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            reply(stories);
        });
    }
};
