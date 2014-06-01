/* global define:true */
define([
    "backbone",
    "underscore",
    "text!../templates/overview.html"
], function(Backbone, _, overviewHtml) {
    "use strict";

    return Backbone.View.extend({

        el: "#main",

        template: _.template(overviewHtml),

        events: {},

        initialize: function() {
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            // render the overview page
            this.$el.html(this.template());
            return this;
        }
    });
});
