"use strict";

var csvData = require("./csv-data");

module.exports.endpoints = [
    { method: "GET", path: "/api/something", config: csvData.something }
];
