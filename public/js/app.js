/*global define:true */
define([
    "jquery",
    "backbone",
    "router",
    // our app requires highcharts
    "highcharts"
], function($, Backbone, Router) {
    "use-strict";

    $(function() {
        new Router();

        Backbone.history.start({
            silent: false,
            root: "/app",
            pushState: true
        });
    });
});
