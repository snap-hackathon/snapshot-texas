/* global define:true */
define([
    "backbone",
    "underscore",
    "overview-model",
    "text!../templates/overview.html"
], function(Backbone, _, OverviewModel, overviewHtml) {
    "use strict";

    return Backbone.View.extend({

        el: "#main",

        template: _.template(overviewHtml),

        events: {
            "click #submit-zip": "submitZip",
            "click #submit-county": "submitCounty"
        },

        initialize: function() {
            this.model.on("sync", this.renderCountyTable, this);
        },

        close: function() {
            // release all event listeners
            this.stopListening();
            this.$el.off("click");
        },

        render: function() {
            // render the overview page
            this.$el.html(this.template({
                zips: []
            }));
            return this;
        },

        submitZip: function(event) {
            var zip;

            event.preventDefault();

            zip = $("#zipcode").val();

            Backbone.history.navigate("details/" + zip, {
                trigger: true
            });
            return;
        },

        submitCounty: function(event) {
            var county;

            event.preventDefault();

            county = $("#county").val();
            // clear the county input
            $("#county").val("");

            this.model = new OverviewModel(county);
            this.model.on("sync", this.renderCountyTable, this);
            this.model.fetch();
        },

        renderCountyTable: function() {
            var zips = [];

            _.each(this.model.toJSON(), function(zip) {
                if (zip.county) {
                    zips.push(zip);
                }
            });
            this.$el.html(this.template({
                zips: zips
            }));
            return this;
        }
    });
});
