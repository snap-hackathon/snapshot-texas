/* global define:true */
define([
    "backbone",
    "underscore",
    "text!../templates/constituent-story.html"
], function(Backbone, _, constituentStoryHtml) {
    "use strict";

    return Backbone.View.extend({

        template: _.template(constituentStoryHtml),

        events: {},

        initialize: function() {
            this.model.on("sync", this.render, this);
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            // render the overview page
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});
