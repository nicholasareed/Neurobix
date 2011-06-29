
// View.js
// - manage actions

// Default View functions
var view = {
	
	name: 'Views',
	
	template: function(elem,data,callback){
		// Render a template
		// - doesn't handle nested stuff yet (multiple folders below 'Elements')
		
		var c = elem.split('.')[0]; // 'Users', 'Elements'
		var a = elem.split('.')[1]; // 'home'
		
		$.ajax({
			url: 'assets/js/templates/'+c+'/'+a+'.html',
			//async: false,
			cache: false, // cache: 'true' messes up for online app.neurobix.com (cache returns old stuff)
			dataType: 'html',
			success: function(template){
				var html = $.tmpl(template, data);
				if(callback){
					callback(html);
				}
			}
		});
		
	}, 
	
	/*
	
	wp7newPage: function(){ // or wp7AnimatePage? Depends on where animation is occurring, how the page is transformed
		// New page for Windows Phone 7
		// - handling the animation
	},
	
	*/
	
	animation: false,
	
	newPage: function(elem,data,callback,anim){
		view.template(elem,data,function(html){
			
			// Default animation is Slide from Right
			var animation = {
				start: {
					left: '-100%',
					opacity: .1
				},
				middle: {
					left: '100%'
				},
				end: {
					left: 0,
					opacity: 1
				}
			};
			
			if(!anim){
				if(view.animation){
					anim = view.animation;
				}
			}
			
			if(anim){
				if(anim == 'left'){ // Slide from Left
					animation.start.left = '100%';
					animation.middle.left = '-100%';
				}
				if(anim == 'fade'){ // Fade in/out
					animation.start.left = 0;
					animation.middle.left = 0;
					animation.start.opacity = 0;
				}
				if(anim == 'none'){
					animation.start = {};
					animation.middle = {};
					animation.end = {};
				}
			}
			
			view.animation = false; // Reset it
			
			$('div#container').animate(animation.start,
			    {
			    duration: 100,
			    complete: function(){
						$('.view').remove();
						$('#container').append(html);
						
						// The callback as soon as we have the data
						if(callback){
							callback(html);
						}
						
						$('#container').css(animation.middle).animate(animation.end,{
			    		duration: 100,
							complete: function(){
								//alert('done');
							}
						});
			    }
			});
			
		});
	}
	
};
