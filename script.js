function init(){

	/* ~~~~~~~~~~~~~~~~~~~~~~~~ GLOBAL VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 
	
		var moduleList = [new Module("greeter", ["Welcome!"]), new Module("info", ["About Me", "Hello! My name is Sufyan Abbasi and Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit dignissimos praesentium iusto debitis pariatur quasi velit provident, ratione distinctio qui perspiciatis incidunt asperiores vel non, molestiae, quae nam consequatur! Rerum! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laborum consequatur tempore ad incidunt odit, alias, sequi sint, sed necessitatibus laboriosam eligendi dolorum nisi voluptatem quo molestias praesentium nam facere."])];
	
		var greeterHTML = $('<div class = "module greeter"> <div class="circle-container"> <div class="circle outer"> <div class="circle-container"> <div class="circle inner"> </div> </div> <p></p> </div> </div></div>'); 
	
		var infoHTML = $('<div class = "module info"><div class = "header"></div><p></p> </div>'); 
	
	
		function Module (typeName, attributes){
			this.typeName = typeName; 
			this.attributes = attributes; 
		}
	
		function initializeAllModules(){
			for (var i = 0; i < moduleList.length; i++){
				appendModule(moduleList[i], i); 
			}
		}
	
		function appendModule(module, index){
			switch(module.typeName) {
				case "greeter":
					var greet = $(greeterHTML).attr('id', index);
					$('body').append(greet);
					$('#' + index).children().children().children().filter("p").text(module.attributes[0]);
					break; 
				case "info":
					var info = $(infoHTML).attr('id', index);
					$('body').append(info);
					$('#' + index).children().filter('.header').text(module.attributes[0])
					$('#' + index).children().filter('p').text(module.attributes[1]);
					break; 
			}
		}

		$('body').css('font-size', 43 * $(window).height()/725);

		var circleWidth = $('.circle-container').height(); 

		$('.circle').css('width', circleWidth); 

		$(window).on('resize', function(){

			circleWidth = $('#circle-container').height(); 
			$('.circle').css('width', circleWidth); 

			$('body').css('font-size', 43 * $(this).height()/725);

		});
	
	initializeAllModules();


}


