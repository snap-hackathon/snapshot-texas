require.config({
    paths: {
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "jquery": "lib/jquery-2.0.3",
        "text": "lib/text",
        "bootstrap": "lib/bootstrap",
        "highcharts": "lib/highcharts/highcharts",
        "overview-view": "views/overview-view",
        "details-model": "models/details-model",
        "details-view": "views/details-view",
        "map-model": "models/map-model",
        "map-view": "views/map-view",
        "router": "router",
        "app": "app"
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "highcharts": {
            deps: ["jquery"],
            exports: "Highcharts"
        }
    }
});

require(["app"]);
