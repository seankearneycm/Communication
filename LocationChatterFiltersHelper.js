({
    fireFiltersChanged : function(component, event, helper) {

        var locationChatterFiltersChanged = $A.get("e.c:LocationChatterFiltersChanged"),
            radius = component.get("v.radius"),
            searchString = component.get("v.searchString")||'',
            locationNumber = component.get("v.locationNumber")||'';
     
        if (radius) {
            parseInt(radius);
        }

        locationChatterFiltersChanged.setParams({
            radius: radius,
            searchString: searchString,
            locationNumber: locationNumber
        }).fire();

        helper.hideFilters(component, event, helper);
        helper.storeFilters(component, event, helper);
    },
    hideFilters : function(component, event, helper) {

        var hideFilters = component.find("toggleFiltersId");

        if ($A.util.hasClass(hideFilters, "expand")) {
            $A.util.toggleClass(hideFilters, "expand");
        }
    },
    storeFilters : function(component, event, helper) {

        var radius = component.get("v.radius"),
            searchString = component.get("v.searchString"),
            locationNumber = component.get("v.locationNumber"),
            locationChatterFilters = {};

        locationChatterFilters.radius = radius;
        locationChatterFilters.searchString = searchString;
        locationChatterFilters.locationNumber = locationNumber;

        localStorage.setItem("locationChatterFilters", JSON.stringify(locationChatterFilters));
    },
    _isDigitOnly: function(target) {
    var pattern = /\D/g;
    return target.match(pattern) == null;
    },
    retrieveFilters : function(component, event, helper) {

        if (localStorage.getItem("locationChatterFilters") != null) {
            var locationChatterFilters = JSON.parse(localStorage.getItem("locationChatterFilters"));

            component.set("v.radius", locationChatterFilters.radius);
            component.set("v.searchString", locationChatterFilters.searchString);
            component.set("v.locationNumber", locationChatterFilters.locationNumber);
        }
    }
})