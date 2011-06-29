
// User.js
// - User datastore

// Default Model functions
// - want to copy and overwrite the default Model functions like save, find, listeners, etc.


waitIntervals['User'] = window.setInterval(function(){ // Necessary to load stuff in the correct order
	
	if(typeof(model) == "undefined"){ // controller.js must be fully loaded
		return;
	}
	window.clearInterval(waitIntervals['User']);
	
	model.User = {
	 	
		name: 'User',
		
		store: new Lawnchair({table: 'User',adaptor: globalModelStorageAdaptor}),
		
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
			
			
			// Update Session User
			model.Session.find({key: 'Auth.User'},function(AuthUser){
				if(AuthUser.length > 0){
					if(AuthUser[0].User.key == data.key){
						model.Session.func.updateAuthUser();
					}
				}
			});
			
			// Update visible points (if displayed)
			// - get the affected User (from data)
			$('span.UserPoints[username="'+data.name+'"]').text(data.points);
			
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
			
			// Show all registered Users
			$('div.listener[listener="registeredUsers"]').livequery(function(){
				
				model.User.all(function(data){
					if(data.length > 0){
						var s = '';
						$.each(data,function(i,val){
							s += val.name + " [no pass]<br />"
						});
						$('div.listener[listener="registeredUsers"]').html(s);
					} else {
						$('div.listener[listener="registeredUsers"]').text('[No registered users]');
					}
				});
				
			});
			
			
		},
		
		func: {
			// Custom functions
			// - like functions is User.php (Cake Models)
			// - call like: model.User.func.updateUser();
			
		}
		
	};
		
},10);