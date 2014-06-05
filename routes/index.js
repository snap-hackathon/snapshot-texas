"use strict";

var csvData = require("./csv-data"),
    mapData = require("./map-data"),
    constituentStories = require("./constituent-stories");

module.exports.endpoints = [
    // APIs
    { method: "GET", path: "/api/zipcode-data/{zip}",    config: csvData.dataZip },
    { method: "GET", path: "/api/county-data/{county}",  config: csvData.dataCounty },
    { method: "GET", path: "/api/lookup-map-data/{zip}", config: mapData.lookupMapData },
    { method: "GET", path: "/api/constituent-stories/{county}", config: constituentStories.county },
    // Web App
    { method: "GET", path: "/app/{path*}", handler: {
        view: {
            template: "index.html"
        }
    }},
    // Redirect / to the web app
    { method: "GET", path: "/", handler: function(request, reply) {
        reply().redirect("/app");
    }},
    // static resources for web app
    { method: "GET", path: "/public/{path*}", handler: {
        directory: { path: './public', listing: false, index: true }
    }}
];
