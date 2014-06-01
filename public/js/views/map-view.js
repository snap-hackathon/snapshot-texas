/* global define:true */
define([
    "backbone",
    "underscore",
    "text!../templates/map.html"
], function(Backbone, _, mapHtml) {
    "use strict";

    var latitude, longitude, coordinates, mapsIsInitialized;

    window.initialize = function() {
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        // Define the LatLng coordinates for the polygon's path.
        var i;
        var zipCoords = [];
        for (i=0; i<coordinates.length; i++) {
            zipCoords.push(new google.maps.LatLng(coordinates[i][0], coordinates[i][1]));
        }

        // Construct the polygon.
        var zipOutline = new google.maps.Polygon({
            paths: zipCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        zipOutline.setMap(map);
    };

    function loadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
            'callback=initialize';
        document.body.appendChild(script);
    }

    return Backbone.View.extend({

        template: _.template(mapHtml),

        events: {},

        initialize: function() {
            this.model.on("sync", this.renderMap, this);
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

        renderMap: function() {
            var data;

            this.$el.html(this.template());

            data = this.model.toJSON();
            latitude = data.latitude;
            longitude = data.longitude;
            coordinates = data.coordinates;

            if (mapsIsInitialized) {
                window.initialize();
            } else {
                loadScript();
                mapsIsInitialized = true;
            }
            return this;
        }
    });
});
