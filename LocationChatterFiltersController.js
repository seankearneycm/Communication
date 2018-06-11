({
    doInit : function(component, event, helper) {

      helper.retrieveFilters(component, event, helper);
    },
    handleRadiusChange : function(component, event, helper) {

      helper.fireFiltersChanged(component, event, helper);
    },
    handleSearch : function(component, event, helper) {

          helper.fireFiltersChanged(component, event, helper);
    },
    toggleFilters : function(component, event, helper) {

      var toggleFilters = component.find("toggleFiltersId");
      $A.util.toggleClass(toggleFilters, "expand");
    },
    hideFilters : function(component, event, helper) {
        helper.hideFilters(component, event, helper);
    }
})