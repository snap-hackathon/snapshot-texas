"use strict";

var Hapi = require("hapi"),
    csv = require("csv");

function parseCoordinates(data) {
    var coords, start, end, i, isLat, lat, lon;

    console.log(data);
    coords = [];

    start = "<coordinates>";
    end = "</coordinates>";

    // remove the xml stuff
    data = data.slice(data.indexOf(start) + start.length, data.indexOf(end));

    // separate out the latitude and longitude
    data = data.split(",");
    for (i = 0; i < data.length; i++) {
        // they are switched...
        if (i % 2 === 0) {
            isLat = false;
        } else {
            isLat = true;
        }

        if (data[i] === "0.0") {
            // skip
        } else if (data[i].indexOf("0.0") > -1) {
            if (isLat) {
                lat = data[i].slice("0.0".length).trim();
                coords.push([lat, lon]);
            } else {
                lon = data[i].slice("0.0".length).trim();
            }
        } else {
            if (isLat) {
                lat = data[i];
                coords.push([lat, lon]);
            } else {
                lon = data[i];
            }
        }
    }

    return coords;
}

function parseMapData(zip, callback) {
    var found;

    found = false;

    csv().from.path(__dirname + "/../Data/US_ZIP_codes.csv", {
        delimiter: ",",
        escape: '"'
    })

    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var mapData;

        mapData = {};

        // skip the header row
        if (index === 0) {
            return;
        }

        if (row[3] == zip) {
            mapData.latitude = row[4];
            mapData.longitude = row[9];
            mapData.coordinates = parseCoordinates(row[11]);
            callback(null, mapData);
            return;
        }
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        if (found) {
            // do nothing
        } else {
            callback("Unable to find zip");
        }
    })
    // if any errors occur
    .on("error", function(error) {
        callback(error);
    });
}

module.exports.lookupMapData = {
    handler: function(request, reply) {
        parseMapData(request.params.zip, function(err, mapData) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            reply(mapData);
        });
    }
};
