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
            this.model.on("sync", this.renderDetails, this);
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            // render nothing, just fetch the model
            this.model.fetch();

            return this;
        },

        renderDetails: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});
