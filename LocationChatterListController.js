({
    doInit: function(component, event, helper) {
        helper.retrieveFilters(component, event, helper);
        helper.setDeviceGeoLocation(component, event, helper);        
    },
    handleLocationChatterFiltersChanged: function(component, event, helper) {

        component.set("v.radius", event.getParam("radius"));
        component.set("v.searchString", event.getParam("searchString"));
        component.set("v.locationNumber", event.getParam("locationNumber"));
        //helper.getLocationChat(component, event, helper);
        helper.setDeviceGeoLocation(component, event, helper);          
    }
})