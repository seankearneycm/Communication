({
    /*doInit: function(component, event) {
        if (this.isMobile()) {
          component.set('v.style', '<style>.oneContent > .uiScroller > .scroller {transform:translate3d(0px,0px,0px) !important;}</style>');
        } else {
          component.set("v.mapClass", "");
          component.set("v.isMobile", false);
        }
    },
    
    isMobile: function(cmp) {
    	return (/Salesforce1/i.test(navigator.userAgent));
 	},
*/
    handleTouchMove: function(component, event, helper) {
        event.stopPropagation();
    },
    
    handleTouchStart: function(component, event, helper) {
        /*var target = component.find("mapDiv");
        var last_y = 0;
        var scrolly = target.pageYOffset || target.scrollTop || 0;
        var direction = event.changedTouches[0].pageY > last_y ? 1 : -1;
        if(direction>0 && scrolly===0){
            event.preventDefault();
        }
        last_y = event.changedTouches[0].pageY;*/
        
        //!!component.get('v.isMobile') && event.preventDefault(); //event.stopPropagation();
     }
})