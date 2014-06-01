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
        var storyId, county, constituent, story;

        // skip the header row
        if (index === 0) {
            return;
        }

        storyId = row[0];
        county = row[1];
        constituent = row[2];
        story = row[3];

        stories.push({
            storyId: storyId,
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

function parseConstituentStory(countyToFind, callback) {
    var found;

    found = false;

    csv().from.path(__dirname + "/../Data/constituentstories.csv", {
        delimiter: ",",
        escape: '"'
    })
    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var storyId, county, constituent, story;

        // skip the header row
        if (index === 0) {
            return;
        }

        storyId = row[0];
        county = row[1];
        constituent = row[2];
        story = row[3];

        if (countyToFind === county) {
            found = true;
            callback(null, {
                storyId: storyId,
                county: county,
                constituent: constituent,
                story: story
            });
            return;
        }
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        if (found) {
            // do nothing
        } else {
            callback("Unable to find county");
        }
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

module.exports.county = {
    handler: function(request, reply) {
        parseConstituentStory(request.params.county, function(err, story) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            reply(story);
        });
    }
};
