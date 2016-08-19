
/*
* Notes: 
*   - Bind translationX and opacity to data attribute of the tags 
*   - Or even better write the functions to modify those css attributes instead of the global variable
*/
	
function init() {

	$('body').css('font-size', 43 * $(window).height()/725);

	var circleWidth = $('#circle-container').height(); 

	$('.circle').css('width', circleWidth); 

	$(window).on('resize', function(){
		circleWidth = $('#circle-container').height(); 
		$('.circle').css('width', circleWidth); 
		$('body').css('font-size', 43 * $(this).height()/725);
	});

	function incrementOpacity(delta){
		if (opacity <= 1 && opacity >= 0){
			opacity += delta
		}else if(opacity > 1){
			opacity = 1;
		}else {
			opacity = 0; 
		}
	}

	function incrementTranslationX(delta){
		if (translationX >= 0 && translationX <= 200){
			translationX += delta  + delta * translationX * .1;
		}

		if (translationX < 0){
			translationX = 0;
		}else if(translationX > 200){
			translationX = 200; 
		}
		
	}

	function inModuleBound($tag){
		var moduleTop = $($tag).offset().top; 
		var module2Bottom = module2Top + $($tag).height();
		var headerHeight = $('.header').height(); 
		return (currentScroll >= module2Top && currentScroll <= module2Bottom - headerHeight)
	}

	function outOfView($tag){
		return $($tag).offset().top > currentScroll + $(window).height() || $($tag).offset().top + $($tag).height() < currentScroll;
	}

	function stickToTop($tag){
		var leftOffset = $('.module').offset().left
		$($tag).appendTo('body').css({
										'position' : "fixed", 
									    'top' : "0px", 
									    'width' : 'calc(95vh)',
									    'left' : leftOffset, 
									 });
	}

	function unSticktoTop($tag, $location){
		$($tag).prependTo($location).css({
											'width' : "100%",
											'position' : 'absolute',
											'left' : "0px",
											'top' : '0px', 
										})
	}

	function sticktoBottom($tag, $location){
		$($tag).prependTo($location).css({
											'width' : "100%",
											'position' : 'absolute',
											'left' : '0px',
											'bottom' : '0px',
											'top' : 'auto', 
										})
	}

	var degree = 0;  
	var prevScroll, currentScroll, opacity;  
	var clockwise = true; 
	var inbound = true;
	var moduleHeight = $('.module').height(); 
	var moduleMargin = 2 * parseInt($('.module').css('margin-top')); 
	var totalIndexes = parseInt($('body').height() / (moduleHeight + moduleMargin));
	var translationX = 200;  
	var module2Top = $('#second').offset().top; 
	var module2Bottom = module2Top + $('#second').height(); 

	$(window).scroll(function(){
		inbound = false; 
		currentScroll = $(window).scrollTop(); 
		var currentIndex = parseInt(1.5 * currentScroll / (moduleHeight + moduleMargin)); 

		var isScrollingDown = currentScroll>=prevScroll; 
		var isScrollingUp = currentScroll<= prevScroll; 

		if (isScrollingDown){
			switch (currentIndex) {
				case 0:
					inbound = true; 
					degree += 1; 
					clockwise = true;
					if (outOfView($('#second'))){translationX = 200; opacity = 0;}
					break;
				case 1:
					inbound = true;  
					degree += 1;
					clockwise = true;
					incrementTranslationX(-1);  
					incrementOpacity(.1); 
					if(inModuleBound($("#second"))){
						stickToTop($('#num2')); 
						translationX = 0;
					}
					break;
				case 2:
					incrementOpacity(-.01); 
					incrementTranslationX(-1); 
					if(inModuleBound($("#second"))){
						
					}else{
						sticktoBottom($('#num2'), $('#second')); 
						opacity = 1;
					};
					break;
				case 3: 
					incrementOpacity(-.01); 
					
					if(!inModuleBound($("#second"))){
						sticktoBottom($('#num2'), $('#second')); 
						opacity = 1;
						incrementTranslationX(1.5);
					};

					break;
			}
		}else if(isScrollingUp){
			switch (currentIndex) {
				case 0:
					inbound = true; 
					degree -= 1; 
					clockwise = false;
					incrementTranslationX(1); 
					incrementOpacity(-.03); 
					if (outOfView($('#second'))){translationX = 200; opacity = 0;}
					break; 
				case 1:
					incrementOpacity(.25); 
					if(inModuleBound($("#second"))){
						
					}else{
						unSticktoTop($('#num2'), $('#second')); 
					};
					break;
				case 2:
					incrementOpacity(.25); 

					$('#second').css('opacity', opacity);
					break; 
				case 3:
					if(inModuleBound($("#second"))){
						stickToTop($('#num2'));
						translationX = 0; 
					}
					incrementTranslationX(-1);
					break;
			}
		}

		prevScroll = currentScroll; 
		$("#num2").css('transform','translateX(' + translationX + '%)'); 
		$('#second').css('opacity', opacity);
		
		$("#num3").css({
							'transform' : 'translateX(' + 200 - translationX + '%)',
							'opacity' :  opacity, 
						}); 

		$('#third').css('opacity', opacity);

	});


	var pageOpacity = 0; 
	function loop(){
		if (pageOpacity >= 1) {
			pageOpacity += .01
			$('body').css("opacity", pageOpacity); 
		};
		if (inbound){
			if(clockwise){
				degree += .35; 
			}else {
				degree -= .35; 
			};
			var jitter = Math.random() - Math.random(); 
			$('#inner').css("transform", "perspective(3000px) rotateZ(" + degree + "deg)"); 
			$('#first p').css("transform", "translateX(-50%) translateY("+ (-50 + jitter) +"%)");
		}
	
		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);
}

