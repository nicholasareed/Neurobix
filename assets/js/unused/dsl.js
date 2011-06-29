

// Controller Helpers

// the app method accepts a fn to invoke on init unobtrusively 
var run = function(application) {
    if (navigator.userAgent.indexOf('Browzr') > -1) {
        // blackberry
        setTimeout(application, 250);
    } else {
        // attach to deviceready event, which is fired when phonegap is all good to go.
        //x$(document).on('deviceready', application, false);
        //x$(document).on('load', application, false);
        //application();
        $(document).ready(application);
    }
}

// throw our settings into a lawnchair
, store = new Lawnchair({adaptor:'cookie'}) //changed from 'dom'

// shows id passed
, display = function(id) {
    $('.view').each(function(index,value) {
    	
      var display = $(value).attr('id') == id ? 'block':'none';
      $(value).css({ 'display':display })
    });
}

// reg a click to [id]_button, displays id (if it exists) and executes callback (if it exists)
// - executes before() if it exists
, when = function(id, beforeFilter, callback, afterFilter) {
		
		// Touchdown Bind
    $('div[go='+id+']').touchdown(function(){ // changed to click (touchstart). Need to use stuff besides DIV
    	
			if(beforeFilter){
				var r = beforeFilter.call(this);
				if(r == false){
					return false;
				}
			}
			
	    if ($('#'+id).length > 0)
	      display(id);
	    if (callback)
	      callback.call(this);
		    
			return false;
    });
    
    // Launch Bind
    $('div#'+id).bind('launch',function(){ // also bind a launch function that will display that tab
    	
			if(beforeFilter){
				var r = beforeFilter.call(this);
				if(r == false){
					return false;
				}
			}
			
	    if ($('#'+id).length > 0)
	      display(id);
	    if (callback)
	      callback.call(this);
		    
			return false;
    });
    
    
}

// gets the value of the setting from the ui
, ui = function(setting) {
    var radio = $('#settings_form')[0][setting];
    for (var i = 0, l = radio.length; i < l; i++) {
        if (radio[i].checked)
            return radio[i].value;
    }
};
