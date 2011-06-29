
// framework.js
// - define settings (models, controllers)
// - load all necessary files


//---------- Settings -------------//

// What Action do we want to start?
startControllerAction = 'Users.home';

var globalModelStorageAdaptor = 'cookie'; // dom -> phone, cookie -> firefox

var controllers = 
	[
		'Users',
		'Games'
	];

var models = 
	[
		'User',
		'Game',
		'Session'
	];



//---------- Important Functions and Variables -------------//

// Browser?
var isBrowser = 0;
$(document).ready(function(){
	$.each(jQuery.browser, function(i, val) {
		  if(i=="mozilla"){
		  	$("body").css("width","320px");
		  	isBrowser = 1;
		  }
		});
	if($(window).width() > 500){
		$("body").css("width","320px");
		isBrowser = 1;
	}
});


// Function to load files
function headJS(filePath){
	var headID = document.getElementsByTagName("head")[0];   
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.src = filePath;
	headID.appendChild(newScript);
}

// Run startup Controller.Action (startup action/view)
function allReady(){
	
  framework.frameHeight = window.innerHeight;
  framework.frameWidth = window.innerWidth;
  $('div#container').css('min-height',framework.frameHeight+'px');
  
  // Run the Action
  // - also runs beforeAction (thats what runAction does)
  view.animation = 'fade';
  controller.runAction(startControllerAction);
	
}

// Used later, just defined here (want to load all JS files before starting everything)
var waitIntervals = {};


//---------- Framework Functions (intermediary between Browser and Phonegap functions. Like 'Fixtures' [for models]  but for Browser interaction) -------------//

var framework = {
	
	frameHeight: 0,
	frameWidth: 0,
	
	notification: {
		
		confirm: function(message,func,title,labels){
			
			if(isBrowser){
				var r=confirm(message);
				func(r);
			} else {
				navigator.notification.confirm(
	        message,  // message
	        func,              // callback to invoke with index of button pressed [index == 1 || 2]
	        title,            // title
	        labels          // buttonLabels
				);
			}
			
		}
		
	}	
	
};



//---------- Loading JS Files -------------//

headJS('assets/js/view.js');

headJS('assets/js/model.js');
$.each(models,function(index,val){  
	headJS('assets/js/models/'+val+'.js');
});

headJS('assets/js/controller.js');
$.each(controllers,function(index,val){  
	headJS('assets/js/controllers/'+val+'Controller.js');
});

headJS('assets/js/afterload.js');




//---------- Resume (Android/iOS) and Back Button binding (Android Only) -------------//
// - if the Back Button is pressed and a .backbutton class exists, press it (trigger)

function onLoad() { // Called by Body
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady(){
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false); // Does not work (at all)
}

function onResume() {
  // Handle the pause event
}

function onBackKeyDown() {
	// Handle back button pressed (does not work)
}


//---------- TouchIntent Function -------------//

(function($){
    $.fn.touchIntent = function(handler) {
    		var self = this;
    		
    		if(this.hasClass('touched')){ // What the fuck is this for? 
    			return this;
    		}
    		this.addClass('touched'); // ??
    		
				//var touchdown = 0;
				this.bind('touchstart',function(){
					//touchdown = 1;
					$(this).addClass('pressed');
				});
				this.bind('touchmove',function(){
					//touchdown = 0;
					$(this).removeClass('pressed');
				});
				this.bind('touchend',function(){
					//if(touchdown){
					if($(this).hasClass('pressed')){
						return handler.apply(self);
						$(this).removeClass('pressed');
					}
				});
				
				if(isBrowser){
					
					/*this.bind('click',function(){
						console.log('clicked');
						//return handler(this);
						return handler.apply(self);
					});
					*/
					
					this.bind('mousedown',function(){
						$(this).addClass('pressed');
					});
					this.bind('mousemove',function(){
						$(this).removeClass('pressed');
					});
					this.bind('mouseout',function(){
						$(this).removeClass('pressed');
					});
					this.bind('mouseup',function(){
						if($(this).hasClass('pressed')){
							$(this).removeClass('pressed');
							return handler.apply(self);
						}
					});
					
				}
			  
			  return this;
    };
})(jQuery);


//---------- Object Converter Function -------------//

function oc(a){
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}