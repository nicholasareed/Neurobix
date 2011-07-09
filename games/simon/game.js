
// This is the game

// Game Variables
var gameLength = 20;

// Times (ms)
var colorDisplayTime = 500; // How long the element/color in a square is displayed for
var totalTurnTime = 3000; 	// Amount of time before the next turn is started

// N-back Distance and Percentages
var visualNBack = 2;				// Distance to travel back
var colorNBack = 2;
var percentageMatching = 3; // Not an actual percentage

// Visual Position info
var totalSquares = 9;
var visualPositions = [];
var duplicateVisualPositions = 8;

// Color info
var colorList = ['red','blue','green','yellow','orange','black','purple'];
var totalColors = colorList.length;
var colorPositions = [];
var duplicateColorPositions = 8;

// Turn vars
var currentTurn = 0;

// Scoring
var scorePoints = 0;
var scoreConsecutive = 0;
var scoreMissed = 0;

$(document).ready(function(){
	
	$('div.exit').click(function(){
		// Somehow exit?
		parent.view.animation = 'fade';
		parent.controller.Games.comingFrom = 'simon';
		parent.controller.runAction('Games.info');
		return false;
	});
	
	
	$('div.play').click(function(){
		// The User played a game
		// - create some fake values
		// - display those values
		parent.view.animation = 'fade';
		parent.controller.Games.comingFrom = 'simon';
		parent.controller.runAction('Games.info');
		return false;
	});
	
	var hist = [];
	
	$('div.start').click(function(){
		// We are starting
		$(this).remove();
		$('div.button.visual').show();
		$('div.button.color').show();
		
		// Set Default look
		$('div.afterPressResult').removeClass('hide');
		
		// Build all the visual positions
		visualPositions = buildVisualPositions();
		colorPositions = buildColorPositions();
		
		// Start a new Turn
		currentTurn = 0;
		setTimeout(newTurn,1000);
		//newTurn();
		
	});
	
	
	function buildColorPositions(){
		// Build the Color Positions for a game
		
		// visualPositions
		// gameLength
		// duplicateVisualPositions
		
		// Build 20 random
		
		var positions = [];
		for(var i = 1; i <= gameLength; i++){
			var pos = Math.floor(Math.random()*(totalColors)) + 1; // Cannot be 0
			if(pos == positions[positions.length-1]){ // Prevent repeating values (fails for nback=2)
				i--;
			} else {
				positions.push(pos);
			}
		}
		
		// Randomly choose 8 positions to change to follow the nback
		for(i = 0; i < duplicateColorPositions; i++){
			// Get random place in array
			var pos = Math.floor(Math.random()*(positions.length)); // bug: might ignore the last element in array
			
			// Get amount in front of it
			var sub = colorNBack; // +1?
			if(!positions[pos-sub]){
				//console.log('undefined position');
				i--;
			} else {
				var n = positions[pos-sub];
				positions[pos] = n;
			}
			
		}
		
		// Turn positions into colors
		var colors = [];
		for(var i = 0; i < positions.length; i++){
			colors.push(colorList[positions[i]-1]);
		}
		console.log(colors);
		
		return colors;
		
	}
	
	
	function buildVisualPositions(){
		// Build the Visual Positions for a game
		
		// visualPositions
		// gameLength
		// duplicateVisualPositions
		
		// Build 20 random
		
		var positions = [];
		for(var i = 1; i <= gameLength; i++){
			var pos = Math.floor(Math.random()*(totalSquares)) + 1; // Cannot be 0
			if(pos == positions[positions.length-1]){ // Prevent repeating values (fails for nback=2)
				i--;
			} else {
				positions.push(pos);
			}
		}
		
		// Randomly choose 8 positions to change to follow the nback
		for(i = 0; i < duplicateVisualPositions; i++){
			// Get random place in array
			var pos = Math.floor(Math.random()*(positions.length)); // bug: might ignore the last element in array
			
			// Get amount in front of it
			var sub = visualNBack; // +1?
			if(!positions[pos-sub]){
				//console.log('undefined position');
				i--;
			} else {
				var n = positions[pos-sub];
				positions[pos] = n;
			}
			
		}
		
		console.log(positions);
		
		return positions;
		
		
		// Build out total-duplicate
		var run = gameLength - duplicateVisualPositions;
		var positions = [];
		for(var i = 1; i <= run; i++){
			var pos = Math.floor(Math.random()*(totalSquares)) + 1; // Cannot be 0
			if(pos == positions[positions.length-1]){ // Prevent repeating values
				i--;
			} else {
				positions.push(pos);
			}
		}
		
		// Randomize the places we will do duplicates
		// - ignore end-1
		for(i = 0; i < duplicateVisualPositions; i++){
			// Get random place in array
			var pos = Math.floor(Math.random()*(position.length)); // bug: might ignore the last element in array
			
			// Does nback+ exist?
			
			
			// - does this mean the last 2 will never work?
		}
		
		
	}
	
	
	function newTurn(){
		// Was a button pressed missed?
		if(!$('div.button.visual').hasClass('pressed')){
			// No button pressed, should it have been?
			var match = visualMatch();
			if(match === 1){
				// Matched, missed it
				scorePoints -= 100;
				scoreConsecutive = 0;
				scoreMissed++;
			}
			var match = colorMatch();
			if(match === 1){
				// Matched, missed it
				scorePoints -= 100;
				scoreConsecutive = 0;
				scoreMissed++;
			}
			
			// Update Scores
			updateScores();
			
		}
		
		// Are we done with turns?
		if(currentTurn == gameLength){
			// Done, display finish score
			console.log('done');
			return;
		}
		
		// What position do we want to display in?
		// - this function returns 0-8
		// - also depends on last position
		//var result = getPosition(matchPos);
		var result = positionToSquare(visualPositions[currentTurn]);
		var pos = result.pos;
		var xpos = result.col;
		var ypos = result.row;
		
		var bgColor = colorPositions[currentTurn];
		
		// Display the graphic (turn it the correct color)
		//$('table.game tr:nth-child('+(ypos+1)+') td:nth-child('+(xpos+1)+')').text(pos + ' [' + xpos + ',' + ypos + ']');
		//$('table.game tr:nth-child('+(ypos+1)+') td:nth-child('+(xpos+1)+')').text(pos);
		//$('table.game tr:nth-child('+(ypos+1)+') td:nth-child('+(xpos+1)+')').addClass('active'); // Used to change class
		$('table.game tr:nth-child('+(ypos+1)+') td:nth-child('+(xpos+1)+')').css('background',bgColor); // Change the background color of the square
		
		// Start the color-removing timeout (.5 seconds)
		setTimeout(function(){
			$('table.game td').css('background','inherit');
		},colorDisplayTime);
		
		// Do the next Turn after the time period expires
		setTimeout(newTurn,totalTurnTime);
		
		// Re-enable buttons (visual, etc.)
		$('div.button.visual').removeClass('pressed');
		$('div.button.color').removeClass('pressed');
		
		// Increment currentTurn
		currentTurn++;
		
	}
	
	
	$('div.button.visual').click(function(){
		// Visual Button was pressed
		// - if it exists, we are in the middle of a turn
		
		// Already pressed?
		if($(this).hasClass('pressed')){
			return;
		}
		$(this).addClass('pressed');
		
		/*
		// Does the currently-displayed element (or most-recently displayed) match up with n-back element?
		var ct = currentTurn - 1;
		var current = visualPositions[ct];
		var pastCount = visualNBack;
		
		// Are we even far enough back? (enough elements in hist array?)
		if(ct < pastCount){
			return; // Don't count negatively
		}
		
		// Get nback value
		var nback = visualPositions[ct-pastCount];
		*/
		
		var match = visualMatch();
		
		if(match === -1){
			$(this).removeClass('pressed');
			return;
		}
		
		// Does the value match?
		if(match === 1){
			// Correct!
			$('div.afterPressResult').addClass('correct').text('Correct!');
			setTimeout(function(){
				$('div.afterPressResult').removeClass('correct').text('');
			},1000);
			
			scorePoints += 100;
			scoreConsecutive++;
			updateScores();
			
		} else {
			// Wrong
			$('div.afterPressResult').addClass('wrong').text('Whoops, wrong');
			setTimeout(function(){
				$('div.afterPressResult').removeClass('wrong').text('');
			},1000);
			scorePoints -= 100;
			scoreConsecutive = 0;
			updateScores();
		}
		
		
	});
	
	
	function visualMatch(){
		// Does the current visual match?
		// - -1,0,1
		
		// Does the currently-displayed element (or most-recently displayed) match up with n-back element?
		var ct = currentTurn - 1;
		var current = visualPositions[ct];
		var pastCount = visualNBack;
		
		// Are we even far enough back? (enough elements in hist array?)
		if(ct < pastCount){
			return -1; 
		}
		
		// Get nback value
		var nback = visualPositions[ct-pastCount];
		
		// Does the value match?
		if(current == nback){
			return 1;
		} else {
			return 0;
		}
		
	}
	
	
	$('div.button.color').click(function(){
		// Visual Button was pressed
		// - if it exists, we are in the middle of a turn
		
		// Already pressed?
		if($(this).hasClass('pressed')){
			return;
		}
		$(this).addClass('pressed');
		
		/*
		// Does the currently-displayed element (or most-recently displayed) match up with n-back element?
		var ct = currentTurn - 1;
		var current = visualPositions[ct];
		var pastCount = visualNBack;
		
		// Are we even far enough back? (enough elements in hist array?)
		if(ct < pastCount){
			return; // Don't count negatively
		}
		
		// Get nback value
		var nback = visualPositions[ct-pastCount];
		*/
		
		var match = colorMatch();
		
		if(match === -1){
			$(this).removeClass('pressed');
			return;
		}
		
		// Does the value match?
		if(match === 1){
			// Correct!
			$('div.afterPressResult').addClass('correct').text('Correct!');
			setTimeout(function(){
				$('div.afterPressResult').removeClass('correct').text('');
			},1000);
			
			scorePoints += 100;
			scoreConsecutive++;
			updateScores();
			
		} else {
			// Wrong
			$('div.afterPressResult').addClass('wrong').text('Whoops, wrong');
			setTimeout(function(){
				$('div.afterPressResult').removeClass('wrong').text('');
			},1000);
			scorePoints -= 100;
			scoreConsecutive = 0;
			updateScores();
		}
		
		
	});
	
	
	function colorMatch(){
		// Does the current visual match?
		// - -1,0,1
		
		// Does the currently-displayed element (or most-recently displayed) match up with n-back element?
		var ct = currentTurn - 1;
		var current = colorPositions[ct];
		var pastCount = colorNBack;
		
		// Are we even far enough back? (enough elements in hist array?)
		if(ct < pastCount){
			return -1; 
		}
		
		// Get nback value
		var nback = colorPositions[ct-pastCount];
		
		// Does the value match?
		if(current == nback){
			return 1;
		} else {
			return 0;
		}
		
	}
	
	
	function updateScores(){
		// Update the displayed scores
		$('div.scores span.points').text(scorePoints);
		$('div.scores span.consecutive').text(scoreConsecutive);
		$('div.scores span.missed').text(scoreMissed);
	}
	
	
	function positionToSquare(pos){
		// New position should somehow correlate to old position
		// - otherwise, it is an 11% chance (1/9) of matching position
		
		
		// Convert into a row/col format
		var xpos = pos%3; // remainder, this is correct
		var ypos = Math.floor(pos/3);
		if(xpos == 0){
			xpos = 2;
			ypos -= 1;
		} else {
			xpos -= 1;
		}
		
		return {pos: pos,
						row: ypos,
						col: xpos};
	}
	
	
	function getPosition(matchWith){
		// New position should somehow correlate to old position
		// - otherwise, it is an 11% chance (1/9) of matching position
		
		var pos = Math.floor(Math.random()*(totalPos)) + 1; // Cannot be 0
		
		// Give it a 25% chance of matching
		var match = Math.floor(Math.random()*percentageMatching) + 1;
		console.log(match);
		if(match === 1){
			console.log('match');
			pos = matchWith;
		}
		
		// Convert into a row/col format
		var xpos = pos%3; // remainder, this is correct
		var ypos = Math.floor(pos/3);
		if(xpos == 0){
			xpos = 2;
			ypos -= 1;
		} else {
			xpos -= 1;
		}
		
		return {pos: pos,
						row: ypos,
						col: xpos};
		
	}
	
});