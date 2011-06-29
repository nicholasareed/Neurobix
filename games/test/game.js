
// This is the game
$(document).ready(function(){
	
	$('div.exit').click(function(){
		// Somehow exit?
		parent.controller.runAction('Games.end');
		return false;
	});
	
});