({
    jsLoaded: function(component, event, helper) {
        setTimeout($A.getCallback(function() {
            helper.loadMap(component, event, helper);
        }));
    },
    handleLocationChatterLoaded: function(component, event, helper) {

        setTimeout(function() {
            helper.setLocations(component, event, helper);
        }, 1000);
    },
    handleLocationChatterSelected: function(component, event, helper) {

        var map = component.get('v.map'),
            locationChatter = event.getParam("chat");
        map.panTo([locationChatter.lat, locationChatter.lon]);
    },
    handleChatterPopupClicked: function(component, event, helper) {

        console.log('handleChatterPopupClicked');
        //helper.navigateToRecord(event.target.options.chat.id);
    }
})