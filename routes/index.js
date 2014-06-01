"use strict";

var csvData = require("./csv-data");

module.exports.endpoints = [
    { method: "GET", path: "/api/zipcode-data/{zip}", config: csvData.dataZip },
    { method: "GET", path: "/app/{path*}", handler: {
        view: {
            template: "index.html"
        }
    }},
    { method: "GET", path: "/public/{path*}", handler: {
        directory: { path: './public', listing: false, index: true }
    }}
];
