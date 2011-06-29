
// GamesController.js
// - manage actions

waitIntervals['Games'] = window.setInterval(function(){ // Necessary to load stuff in the correct order
	
	if(typeof(controller) == "undefined"){ // controller.js must be fully loaded
		return;
	}
	window.clearInterval(waitIntervals['Games']);
	
	controller.Games = {
		
		name: 'Games',
		
		actions: {
			
			info: function(){
				
				if(controller.Games.comingFrom){
					var key = controller.Games.comingFrom;
					controller.Games.comingFrom = null;
				} else {
					var key = $(this).attr('gameKey');
					if(key.length <= 0){
						alert('No Game specified in attribute');
						return false;
					}
				}
					
				// Go to the Game Info page
				
				// Load the data for the Template
				var game = model.Game.games[key];
				
				// Load the Page
				view.newPage('Games.info',game);
				
			},
			
			play: function(){
				// What game is being played?
				// - set a global variable that says what game is being played?
				
				var key = $(this).attr('gameKey');
				var game = model.Game.games[key];
				
				if(!key){
					alert('Whoops, failed to load the game');
					return false;
				}
				
				var data = {src: 'games/simon/game.html', // Need to change to include 'key'
										key: key};
				view.newPage('Games.play',data,function(){
					
			    /*var frameWidth = $(window).width();
			    var frameHeight = $(window).height();
			    frameHeight = window.innerHeight;
			    frameHeight = window.innerWidth;*/
			    $('div#play').css('height',framework.frameHeight+'px');
			    $('div#play').css('max-height',framework.frameHeight+'px');
			    $('div#play iframe#playGameFrame').css('height',framework.frameHeight+'px');
			    
				});
				
			},
			
			end: function(){
				// End of a game
				// - summary
				// - should already have Package (stored in database?)
				
				var key = $('div#play').attr('gameKey');
				var game = model.Game.games[key];
				
				view.newPage('Games.end',game);
				
			},
			
			// Test Game function (ignore for now)
			testgame: function(){
				var data = {src: 'games/test/index.html'};
				view.newPage('Games.testgame',data,function(){
								
			    var frameWidth = $(window).width();
			    var frameHeight = $(window).height();
			    frameHeight = window.innerHeight;
			    $('div#testgame').css('height',frameHeight+'px');
			    $('div#testgame').css('max-height',frameHeight+'px');
			    $('div#testgame iframe#testGameFrame').css('height',frameHeight+'px');
			    
				});
			}
			
		}
		
	};

},10);