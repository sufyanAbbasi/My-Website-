function init() {

	var circleWidth = $('#circle-container').height(); 

	$('.circle').css('width', circleWidth); 

	$(window).on('resize', function(){

		circleWidth = $('#circle-container').height(); 
		$('.circle').css('width', circleWidth); 

	})
}