({
    selectChat : function(component) {
        
        var event = $A.get("e.c:LocationChatSelected"),
            chat = component.get("v.locationChat");
        event.setParams({
            "chat": chat
        });
        event.fire();
    },
    navigateToRecord : function(locationChatterId) {
         
        var event = $A.get("e.force:navigateToSObject");
        event.setParams({
            "recordId": locationChatterId,
            "slideDevName": "chatter"
        });
        event.fire();
    }
})