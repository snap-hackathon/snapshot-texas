/*global define:true */
define([
    "jquery",
    "backbone",
    "router",
    // our app requires bootstrap
    "bootstrap"
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
