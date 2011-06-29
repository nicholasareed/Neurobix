// 
//  --- our app behavior logic (Controllers) ---
//

var chart;
var demomode = 1;

function gameEnd(){
	// Handle the package
	// - should results have already been saved? Probably yes, because otherwise people might play the game, then just exit out or something
	
	// Demo Mode? Want people to sign up
	if(demomode){
		$('div#testgame iframe#testGameFrame').attr('src',"blank.html");
	  $('div.login_bar').removeClass('hidden');
		$('#welcome').trigger('launch');
		return false;
	}
	
	// Get stored shit
	
	
}

run(function () {
    // immediately invoked on first run
    var init = (function () {
    	// Is the person already logged in?
    	
    	/*
    	store.get('user', function(tempUser) {
				if (tempUser) {
					user.li = 1;
					$('#home').trigger('launch');
				} else {
					$('#welcome').trigger('launch');
				}
			});
    	*/
    	
    })();
    
    // iFrame height
    var frameWidth = $(window).width();
    var frameHeight = $(window).height();
    frameHeight = window.innerHeight;
    $('div#testgame').css('height',frameHeight+'px');
    $('div#testgame').css('max-height',frameHeight+'px');
    $('div#testgame iframe#testGameFrame').css('height',frameHeight+'px');
    $('div#game').css('height',frameHeight+'px');
    $('div#game').css('max-height',frameHeight+'px');
    $('div#game iframe#gameFrame').css('height',frameHeight+'px');
    
    // a little inline controller
    when('login'); // Checked logged in status (lawnchair)
    when('signup');
    when('welcome',function(){
    		if($('div.login_bar').hasClass('hidden')){
    			$('div.login_bar').removeClass('hidden');
    		}
    	},function(){
    		//console.log('welcome');
    });
    when('game');
    
    when('testgame',null,function(){
    	// Hide everything else when we are playing a Game
    	
    	/* 
    	Game Logic
    	
    	What game is being played?
    	- figure out from calling button (attr.gameid)
    	- load from necessary files
    	
    	Fixed Entry and Exit points
    	- includes Instructions
    	
    	Game contains:
    	- JS file with entry functions
    	
    	Entry:
    	- changes iframe source, which causes all JS and whatnot to fire on the new page
    	- should get stats and whatnot for the game
    	- does it makes sense to load the game in a new window?
    	
    	Exit:
    	- gameExit() function above
    	- shows results
    	- options to play again, etc. (standardized)
    	- packaged results
    	- when Done/Exit button is pressed, call the completed function with package details
    	
    	Additional thoughts:
    	- exit in middle of game?
    		- currently forces restart of app
    	
    	*/
    	
    	// What game is being played?
    	var gamename = 'test';
    	
    	$('div.login_bar').addClass('hidden');
    	
    	// Update the iframe with the game's src
    	// - clear it first (blank.html) then load the newness
			$('div#testgame iframe#testGameFrame').attr('src',"blank.html");
			$('div#testgame iframe#testGameFrame').attr('src',"games/test/index.html");
    	
    	
    });
    
    when('home',function(){
	    	// beforeFilter
	    	// - must be logged in
				if (user.li) {
					// all good
				} else {
					$('#welcome').trigger('launch');
					return false;
				}
				
				return true;
			
    	},function(){
	    	// Action
	    	$('div.login_bar').addClass('hidden');
    		
    		
    });
    
    
    when('settings', null, function() {
			// load settings from store and make sure we persist radio buttons.
			store.get('config', function(saved) {
				if (saved) {
					if (saved.map) {
						$('input[value=' + saved.map + ']').attr('checked',true);
					}
					if (saved.zoom) {
						$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
					}
				}
			});
		});
		
});


// Logic for button clicks and whatnot
$(document).ready(function(){
	
	/* ---------------------------- Login --------------------------------*/
	$('div.login_button').touchdown(function(){
		store.save({
	        key:'user',
	        username: 'test',
	        password: 'test'
	    });
		user.li = 1;
	  $('#home').trigger('launch');
	});
	
	/* ---------------------------- Login --------------------------------*/
	$('div.logout_button').touchdown(function(){
		user.li = 0;
		store.nuke();
	  $('#home').trigger('launch');
	});
	
	
	// Trigger the homepage (should be first page attempting to display, like the main Route)
	// - see what needs to be loaded
	
	store.get('user', function(tempUser) {
		if (tempUser) {
			// all good
			user.li = 1;
			$('#home').trigger('launch');
		} else {
			$('#welcome').trigger('launch');
		}
	});
	
});