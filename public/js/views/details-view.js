/* global define:true */
define([
    "backbone",
    "underscore",
    "jquery",
    "highcharts",
    "map-model",
    "map-view",
    "constituent-story-model",
    "constituent-story-view",
    "text!../templates/details.html"
], function(Backbone, _, $, Highcharts, MapModel, MapView, ConstituentStoryModel,
    ConstituentStoryView, detailsHtml) {
    "use strict";

    return Backbone.View.extend({

        el: "#main",

        template: _.template(detailsHtml),

        events: {
            "click #submit-zip": "submitZip"
        },

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

            return this;
        },

        renderDetails: function() {
            // render the details page
            this.$el.html(this.template(this.model.toJSON()));

            // set the highchart data
            this.highchartsConfig();

            // add the map view (it'll add map details when it's ready)
            $("#map").append(this.mapView.$el);

            // kick off our map model fetch
            this.mapModel.fetch();

            // add constituent view
            this.constituentStoryModel = new ConstituentStoryModel(this.model.toJSON().county);
            this.constituentStoryView = new ConstituentStoryView({
                model: this.constituentStoryModel
            });
            $("#constituent-story").append(this.constituentStoryView.$el);

            // kick off the constituent model fetch to render it
            this.constituentStoryModel.fetch();

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

        highchartsConfig: function() {
            var model = this.model.toJSON();

            Highcharts.setOptions({
                colors: ['#f7a35c', '#7cb5ec', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
                credits: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    enabled: false,
                },
                chart: {
                    animation: false,
                    spacing: [0, 0, 0, 0]
                },
                plotOptions: {
                    pie: {
                        size: 150,
                        center: ['50%', '50%'],
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f}%'
                        }
                    }
                }
            });

            $('#percenteligible').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Eligible', parseFloat(model.totalIncomeEligibleIndividuals) ],
                        ['Not Eligible', parseFloat(model.totalIncomeEligibleIndividuals) ]
                    ]
                }]
            });

            $('#percentreceiving').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Receiving', parseFloat(model.totalSnapRecipients) ],
                        ['Not Receiving', parseFloat(model.totalIncomeEligibleButNotReceiving) ]
                    ]
                }]
            });

            $('#percentages').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Children', parseFloat(model.incomeEligible0To17) + parseFloat(model.incomeEligibleButNotReceiving0To17) ],
                        ['Adults', parseFloat(model.incomeEligible18To64) + parseFloat(model.incomeEligibleButNotReceiving18To64) ],
                        ['Seniors', parseFloat(model.incomeEligible65Plus) + parseFloat(model.incomeEligibleButNotReceiving65Plus) ]
                    ]
                }]
            });

            $('#percentbenefits').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Covered', parseFloat(model.averageBenefitperMeal) ],
                        ['Not Covered', parseFloat(model.weightedCostPerMeal)-parseFloat(model.averageBenefitperMeal) ]
                    ]
                }]
            });

            $('#percentrcvrace').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['White', parseFloat(model.recipientRaceWhite) ],
                        ['Black', parseFloat(model.recipientRaceBlack) ],
                        ['Native American', parseFloat(model.recipientRaceNativeAmerican) ],
                        ['Asian', parseFloat(model.recipientRaceAsian) ],
                        ['Pacific Islander', parseFloat(model.recipientRacePacificIslander) ],
                        ['Multi-race', parseFloat(model.recipientRaceMultiRace) ],
                        ['Unknown/Missing', parseFloat(model.recipientRaceUnknownMissing) ]
                    ]
                }]
            });

            $('#percentrcvworking').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Working', parseFloat(model.householdIncomeWithEarnedIncome) ],
                        ['Non-Working', 1 - parseFloat(model.householdIncomeWithEarnedIncome) ]
                    ]
                }]
            });

            $('#percentrcvage').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Children', parseFloat(model.recipients0To17) ],
                        ['Adults', parseFloat(model.recipients18To64) ],
                        ['Seniors', parseFloat(model.recipients65Plus) ]
                    ]
                }]
            });

            $('#percentrcvethnicity').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Hispanic', parseFloat(model.recipientEthnicityHispanic) ],
                        ['Non-Hispanic', parseFloat(model.recipientEthnicityNonHispanic) ],
                        ['Unknown/Missing', parseFloat(model.recipientEthnicityUnknownMissing) ]
                    ]
                }]
            });
        }
    });
});
