var dictionary = {
	type: {
		'circle' : {
					html : '<div class="outer circle-container">' + 
			                	'<div class="outer circle">' +
				                    '<div class="inner circle-container">' +
				                        '<div class="inner circle"></div>' +
				                    '</div>' +
			                    	'<p class="title"></p>' +
			                    	'<p class="content"></p>' +
			                	'</div>' +
			            	'</div>',
		},
		'info-box' : {
						html : 
								'<div class="info-container">' +
									'<div class="header title"></div>' +
									'<div class="content"></div>' + 
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

function load(url, responseType) {
  return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = responseType;
      xhr.onload = function() {
        if(xhr.status == 200){
            resolve(this.response);
        }else{
            reject(Error(xhr.statusText));
        }
      };
      // Handle network errors
      xhr.onerror = function() {
        reject(Error("Network Error"));
      };
      xhr.send();
  }); 
}

// ~~~~~~~~~~~~~~~~~~~~ Module Class ~~~~~~~~~~~~~~~~~~~~
function Module($module){
	this.$module = $module;
	this.data = $module.data();
	this.type = this.data.type || ""; 
	this.title = this.data.title || "";
	this.name = $module.attr('name') || "_error_";
	this.content = "";
	this.color = this.data.color || "rgba(0,255,156,.8)";
	this.jqueryCache = {};
	this.opacity = 0;
	this.animateID = 0;
}

Module.prototype.loadModule = function() {
	return new Promise((function (resolve, reject){
		load('content/' + this.name + '.html', 'text').then((function(data){
			this.content = data;
			resolve(this);
		}).bind(this)).catch((function(err){
			console.error(err);
			this.content = "This module failed to load properly.";
			reject(this);
		}).bind(this));
	}).bind(this));
};

Module.prototype.drawModule = function() {
	var $html = $(dictionary.type[this.type].html); 
	$html.find('.title').html(this.title);
	$html.find('.content').html(this.content);
	this.$module.html($html);
	this.loadJqueryCache();
	this.resize();
};

Module.prototype.inBound = function(currentScroll) {
	var currentBottom = currentScroll + $(window).height();
	var module2Top = this.$module.offset().top; 
	var module2Bottom = module2Top + this.$module.height();
	return (currentScroll >= module2Top && currentScroll <= module2Bottom)
	       ||(currentBottom >= module2Top && currentBottom <= module2Bottom)
	       ||(module2Top >= currentScroll && module2Bottom <= currentBottom);
};

Module.prototype.outOfView = function(currentScroll) {
	return this.$module.offset().top > currentScroll + $(window).height() 
		|| this.$module.offset().top + this.$module.height() < currentScroll;
};

Module.prototype.onScroll = function(scrollOffset) {
	var inView = this.inBound(animation.currentScroll);
	this.$module.addClass(inView ? 'in' : 'out');
	this.$module.removeClass(inView ? 'out' : 'in');
};

Module.prototype.resize = function() {
};

Module.prototype.animate = function() {
	this.animateID = requestAnimationFrame(this.animate());
};

Module.prototype.stopAnimation = function(){
	cancelAnimationFrame(this.animateID);
}

Module.prototype.loadJqueryCache = function(){
}


// ~~~~~~~~~~~~~~~~~~~~ Module Subclasses ~~~~~~~~~~~~~~~~~~~~

function Circle($module){
	Module.call(this, $module);
	this.degree = 0;
	this.clockwise = true;
	this.isLooping = true;
	this.spinSpeed = .5;
	this.jitterScaler = .75;
	this.$module.find('.outer.circle').css('background-color', this.color);
}

Circle.prototype = Object.create(Module.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.loadJqueryCache = function(){
	this.jqueryCache['inner-circle'] = this.$module.find('.inner.circle');
	this.jqueryCache['title'] = this.$module.find('.title');
	this.jqueryCache['content'] = this.$module.find('.content');
	this.animate();
}

Circle.prototype.spin = function(delta) {
	this.degree = (this.clockwise) ? this.degree + delta : this.degree - delta; 
	this.jqueryCache['inner-circle'].css("transform", "rotateZ(" + this.degree + "deg)"); 
};

Circle.prototype.jitter = function() {
	var jitter = (Math.random() - Math.random()) * this.jitterScaler; 
	this.jqueryCache['title'].css("transform", "translateX(-50%) translateY("+ (-50 + jitter) +"%)");
};

Circle.prototype.resize = function() {
	this.$module.find('.circle .title').css('font-size', Math.round(.12*this.$module.find('.outer.circle-container').height()));
	this.$module.find('.circle .content').css('font-size', Math.round(.06*this.$module.find('.outer.circle-container').height()));
};

Circle.prototype.animate = function(){
	if(this.inBound(animation.currentScroll)){
		this.spin(this.spinSpeed)
		this.jitter();
	}
	this.animateID = requestAnimationFrame(this.animate.bind(this));
}

Circle.prototype.onScroll = function(scrollOffset) {
	this.spinSpeed = (scrollOffset) ? -1*Math.sign(scrollOffset) * Math.abs(this.spinSpeed) : this.spinSpeed;
	this.spin(this.spinSpeed*Math.abs(scrollOffset));
};

function InfoBox($module){
	Module.call(this, $module);
}

InfoBox.prototype = Object.create(Module.prototype);
InfoBox.prototype.constructor = InfoBox;

InfoBox.prototype.resize = function(){
	this.$module.find('.title').css('font-size', Math.round(.06*this.$module.find('.info-container').width()).clamp(20, 40));
	this.$module.find('.content p').css('font-size', Math.round(.035*this.$module.find('.info-container').width()).clamp(20, 30));
	this.$module.find('.text-overlay').css('font-size', Math.round(.06*this.$module.find('.info-container').width()).clamp(20, 40));
}

InfoBox.prototype.inBound = function(currentScroll) {
	var currentBottom = currentScroll + $(window).height();
	var module2Top = this.$module.offset().top + (window.innerHeight/4); 
	var module2Bottom = module2Top + this.$module.height();
	return (currentScroll >= module2Top && currentScroll <= module2Bottom)
	       ||(currentBottom >= module2Top && currentBottom <= module2Bottom)
	       ||(module2Top >= currentScroll && module2Bottom <= currentBottom);
};

// ~~~~~~~~~~~~~~~~~~~~ Init + Helpers ~~~~~~~~~~~~~~~~~~~~

function processHash(){
	var hash = window.location.hash.slice(1)
	if(hash && $('[name='+hash+']').length){
		scrollToElmMiddle($('[name='+hash+']'))
	}
}

function loadModules(){
	var $modules = $('.module');
	var modulePromises = []
	$modules.each(function(i){
		var module;
		switch($(this).data().type){
			case 'circle':
				module = new Circle($(this)); 
				break;
			case 'info-box':
				module = new InfoBox($(this)); 
				break;
			default: 
				module = new Module($(this)); 
		}	
		dictionary.modules.push(module);
		modulePromises.push(module.loadModule());
		module.resize();
	});

	Promise.all(modulePromises).then(function(modules){
		for(var i in modules){
			modules[i].drawModule();
		}
	})
}

function init(){
	animation.currentScroll = $(window).scrollTop(); 
	animation.prevScroll = $(window).scrollTop(); 
	
	loadModules();

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

	setTimeout(processHash, 500);
	window.onhashchange = processHash;
}

$(init);
