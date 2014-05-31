/* global define:true */
define([
    "backbone",
    "underscore",
    "text!../templates/details.html"
], function(Backbone, _, detailsHtml) {
    "use strict";

    return Backbone.View.extend({

        el: "#main",

        template: _.template(detailsHtml),

        events: {},

        initialize: function() {
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});
