/*global define:true */
define([
    "backbone",
    "jquery",
    "overview-model",
    "overview-view",
    "details-model",
    "details-view",
    "map-model",
    "map-view"
], function(Backbone, $, OverviewModel, OverviewView, DetailsModel, DetailsView, MapModel, MapView) {
    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            "": "landing",
            "overview": "overview",
            "details/:zip": "details",
            "*invalidRoute": "badRoute"
        },

        initialize: function() {
            this.currentView = null;
        },

        landing: function() {
            // send them to the overview page
            Backbone.history.navigate("overview", {
                trigger: true
            });
        },

        overview: function() {
            var overviewModel;

            if (this.currentView) {
                this.currentView.close();
            }

            overviewModel = new OverviewModel();
            this.currentView = new OverviewView({
                model: overviewModel
            });
            this.currentView.render();
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

        badRoute: function(invalidRoute) {
            console.error("bad route: " + invalidRoute);
            console.error("redirecting to /");
            location.href = "/";
        }
    });

    return Router;

});
