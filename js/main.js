
var dictionary = {
	type: {
		'circle' : {
					html : '<div class="outer circle-container">' + 
			                	'<div class="outer circle">' +
				                    '<div class="inner circle-container">' +
				                        '<div class="inner circle"></div>' +
				                    '</div>' +
			                    	'<p class="title"></p>' +
			                	'</div>' +
			            	'</div>',
		},
		'info-block' : {
						html : 
								'<div class="info-container">' +
									'<div class="header title"></div>' +
									'<p class="content"></p>' + 
								'</div>',
		}
	},
	modules: [],
}

var animation = {
	currentScroll: 0,
	prevScroll: 0,
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// ~~~~~~~~~~~~~~~~~~~~ MODULE CLASS ~~~~~~~~~~~~~~~~~~~~

function Module($module, data){
	this.$module = $module;
	this.type = data.type || ""; 
	this.title = data.title || ""; 
	this.content = data.content || "";
	this.opacity = 0;
	this.animateID = 0;
}

Module.prototype.drawModule = function() {
	var $html = $(dictionary.type[this.type].html); 
	$html.find('.title').html(this.title);
	$html.find('.content').html(this.content);
	this.$module.html($html);
};

Module.prototype.incrementOpacity = function(delta) {
	this.opacity += delta;
	this.opacity.clamp(0,1);
	this.$module.css('opacity', this.opacity);

};

Module.prototype.inBound = function(currentScroll) {
	var module2Top = this.$module.offset().top; 
	var module2Bottom = module2Top + this.$module.height();
	return (currentScroll >= module2Top && currentScroll <= module2Bottom);
};

Module.prototype.outOfView = function(currentScroll) {
	return this.$module.offset().top > currentScroll + $(window).height() 
		|| this.$module.offset().top + this.$module.height() < currentScroll;
};

Module.prototype.onScroll = function(scrollOffset) {
};

Module.prototype.resize = function() {
};

Module.prototype.animate = function() {
	this.animateID = requestAnimationFrame(this.animate());
};

Module.prototype.stopAnimation = function(){
	cancelAnimationFrame(this.animateID);
}


// ~~~~~~~~~~~~~~~~~~~~ MODULE SUBCLASSES ~~~~~~~~~~~~~~~~~~~~

function Circle($module, data){
	Module.call(this, $module, data);
	this.degree = 0;
	this.clockwise = true;
	this.isLooping = true;
	this.spinSpeed = .35;
	this.animate();
}

Circle.prototype = Object.create(Module.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.spin = function(delta) {
	this.degree = (this.clockwise) ? this.degree + delta : this.degree - delta; 
	this.$module.find('.inner.circle').css("transform", "rotateZ(" + this.degree + "deg)"); 
};

Circle.prototype.jitter = function() {
	var jitter = Math.random() - Math.random(); 
	this.$module.find('.title').css("transform", "translateX(-50%) translateY("+ (-50 + jitter) +"%)");
};

Circle.prototype.resize = function() {
	$('.circle p').css('font-size', Math.round(.1*this.$module.find('.outer.circle-container').height()));
};

Circle.prototype.animate = function(){
	if(this.inBound(animation.currentScroll)){
		this.spin(this.spinSpeed)
		this.jitter();
	}
	this.animateID = requestAnimationFrame(this.animate.bind(this));
}

Circle.prototype.onScroll = function(scrollOffset) {
	this.spin(scrollOffset);
	this.spinSpeed = (scrollOffset) ? Math.sign(scrollOffset) * Math.abs(this.spinSpeed) : this.spinSpeed;
};

function InfoBlock($module, data){
	Module.call(this, $module, data);
	this.translateX = 0;
}

InfoBlock.prototype = Object.create(Module.prototype);
InfoBlock.prototype.constructor = InfoBlock;

InfoBlock.prototype.incrementX = function(delta){
	this.translationX += delta  + delta * translationX * .1;
	this.translationX.clamp(0,200);
}

function init(){
	animation.currentScroll = $(window).scrollTop(); 
	animation.prevScroll = $(window).scrollTop(); 
	var $modules = $('.module');
	$modules.each(function(i){
		var module;
		switch($(this).data().type){
			case 'circle':
				module = new Circle($(this), $(this).data()); 
				break;
			case 'info-block':
				module = new InfoBlock($(this), $(this).data()); 
				break;
			default: 
				module = new Module($(this), $(this).data()); 
		}	
		dictionary.modules.push(module);
		module.drawModule();
	});

	$(window).on('resize', function(){
		for(var i = 0; i < dictionary.modules.length; i++){
			dictionary.modules[i].resize();
		}
	});


	$(window).scroll(function(){
		animation.currentScroll = $(window).scrollTop(); 
		//scroll up is positive, scroll down is negative
		var scrollOffset = animation.prevScroll - animation.currentScroll; 
		for(var i = 0; i < dictionary.modules.length; i++){
			dictionary.modules[i].onScroll(scrollOffset);
		}

		animation.prevScroll = animation.currentScroll; 
	});
}

$(init);
