
// UsersController.js
// - manage actions

waitIntervals['Users'] = window.setInterval(function(){ // Necessary to load stuff in the correct order
	
	if(typeof(controller) == "undefined"){ // controller.js must be fully loaded
		return;
	}
	window.clearInterval(waitIntervals['Users']);
	
	controller.Users = {
		
		name: 'Users',
		
		actions: {
			
			home: function(){
				
				// Launch the game immediately (temporarily skip Auth)
				var key = 'simon';
				var game = model.Game.games[key];
				var data = {src: 'games/simon/game.html', // Need to change to include 'key'
										key: key};
				view.newPage('Games.play',data,function(){
			    $('div#play').css('height',framework.frameHeight+'px');
			    $('div#play').css('max-height',framework.frameHeight+'px');
			    $('div#play iframe#playGameFrame').css('height',framework.frameHeight+'px');
			    
				});
				
				return;
				
				// Auth stuff, ignored for now
				
				var self = this;
				
				// Logged in?
				// - yes, go to actual homepage
				// - no, go to Welcome page
				model.Session.find({key: 'Auth.User'},function(data){
					if(data.length > 0){
						view.newPage('Users.home');
					} else {
						controller.runAction('Users.welcome');
					}
					//controller.runAction('Users.welcome');
				});
				
			},
			
			signup: function(){
				// Log the User in
				if(!$(this).attr('isPost')){
					view.newPage('Users.signup');
				} else {
					controller.preventActions = true;
										
					// Validate Form
					// - use jquery Validation plugin
					// - http://docs.jquery.com/Plugins/Validation
					
					var name = $('input[name="name"]').val();
					var pass = $('input[name="pass"]').val();
					
					if(name == ''){
						alert('Must have a name');
						//controller.reset();
						controller.reset();
						return false;
					}
					
					var search = {name: name};
					
					controller.hold();
					model.User.find(search,function(data){ // Name already registered?
						
						var saveData = {};
						if(data.length > 0){
							$('div.error').text('Name is already registered, try a different one').fadeIn();
							//controller.reset();
							controller.holds = 0;
							controller.ignoreOnReady = true;
							return false;
							
						} else {
							// No User with those credentials
							
							// Set the User as default
							controller.Users.viewData = data[0];
							
							saveData = {name: name,
													pass: pass};
							controller.hold();
							model.User.save(saveData,function(r){
								// Set the User as default
								controller.Users.viewData = r;
								controller.unhold();
									
								// Save the Session
								var saveData = {key: 'Auth.User',
															  User: r};
								model.Session.save(saveData,function(r){
									// Don't need any update to data
								});
							
							});
							
							
						}
						
						controller.unhold();
					});
					
					// An Action has a few possible outcomes
					// - modifies some part of the existing view
					// - changes the View to a different page
					
					controller.onReady(function(){
						
						// Did we succeed in logging in?
						if(!controller.ignoreOnReady){
							// Logged in
							
							view.newPage('Users.home');
							
						}
						
						controller.preventActions = false;
						controller.ignoreOnReady = false;
						
					});
					
					
				}
				
				return false;
				
			},
			
			allUsers: function(){ // Not working yet (no view)
				// Display all registered Users
				
			},
			
			killUsers: function(){ // Not working yet (no view)
				// Wipe the Users database
				model.User.nuke();
				model.Session.nuke();
				controller.runAction('Users.welcome');
			},
			
			login: function(){
				// Log the User in
				if(!$(this).attr('isPost')){
					view.newPage('Users.login');
				} else {
					controller.preventActions = true;
					
					var name = $('input[name="name"]').val();
					var pass = $('input[name="pass"]').val();
					
					var search = {name: name,
												pass: pass};
					
					
					// This should make an AJAX request to the Neurobix server to auth the user
					// - navigator.network.isReachable should be set
					// - encrypt the request in some manner
					// - or just use SSL
					controller.hold();
					model.User.find(search,function(data){
						
						var saveData = {};
						if(data.length > 0){
							// Set the User as default
							controller.Users.viewData = data[0];
							
							saveData = {name: name,
													pass: 'test',
													points: 0};
							controller.hold();
							model.User.save(saveData,function(r){
								// Set the User as default
								controller.Users.viewData = r;
								controller.unhold();
									
								// Save the Session
								var saveData = {key: 'Auth.User',
															  User: r};
								model.Session.save(saveData,function(r){
									// Don't need any update to data
								});
							
							});
							
						} else {
							// No User with those credentials
							// - show error screen
							$('div.error').text('Invalid User/Pass').fadeIn();
							controller.ignoreOnReady = true;
							controller.clearHolds();
							return false;
							
						}
						
						controller.unhold();
					});
					
					// An Action has a few possible outcomes
					// - modifies some part of the existing view
					// - changes the View to a different page
					
					controller.onReady(function(){
						
						// Did we succeed in logging in?
						if(!controller.ignoreOnReady){
							
							view.newPage('Users.home');
							/*
							view.template('Users.result',controller.Users.viewData,function(html){
								$("#result.view").remove();
								$('#container').append(html);
							});
							*/
						}
						
						controller.preventActions = false;
						controller.ignoreOnReady = false;
						
					});
					
					
				}
				
				return false;
				
			},
			
			logout: function(){
				// Run logout stuff
				
				$(this).removeClass('pressed'); // Not always necessary, but it doesn't break anything
				
		    framework.notification.confirm(
		        'Do you want to log out?',  // message
		        function(button){
		        	if(button == 1 || button == true){
								model.Session.nuke();
								controller.runAction('Users.home');
							}
		        },              // callback to invoke with index of button pressed
		        'Log out?',            // title
		        'Log out,Cancel'          // buttonLabels
		    );
		    
		    controller.reset();
		    
		    return false;
				
			},
			
			welcome: function(){
				view.newPage('Users.welcome'); // No data
			},
			
			choose: function(){ // Not using this one
				
				alert('here');
				// Get the submitted data
				// - see if it already exists
				var name = $('input[type="text"]').val();
				
				controller.hold();
				model.User.find({name: name},function(data){
					
					var saveData = {};
					if(data.length > 0){
						// Set the User as default
						controller.Users.viewData = data[0];
						
						// Save the Session
						saveData = {key: 'Auth.User',
												User: data[0]};
						model.Session.save(saveData,function(r){
							// Don't need any update to data
						});
					} else {
						saveData = {name: name,
												pass: 'test',
												points: 0};
						controller.hold();
						model.User.save(saveData,function(r){
							// Set the User as default
							controller.Users.viewData = r;
							controller.unhold();
								
							// Save the Session
							var saveData = {key: 'Auth.User',
														  User: r};
							model.Session.save(saveData,function(r){
								// Don't need any update to data
							});
						
						});
						
					}
					
					controller.unhold();
				});
				
				// An Action has a few possible outcomes
				// - modifies some part of the existing view
				// - changes the View to a different page
				
				controller.onReady(function(){
					
					controller.preventActions = false;
					
					// Load a new View
					// - all the shit should already be stored
					//$("#result.view").remove();
					//$("#resultTemplate").tmpl(controller.Users.viewData).appendTo('body');
					
					view.template('Users.result',controller.Users.viewData,function(html){
						$("#result.view").remove();
						$('#container').append(html);
					});
					
					
				});
				
				return false;
				
			},
			
			pointsUpDown: function(){
				
				// Update the Session and User
				// - User, then Session with results
				// - really, Auth.User should be a Plugin (or a Component)
				
				var spread = parseInt($(this).attr('points'),10);
				
				model.Session.find({key: 'Auth.User'},function(data){
					if(data.length > 0){
						var key = data[0].User.key;
						model.User.find({key: key},function(data){
							data[0].points += spread;
							model.User.save(data[0],function(data){
								// Done saving
								//console.log(data);
								//console.log('Done saving User');
								//model.Session.func.updateAuthUser({key: data.key});
							});
						});
					}
				});
				
				$(this).removeClass('pressed');
				
				return false;
				
			}
			
		},
		
		listeners: function(){
			var self = this;
			
			/*
			self.registerAction('Users.login','click',function(){
				// turns this into clickAction
				$(this).removeClass('pressed');
				return false;
			});
			*/
			
		},
		
		display: function(data){
			// Input variables should be set in the "data" space. 
			// - Can I leave 'data' out and somehow get the arguments passed to it?
			
			// Clear out old Templates
			// - only clear them out if now 'back' button exists on the existing page... (keeps back button working)
			// - call it keepBreadcrumb or something
			
			// Display new Template
			
		}
		
	};

},10);