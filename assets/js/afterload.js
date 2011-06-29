
// afterload.js
// - overload Models and Controllers

// All Models and Controllers must be loaded
// - just tell it to wait 100 ms before doing anything

window.setTimeout(function(){
	
	// Update all Model with model.js functions (if they are not already overwritten)
	$.each(models,function(mI,modelName){
		$.each(model.structure,function(msI,funcName){
			if(!model[modelName][funcName]){
				model[modelName][funcName] = model[funcName];
			}
		});
		
		// Run listeners
		model[modelName].listeners();
		
	});
	
	
	// Update all Model with model.js functions (if they are not already overwritten)
	$.each(controllers,function(mI,controllerName){
		$.each(controller.structure,function(msI,funcName){
			if(!controller[controllerName][funcName]){
				controller[controllerName][funcName] = controller[funcName];
			}
		});
		
		// Run Controller Listeners
		controller[controllerName].listeners();
	});
	
	controller.buildListeners();
	

	allReady();

},100);