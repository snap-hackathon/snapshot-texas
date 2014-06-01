/*global define:true */
define([
    "backbone",
    "jquery",
    "details-model",
    "details-view",
    "map-model",
    "map-view"
], function(Backbone, $, DetailsModel, DetailsView, MapModel, MapView) {
    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            "": "landing",
            "details/:zip": "details",
            "map/:zip": "map",
            "*invalidRoute": "badRoute"
        },

        initialize: function() {
            this.currentView = null;
        },

        landing: function() {
            // default them to 78704
            Backbone.history.navigate("details/78704", {
                trigger: true
            });
        },

        details: function(zip) {
            var detailsModel;

            if (this.currentView) {
                this.currentView.close();
            }

            detailsModel = new DetailsModel(zip);
            this.currentView = new DetailsView({
                model: detailsModel
            });
            this.currentView.render();
        },

        map: function(zip) {
            var mapModel;

            if (this.currentView) {
                this.currentView.close();
            }

            mapModel = new MapModel(zip);
            this.currentView = new MapView({
                model: mapModel
            });
            this.currentView.render();
        },

        badRoute: function(invalidRoute) {
            console.error("bad route: " + invalidRoute);
            console.error("redirecting to /");
            location.href = "/";
        }
    });

    return Router;

});
