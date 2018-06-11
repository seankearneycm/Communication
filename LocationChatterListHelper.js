({
    setDeviceGeoLocation: function(component, event) {
        var self = this;

        function onSuccess(geo) {
            $A.getCallback(function() {
                component.set('v.currentLocation', {
                    lat: geo.coords.latitude,
                    lon: geo.coords.longitude
                });
                self.getLocationChat(component, event, self);
            })();
        }

        function onError() {
            $A.getCallback(function() {
                //center the US Map
                var geo = {
                    lat: 0,
                    lon: 0
                };
                component.set('v.currentLocation', geo);
                self.getLocationChat(component, event, self);
            })();
        }

        if (!navigator.geolocation) {
            onError();
            return;
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    },


    getLocationChat: function(component, event, helper) {

        var action = component.get("c.getLocationChatter"),
            currentLocation = component.get('v.currentLocation'),
            radius = component.get("v.radius"),
            searchString = component.get("v.searchString") || '',
            locationNumber = component.get("v.locationNumber") || '',
            chatter;


        if (!locationNumber || !locationNumber.trim()) {
            locationNumber = '';
        }


        // Don't send blank
        if (!searchString || !searchString.trim()) {
            searchString = '';
        }
        // Don't search on radius if any search is entered
        if (locationNumber || searchString) {
            radius = 0;
        }

        if (radius || searchString || locationNumber) {

            helper.toggleSpinner(component, event);

            action.setParams({
                lat: currentLocation.lat,
                lon: currentLocation.lon,
                radius: radius,
                searchString: searchString,
                locationNumber: locationNumber
            });
            action.setCallback(helper, function(a) {
                var state = a.getState();
                if (state === 'SUCCESS') {
                    chatter = helper.mapLocationChatter(a.getReturnValue());
                    component.set("v.locationChatter", chatter);
                    helper.toggleSpinner(component, event);
                    helper.notifyDataLoaded(currentLocation, radius, chatter);
                    return;
                }
                if (state === 'ERROR') {
                    var errors = a.getError();
                    if (!!errors && !!errors[0] && !!errors[0].message) {
                        helper._msgBox('error', errors[0].message);
                    }
                }

            });
            $A.enqueueAction(action);
        } else {
            component.set("v.locationChatter", null);
        }
    },

    notifyDataLoaded: function(geoLocation, radius, chatters) {
        var loadEvent = $A.get("e.c:LocationChatterLoaded");
        loadEvent.setParams({
            "chatter": chatters,
            'currentLocation': geoLocation,
            'radius': radius
        });
        loadEvent.fire();
    },

    retrieveFilters: function(component, event, helper) {

        if (localStorage.getItem("locationChatterFilters") != null) {
            var locationChatterFilters = JSON.parse(localStorage.getItem("locationChatterFilters"));

            component.set("v.radius", locationChatterFilters.radius);
            component.set("v.searchString", locationChatterFilters.searchString);
            component.set("v.locationNumber", locationChatterFilters.locationNumber);
        }
    },
    mapLocationChatter: function(locationChatter) {

        var mappedLocationChatter = [],
            location;

        for (var i = 0; i < locationChatter.length; i++) {

            location = {};

            location.id = locationChatter[i].id;
            location.name = locationChatter[i].name;
            location.lat = locationChatter[i].lat;
            location.lon = locationChatter[i].lon;
            location.street = locationChatter[i].address + ", "; //+ locationChatter[i].address2;
            location.city = locationChatter[i].city;
            location.state = locationChatter[i].state;
            location.zip = locationChatter[i].postal;
            location.locationNumber = locationChatter[i].locationNumber;
            location.country = locationChatter[i].country;
            mappedLocationChatter.push(location);
        }

        return mappedLocationChatter;

    },

    toggleSpinner: function(component, event) {
        var spinner = component.find("spinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },

    _msgBox: function(msgType, msg) {
        var evt = $A.get('e.force:showToast');
        evt.setParams({
            message: msg,
            type: msgType,
            mode: msgType === 'error' ? 'sticky' : 'dismissible'
        });
        evt.fire();
    }
})