$(init);



// function init(){

// 	/* ~~~~~~~~~~~~~~~~~~~~~~~~ GLOBAL VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 
	
// 		var moduleList = [new Module("greeter", ["Welcome!"]), new Module("info", ["About Me", "Hello! My name is Sufyan Abbasi and Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit dignissimos praesentium iusto debitis pariatur quasi velit provident, ratione distinctio qui perspiciatis incidunt asperiores vel non, molestiae, quae nam consequatur! Rerum! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laborum consequatur tempore ad incidunt odit, alias, sequi sint, sed necessitatibus laboriosam eligendi dolorum nisi voluptatem quo molestias praesentium nam facere."])];
	
// 		var greeterHTML = $('<div class = "module greeter"> <div class="circle-container"> <div class="circle outer"> <div class="circle-container"> <div class="circle inner"> </div> </div> <p></p> </div> </div></div>'); 
	
// 		var infoHTML = $('<div class = "module info"><div class = "header"></div><p></p> </div>'); 
	
	
// 		function Module (typeName, attributes){
// 			this.typeName = typeName; 
// 			this.attributes = attributes; 
// 		}
	
// 		function initializeAllModules(){
// 			for (var i = 0; i < moduleList.length; i++){
// 				appendModule(moduleList[i], i); 
// 			}
// 		}
	
// 		function appendModule(module, index){
// 			switch(module.typeName) {
// 				case "greeter":
// 					var greet = $(greeterHTML).attr('id', index);
// 					$('body').append(greet);
// 					$('#' + index).children().children().children().filter("p").text(module.attributes[0]);
// 					break; 
// 				case "info":
// 					var info = $(infoHTML).attr('id', index);
// 					$('body').append(info);
// 					$('#' + index).children().filter('.header').text(module.attributes[0])
// 					$('#' + index).children().filter('p').text(module.attributes[1]);
// 					break; 
// 			}
// 		}

// 		$('body').css('font-size', 43 * $(window).height()/725);

// 		var circleWidth = $('.circle-container').height(); 

// 		$('.circle').css('width', circleWidth); 

// 		$(window).on('resize', function(){

// 			circleWidth = $('#circle-container').height(); 
// 			$('.circle').css('width', circleWidth); 

// 			$('body').css('font-size', 43 * $(this).height()/725);

// 		});
	
// 	initializeAllModules();


// }
