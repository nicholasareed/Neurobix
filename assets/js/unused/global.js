
// Browser Check (for testing)
var isBrowser = 0;
$(document).ready(function(){
	$.each(jQuery.browser, function(i, val) {
		  if(i=="mozilla"){
		  	$("body").css("width","320px");
		  	isBrowser = 1;
		  }
		});
	if($(window).width() > 500){
		$("body").css("width","320px");
		isBrowser = 1;
	}
});

// User information
var user = {
						li: 0,
						email: '',
						password: ''
					 };

// Touchdown (touchintent)
(function($){
    $.fn.touchdown = function(handler) {
    		
    		if(this.hasClass('touched')){
    			return this;
    		}
    		this.addClass('touched');
    		
				var touchdown = 0;
				this.bind('touchstart',function(){
					touchdown = 1;
					$(this).addClass('pressed');
				});
				this.bind('touchmove',function(){
					touchdown = 0;
					$(this).removeClass('pressed');
				});
				this.bind('touchend',function(){
					if(touchdown){
						handler();
						$(this).removeClass('pressed');
					}
				});
				
				if(isBrowser){
					this.bind('click',function(){
						handler();
					});
				}
			   
			  return this;
    };
})(jQuery);
