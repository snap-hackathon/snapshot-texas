/* global define:true */
define([
    "backbone"
], function(Backbone) {
    "use strict";

    return Backbone.Model.extend({
        url: function() {
            return "/api/lookup-map-data/" + this.zip;
        },

        initialize: function(zip) {
            this.zip = zip;
        }
    });
});
