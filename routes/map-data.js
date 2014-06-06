"use strict";

var Hapi = require("hapi"),
    parseCSV = require("../lib/parse-csv"),
    csvContents = require("../csv/contents.json");

function parseCoordinates(data) {
    var coords, start, end, i, isLat, lat, lon;

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

module.exports.lookupMapData = {
    handler: function(request, reply) {
        var fileName, columns, zipColumnIndex;

        /*
         * Texas_Zip_codes.csv
         */
        fileName = csvContents.Texas_Zip_codes.fileName;
        columns = csvContents.Texas_Zip_codes.columns;

        // find the zip column index within this CSV
        zipColumnIndex = parseCSV.findColumnIndex("zip", columns);

        parseCSV.parse(fileName, request.params.zip, zipColumnIndex, columns, false, function(err, mapData) {
            if (err) {
                console.error(err);
                reply(Hapi.error.badImplementation(err));
                return;
            }

            // parse the coordinates
            mapData.coordinates = parseCoordinates(mapData.coordinates);

            reply(mapData);
        });
    }
};
