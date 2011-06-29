
// Game.js
// - Game model

waitIntervals['Game'] = window.setInterval(function(){ // Necessary to load stuff in the correct order
	
	if(typeof(model) == "undefined"){ // controller.js must be fully loaded
		return;
	}
	window.clearInterval(waitIntervals['Game']);
	
	model.Game = {
	 	
		name: 'Game',
		
		store: new Lawnchair({table: 'Game',adaptor: globalModelStorageAdaptor}),
		
		schema: function(){
	 		// Schema for datastore
	 		// - used by save, find, etc. to validate queries
	 		
	 		// Define PrimaryKey (if necessary)
	 		// - validation? (or separate function?)
	 		// - should forms automagically use validation supplied here?
	 		//	 - yes! including autovalidate="true" in the form should do this
	 		return {
	 						key: null,
	 						name: '',
	 						description: ''
	 					 };
		},
		
		
		// Custom storage for hardcoded games
		games: {
			simon: {
					key: 'simon',
					name: 'Simon (n-back)',
					description: 'Follow the pattern'
				},
			difference: {
					key: 'difference',
					name: 'Difference',
					description: 'Find the difference between pictures'
				},
			shape: {
					key: 'shape',
					name: 'Shape Match',
					description: 'Did the previous shape match?'
				},
			bird: {
					key: 'bird',
					name: 'Bird Spotting',
					description: 'Hit the word, spell the word'
				},
			
		},
		
		
		validate: function(){
			
		},
		
		onUpdate: function(data){
			
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
			
			
			
			
		},
		
		func: {
			// Custom functions
			// - like functions is Game.php (Cake Models)
			// - call with: model.Game.func.updateUser();
			
			package: function(package){
				// Takes a data package from a Game and saves it to the DB
				// - updates User's info as well?
				
				
			}
			
		}
		
	};
		
},10);