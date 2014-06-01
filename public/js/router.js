/*global define:true */
define([
    "backbone",
    "jquery",
    "details-view",
    "map-model",
    "map-view"
], function(Backbone, $, DetailsView, MapModel, MapView) {
    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            "": "landing",
            "details": "details",
            "map/:zip": "map",
            "*invalidRoute": "badRoute"
        },

        initialize: function() {
            this.currentView = null;
        },

        landing: function() {
            Backbone.history.navigate("details", {
                trigger: true
            });
        },

        details: function() {
            if (this.currentView) {
                this.currentView.close();
            }

            this.currentView = new DetailsView();
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
