"use strict";

var csvData = require("./csv-data"),
    mapData = require("./map-data");

module.exports.endpoints = [
    { method: "GET", path: "/api/zipcode-data/{zip}", config: csvData.dataZip },
    { method: "GET", path: "/api/county-data/{county}", config: csvData.dataCounty },
    { method: "GET", path: "/api/lookup-map-data/{zip}", config: mapData.lookupMapData },
    { method: "GET", path: "/app/{path*}", handler: {
        view: {
            template: "index.html"
        }
    }},
    { method: "GET", path: "/public/{path*}", handler: {
        directory: { path: './public', listing: false, index: true }
    }}
];
