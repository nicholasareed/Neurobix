
// Model.js
// - manage data-sources
// - manage listeners


// Default Model functions
var model = {
	
	structure: [
							'save',
							'find',
							'all',
							'validate',
							'listeners',
							'nuke',
							'onUpdate'
						 ],
	
	name: 'Model',
	
	schema: function(){
 		// Schema for datastore
 		// - used by save, find, etc. to validate queries
 		
 		// Define PrimaryKey (if necessary)
 		return {
 						id: {},
 						name: {},
 						pass: {}
 					 };
	},
	
	validate: function(){
		// Not sure what format this should take...
		// - is a function correct, or an Object approach?
		/*
		
			
		
		*/
	},
	
	nuke: function(){
		
 		var modelName = this.name;
 		model[modelName].store.nuke();
 		
	}, 
	
 	save: function(data,callback){
 		// Is this an update?
 		// Fire listeners? 
 		
 		// Get the data we're trying to save
 		
 		// Does the primary key already exist? (primary key defined in schema()
 		
 		// If PrimaryKey doesn't exist (either in data, or in the
 		// - is a Create(); <-- This is automatic I think
 		// - autoupdate PrimaryKey? Schema should define this shit
 			
 		var modelName = this.name;
		
 		model[modelName].store.save(data,function(data){
 			
 			// data = returned Data after saving
 			
	 		// Fire onUpdate function
	 		model[modelName].onUpdate(data);
	 		
	 		// Return
	 		// - can we do the callback like this?
	 		if(callback){
	 			callback(data);
	 		}
 		
 		});
	},
	
	find: function(conditions,callback){
		// Use store.all then iterate through conditions
		// - I cannot figure out how the fuck store.find() works with the stupid fucking 'r' and other shit
		
 		var modelName = this.name;
		
		model[modelName].store.all(function(a){
			if(a && a.length > 0){
				var r = [];
				$.each(a,function(aIndex,aVal){
					// Conditions match?
					var match = true;
					$.each(conditions,function(cIndex,cVal){ // cIndex = conditionIndex, cVal = conditionValue
						if(aVal[cIndex] != cVal){
							match = false;
						}
					});
					if(match){
						r.push(aVal);
					}
				});
				callback(r);
			} else {
				// Empty
				//console.log('Empty1');
				callback([]);
			}
		});
		
	},
	
	all: function(callback){
		// Return all records for a Model
		
		var modelName = this.name;
		
		model[modelName].store.all(function(a){
			if(a && a.length > 0){
				// Got some results
				
				callback(a);
				
			} else {
				// No result, empty
				callback([]);
			}
		});
		
	},
	
	onUpdate: function(){
		
	},
	
	listeners: function(){
		
	},
	
	validationListeners: function(){
		// Create validation routines
		// - use livequery
		// - attach livequery to autovalidate="true" -> uses Model data to apply validation classes and what not to the input (used by jQuery Validation plugin)
		
		
	}
	
};

