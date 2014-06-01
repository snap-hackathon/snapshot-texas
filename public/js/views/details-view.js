/* global define:true */
define([
    "backbone",
    "underscore",
    "jquery",
    "highcharts",
    "map-model",
    "map-view",
    "text!../templates/details.html"
], function(Backbone, _, $, Highcharts, MapModel, MapView, detailsHtml) {
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
            this.$el.html(this.template(_.extend(this.model.toJSON(), {
                Highcharts: Highcharts
            })));

            // set the highchart data
            this.highchartsConfig();

            // add the map view (it'll add map details when it's ready)
            $("#map").append(this.mapView.$el);

            // kick off our map model fetch
            this.mapModel.fetch();

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
                        ['Eligible', model.totalIncomeEligibleIndividuals ],
                        ['Not Eligible', model.totalIncomeEligibleIndividuals ]
                    ]
                }]
            });

            $('#percentreceiving').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Receiving', (+model.totalSnapRecipients) ],
                        ['Not Receiving', (+model.totalIncomeEligibleButNotReceiving) ]
                    ]
                }]
            });

            $('#percentages').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Children', (+model.incomeEligible0To17) + (+model.incomeEligibleButNotReceiving0To17) ],
                        ['Adults', (+model.incomeEligible18To64) + (+model.incomeEligibleButNotReceiving18To64) ],
                        ['Seniors', (+model.incomeEligible65Plus) + (+model.incomeEligibleButNotReceiving65Plus) ]
                    ]
                }]
            });

            $('#percentbenefits').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Covered', (+model.averageMonthlySnapBenefitPerHousehold) / 90 ], // TODO
                        ['Not Covered', (+model.weightedCostPerMeal) ]
                    ]
                }]
            });

            $('#percentrcvrace').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['White', (+model.recipientRate_White) ],
                        ['Black', (+model.recipientRate_Black) ],
                        ['Native American', (+model.recipientRate_NativeAmerican) ],
                        ['Asian', (+model.recipientRate_Asian) ],
                        ['Pacific Islander', (+model.recipientRate_Pacific_Islander) ],
                        ['Multi-race', (+model.recipientRate_Multi_Race) ],
                        ['Unknown/Missing', (+model.recipientRate_Unknown_Missing) ]
                    ]
                }]
            });

            $('#percentrcvworking').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Working', (+model.householdIncomeWithEarnedIncome) ],
                        ['Non-Working', (+model.householdIncomeWithEarnedIncome) ]
                    ]
                }]
            });

            $('#percentrcvage').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Children', (+model.recipients0To17) ],
                        ['Adults', (+model.recipients18To64) ],
                        ['Seniors', (+model.recipients65Plus) ]
                    ]
                }]
            });

            $('#percentrcvethnicity').highcharts({
                series: [{
                    type: 'pie',
                    data: [
                        ['Hispanic', (+model.recipientEthnicity_hispanic) ],
                        ['Non-Hispanic', (+model.recipientEthnicity_Non_Hispanic) ],
                        ['Unknown/Missing', 0] // TODO
                    ]
                }]
            });
        }
    });
});
