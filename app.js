"use strict";

var Hapi = require("hapi"),
    yaml = require("js-yaml"),
    fs = require("fs");

var config,
    mongoConnection,
    serverOptions, serverConfiguration, server;

config = yaml.safeLoad(fs.readFileSync("./config.yaml", "utf8"));

// hapi server options
serverOptions = {
    host: process.env.HOST || config.server.host,
    port: process.env.PORT || config.server.port
};

// hapi server configuration options
serverConfiguration = {
    cors: true,
    security: true,
    views: {
        engines: {
            "html": "handlebars"
        },
        path: __dirname + "/views",
    }
};

// create the hapi server
server = new Hapi.Server(serverOptions.host, serverOptions.port, serverConfiguration);

// include the routes
server.route(require("./routes").endpoints);

// start the server
server.start(function() {
    console.log("Server started at: " + server.info.uri);
});
