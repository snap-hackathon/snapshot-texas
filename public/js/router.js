/*global define:true */
define([
    "backbone",
    "jquery",
    "details-view"
], function(Backbone, $, DetailsView) {
    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            "": "landing",
            "details": "details",
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

        badRoute: function(invalidRoute) {
            console.error("bad route: " + invalidRoute);
            console.error("redirecting to /");
            location.href = "/";
        }
    });

    return Router;

});
