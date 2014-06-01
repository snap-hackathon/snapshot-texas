/* global define:true */
define([
    "backbone"
], function(Backbone) {
    "use strict";

    return Backbone.Model.extend({
        url: function() {
            return "/api/constituent-stories/" + this.county;
        },

        initialize: function(county) {
            this.county = county;
        }
    });
});
