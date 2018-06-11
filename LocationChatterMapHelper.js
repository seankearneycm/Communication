({
    RadiusZoomMap: {
        '5': 16,
        '10': 12,
        '20': 12,
        '30': 11,
        '40': 10,
        '50': 10,
        '60': 9,
        '70': 9,
        '80': 8,
        '90': 8,
        '100': 8
    },

    navigateToRecord: function(locationChatterId) {

        var event = $A.get("e.force:navigateToSObject");
        event.setParams({
            "recordId": locationChatterId,
            "slideDevName": "chatter"
        });
        event.fire();
    },
    loadMap: function(component, event, helper) {
        this._getMap(component);
    },

    _getMap: function(component, currentLocation) {
        var map = component.get('v.map');
        if (!map) {
            if (!!currentLocation) {
                map = L.map('map', { 
                        zoomControl: false, 
                        tap: false, 
                        zoomAnimation:false,fadeAnimation:true,markerZoomAnimation:false,
                }).setView(currentLocation, 8);
                
                L.tileLayer(
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles © Esri'
                    }).addTo(map);
            } else {
                try{
                    currentLocation = this.getCurrentLocation();
                }
                catch(err){
                    console.log(err);
                }
                
                map = L.map('map', { 
                        zoomControl: false, 
                        tap: false,
                    zoomAnimation:false,fadeAnimation:true,markerZoomAnimation:false,
                    }).locate({
                        setView: true,
                        enableHighAccuracy: true,
                        maxZoom: 16
                    });
                L.tileLayer(
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles © Esri'
                    }).addTo(map);

                map.on('locationerror', function(e) {
                    console.log('---location not found--');
                    if (!!currentLocation) {
                        map.setView(currentLocation, 8);
                    } else {
                        map.setView(currentLocation || [41.77131, -99.84375], 5);
                    }

                });
                map.on('locationfound', function(e) {
                    console.log('---location found---');
                    map.setView(e.latlng, 8);
                });
            }
            component.set('v.map', map);
        }

        return map;
    },

    _getZoom: function(radius) {
        var key = radius + '',
            zoom = this.RadiusZoomMap[key];
        return zoom || this.RadiusZoomMap['50'];
    },

    setLocations: function(component, event, helper) {
        var locationChatter = event.getParam('chatter'),
            currentLocation = event.getParam('currentLocation'),
            map = this._getMap(component, currentLocation),
            radius = parseInt(event.getParam('radius')),
            markersLayer = new L.LayerGroup(),
            marker,
            chat,
            latLng;


        // Remove each layer except the map layer
        map.eachLayer(function(layer) {
            if (!!layer.options.chat || !!layer.options.circle) {
                map.removeLayer(layer);          
            }
        });
        
        if (!!currentLocation) {
            map.setView(currentLocation, this._getZoom(radius));
            L.circleMarker(currentLocation, { radius: 2, circle: 'marker' }).addTo(map);
        }
        if (locationChatter.length) {
            for (var i = 0; i < locationChatter.length; i++) {

                chat = locationChatter[i];
                latLng = [chat.lat, chat.lon];
                marker = L.marker(latLng, { chat: chat });
                marker.on('click', function(event) {
                    helper.navigateToRecord(event.target.options.chat.id);
                    return false;
                });
                markersLayer.addLayer(marker);
            }
            //add new layer group
            markersLayer.addTo(map);
            helper.panToFilterMarker(component, event, helper);
            // zoom to markers (not working)
            //helper.zoomToMarkers(map, markersLayer);
        }
    },
    panToFilterMarker: function(component, event, helper) {
        // Center the map on the first in the list
        var map = component.get('v.map');
        var locationChatter = event.getParam('chatter');
        map.panTo([locationChatter[0].lat, locationChatter[0].lon]);
    },

    getCurrentLocation: function() {
        var currentLocation = {};
        navigator.geolocation.getCurrentPosition(function(position) {
                currentLocation.result = 'success';
                currentLocation.lat = position.coords.latitude;
                currentLocation.lon = position.coords.longitude;
            },
            function(err) {
                currentLocation.result = 'error';
            });
        return currentLocation;
    }
})