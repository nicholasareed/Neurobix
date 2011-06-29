
// User.js
// - User datastore

// Default Model functions
// - want to copy and overwrite the default Model functions like save, find, listeners, etc.


//var store = new Lawnchair({table: 'User',adaptor:'cookie'}) //changed from 'dom'

waitIntervals['Session'] = window.setInterval(function(){ // Necessary to load stuff in the correct order
	
	if(typeof(model) == "undefined"){ // controller.js must be fully loaded
		return;
	}
	window.clearInterval(waitIntervals['Session']);
	
	model.Session = {
	 	
		name: 'Session',
		
		store: new Lawnchair({table: 'Session',adaptor: globalModelStorageAdaptor}),
		
		schema: function(){
	 		// Schema for datastore
	 		// - used by save, find, etc. to validate queries
	 		
	 		// Define PrimaryKey (if necessary)
	 		return {
	 						key: null,
	 						name: {},
	 						pass: {}
	 					 };
		},
		
		onUpdate: function(data){
			// When this Model is updated, update the following functions
			// - example: I got more points, so update my Point counter
			// - somehow need to integrate 'affected' stuff in here
			//	 - don't want to update everything, right?
			//	 - I think it only updates if the $(element) actually exists, otherwise it is not executing the function for that $(element)
			
			// Need to determine which to fire, based on what was saved
			// - or we can just run everything I guess
			
			model.Session.find({key: 'Auth.User'},function(data){
				if(data.length > 0){
					$('div.listener[listener="loggedInUsername"]').text(data[0].User.name);
				} else {
					$('div.listener[listener="loggedInUsername"]').text('(Nobody logged in)');
				}
			});
			
		},
		
		listeners: function(){
			// Listeners are used for when an element is added to the page by a View
			// - pretty much a duplicate of what the function in onUpdate does
			// - the description above is the latest thought on this
			
			// Attach livequery to elements that depend on this Model changing
			// - what about elements that depend on multiple Models? Put it in multiple places...?
			
			// "this Model changing" doesn't really make sense. 
			// what we're trying to do is update certain fields whenever their models are changed
			// - shouldn't this be in onUpdate() ??
			
			// The following should be as simple as: 
			// - it uses the exact same logic as the code in onUpdate
			// - just need bind the elements/html through livequery
			
			// - do: livequery wrap around onUpdate function
			// - need to change the onUpdate to a function
			// - create a new fireAfterUpdate command
			//		- fires each of the onUpdate functions
			
			$('div.listener[listener="loggedInUsername"]').livequery(function(){
				
				model.Session.find({key: 'Auth.User'},function(data){
					if(data.length > 0){
						$('div.listener[listener="loggedInUsername"]').text(data[0].User.name);
					} else {
						$('div.listener[listener="loggedInUsername"]').text('(Nobody logged in)');
					}
				});
				
			});
			
		},
		
		func: {
			// Custom functions for Model
			
			updateAuthUser: function(callback){
				// Update the existing Auth.User
				// - get the existing Auth.User, save to Session.Auth.User
				model.Session.find({key: 'Auth.User'},function(AuthUser){
					if(AuthUser.length > 0){
						model.User.find({key: AuthUser[0].User.key},function(userData){
							AuthUser[0].User = userData[0];
							model.Session.save(AuthUser[0],function(data){
								if(callback){
									callback(data); // returns Auth.User
								}
							});
						});
					}
				});
				
			}
			
		}
		
		
	};

},10);