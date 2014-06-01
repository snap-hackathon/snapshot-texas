/* global define:true */
define([
    "backbone",
    "underscore",
    "map-model",
    "map-view",
    "text!../templates/details.html"
], function(Backbone, _, MapModel, MapView, detailsHtml) {
    "use strict";

    return Backbone.View.extend({

        el: "#main",

        template: _.template(detailsHtml),

        events: {},

        initialize: function() {
            this.model.on("sync", this.renderDetails, this);

            this.mapModel = new MapModel(this.model.zip);
            this.mapView = new MapView({
                model: this.mapModel
            });
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            // render nothing, just fetch the model
            this.model.fetch();
            // kick off our map model fetch while we're at it
            this.mapModel.fetch();

            return this;
        },

        renderDetails: function() {
            this.$el.html(this.template(this.model.toJSON()));

            // add the map view
            $("#selector").append(this.mapView.render().el);

            return this;
        }
    });
});
