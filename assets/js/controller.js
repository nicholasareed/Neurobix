
// Controller.js
// - manage actions

var action = function(elem,event,func){
	// Set up livequery for an Action
	// - finds all elements where action=actionName
	
	// Add that function to executable Actions also
	// - for when you want to auto-trigger an action (should not need input data?)
	
	// Parse the elem
	// - comes in as 'User.choose'
	var c = elem.split('.')[0]; // 'Users'
	var a = elem.split('.')[1]; // 'home'
	
	// Make sure Controller exists
	if(typeof controller[c] == "undefined"){
		$('['+event+'Action="'+elem+'"]').livequery(event,function(){
			alert('Unknown Controller: '+c);
			return false;
		});
		return this;
	}
	
	var qString = '['+event+'Action="'+elem+'"]';
	if(qString in oc(controller.livequeried)){
		return;
	}
	controller.livequeried.push(qString);
			
	// Did we supply 2 or 3 arguments?
	// - livequery accepts either
	// - if 3 elements, use the func as the callback function
	// - if the element is 'click' we should turn into our 'touchdown' function
	if(func){
		// Supplied an actual function, not using a controller.actions function
		// Is there a trigger? (click, etc.)
		if(event){
			if(event == 'click'){ // hijack 'click' and turn it into 'touchIntent'
				$(qString).livequery(function(){
					$(this).touchIntent(function(){
						if(controller[c].beforeAction){
							if(!controller[c].beforeAction()){
								return false;
							}
						} else {
							if(!controller.beforeAction()){
								return false;
							}
						}
						return func.call(this); // false, to preventDefault()
					});
				});
			} else {
				$(qString).livequery(event,function(){
					if(controller[c].beforeAction){
						if(!controller[c].beforeAction()){
							return false;
						}
					} else {
						if(!controller.beforeAction()){
							return false;
						}
					}
					return func.call(this); // false, to preventDefault()
				});
			}
		} else {
			$(qString).livequery(function(){
				if(controller[c].beforeAction){
					if(!controller[c].beforeAction()){
						return false;
					}
				} else {
					if(!controller.beforeAction()){
						return false;
					}
				}
				return func.call(this); // false, to preventDefault()
			});
		}
	} else {
		// No function, use the 'a' (action name) variable from above as the function (from controller.Users.actions.actionname)
		// - Example result: controller.User.actions.home
		
		// Set default animation (according to element.attr('animation');
		
		if(event){
			if(event == 'click'){ // hijack 'click' and turn it into 'touchIntent'
				$(qString).livequery(function(){
					$(this).touchIntent(function(){
						if(controller[c].beforeAction){
							if(!controller[c].beforeAction()){
								return false;
							}
						} else {
							if(!controller.beforeAction()){
								return false;
							}
						}
						
						if($(this).attr('animation')){
							view.animation = $(qString).attr('animation');
						}
						return controller[c].actions[a].call(this); // false, to preventDefault()
					});
				});
			} else {
				$(qString).livequery(event,function(){
					if(controller[c].beforeAction){
						if(!controller[c].beforeAction()){
							return false;
						}
					} else {
						if(!controller.beforeAction()){
							return false;
						}
					}
					if($(this).attr('animation')){
						view.animation = $(qString).attr('animation');
					}
					return controller[c].actions[a].call(this); // false, to preventDefault()
				});
				
			}
		} else {
			// Should we ever get here?
			console.log('uh, weird controller place');
			//qString = '['+event+'Action="'+elem+'"]';
			//if(qString in oc(controller.livequeried)){
			//	return;
			//}
			//$(qString).livequery(event,function(){
			$(qString).livequery(function(){
				if(controller[c].beforeAction){
					//controller[c].beforeAction();
					if(!controller[c].beforeAction()){
						return false;
					}
				} else {
					//controller.beforeAction();
					if(!controller.beforeAction()){
						return false;
					}
				}
				return controller[c].actions[a].call(this); // false, to preventDefault()
			});
			controller.livequeried.push(qString);
		}
		// Create triggerable function. Example: controller.execFunc('Users.home');
		// - notice, did not create it for actions with a clickable thing
		/*controller[c].actions[a] = function(){
			if(controller[c].beforeAction){
				controller[c].beforeAction();
			} else {
				controller.beforeAction();
			}
			return func.call(this);
		}*/
	}
}

