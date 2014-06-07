/* global define:true */
define([
    "backbone"
], function(Backbone) {
    "use strict";

    return Backbone.Model.extend({
        url: function() {
            return "/api/county-sorted-data/" + this.county;
        },

        initialize: function(county) {
            this.county = county;
        }
    });
});