// Default Controller functions
var controller = {
	
	name: 'Controllers',
	
	structure: [
							'actions',
							'display',
							'registerAction',
							'registeredActions',
							'listeners'
						 ],
	
	beforeAction: function(){
		if(controller.preventActions){
			// Don't execute the existing Action
			return false;
		}
		controller.holds = 0;
		return true;
	},
	
	holds: 0,
	
	hold: function(){
		// Add a +1 to hold
		controller.holds += 1;
	},
	
	unhold: function(){
		// Subtract a -1 from hold
		controller.holds -= 1;
	},
	
	clearHolds: function(){
		controller.holds = 0;
	},
	
	actions: function(){
		// Empty
	},
	
	runAction: function(elem){
		// Execute an Action
		var c = elem.split('.')[0]; // 'User'
		var a = elem.split('.')[1]; // 'User'
		
		// Find that function and execute it
		// - SHOULD WE RUN beforeAction also?
		// - I think so, so we'll run it for now
		if(controller[c].beforeAction){
			if(!controller[c].beforeAction()){
				return false;
			}
		} else {
			if(!controller.beforeAction()){
				return false;
			}
		}
		
		controller[c].actions[a](); // Run Action
		
	},
		
	registerAction: function(elem,event,func){
		var self = this;
		action(elem,event,func);
		self.registeredActions.push(elem+event);
	},
	
	registeredActions: [],
	livequeried: [],
	
	listeners: function(){
		
	},
	
	buildListeners: function(){
		// Run once for each controller
		var actionTypes = ['click','submit']; // add 'swipe' and other gestures later
		$.each(actionTypes,function(i,val){
			$('['+val+'Action]').livequery(function(){
				
				if($(this).hasClass('bound')){
					return false;
				}
				$(this).addClass('bound');
				//console.log(this);
				//console.log(val);
				var elem = $(this).attr(val+'Action');
				var c = elem.split('.')[0]; // 'Users'
				var a = elem.split('.')[1]; // 'home'
				
				// Action exists in Controller?
				// - is not already specified above?
				var elemVal = elem+val;
				
				if(typeof controller[c] == "undefined"){
					action(elem,val);
				} else {
					if(elemVal in oc(controller[c].registeredActions)){
						// Dunno how to do "not in" to get rid of this extra space
					} else {
						if(controller[c].actions[a]){
							action(elem,val);
						} else {
							action(elem,val,function(){
								alert('Not a registered Controller.Action: '+elem);
								$(this).removeClass('pressed');
								return false;
							});
						}
					}
				}
				
			});
		});
		
		// Form button submits (cancel button presses double-submitting form)
		// - form already has a submitAction="Users.login" tag
		$('form input[type="submit"]').livequery(function(){
			/*if($(this).hasClass('bound')){
				return false;
			}
			$(this).addClass('bound');*/
			
			/*
			$(this).click(function(){
				console.log('clicked');
				//return false;
			});
			return false;
			*/
			
			$(this).touchIntent(function(){
				$(this).removeClass('pressed');
				return false;
			});
			
		});
		
	},
	
	preventActions: false, // Prevent other actions from firing until the existing one is finished
	
	ignoreOnReady: false, // Skip the onReady function
	
	reset: function(){
		controller.preventActions = false;
		controller.ignoreOnReady = false;
		controller.holds = 0;
	},
	
	onReady: function(callback){ // What controller made the call?
		// Wait for all the Holds to be removed before running this
		if(controller.holds <= 0){
				callback.call();
		} else {
			var holdInterval = window.setInterval(function(){
				if(controller.holds <= 0){
					window.clearInterval(holdInterval);
					callback.call();
				} else {
					//console.log(controller.holds);
				}
			},50);
		}
	}
	
};