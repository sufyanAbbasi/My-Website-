//scrolls to the window's top
function scrollToTop(){
  $('html,body').animate({scrollTop: 0});
}

//scrolls to the window's bottom
function scrollToBottom(){
  $('html,body').animate({scrollTop: $(document).height()});
}

//scrolls to a jQuery element's top
function scrollToElmTop(elm){
  $elm = $(elm);
  var elOffset = $elm.offset().top;
  $('html,body').animate({scrollTop: elOffset});
  return false;
}

//scrolls to a jQuery element's middle
function scrollToElmMiddle(elm){
  $elm = $(elm);
  var elOffset = $elm.offset().top;
  var elHeight = $elm.height();
  var windowHeight = $(window).height();
  var offset;

  if (elHeight < windowHeight) {
  	offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  }
  else {
  	offset = elOffset;
  }
  $('html,body').animate({scrollTop: offset});
  return false;
}

//scrolls to a jQuery element's bottom
function scrollToElmBottom(elm){
  $elm = $(elm);
  $('html,body').animate({scrollTop: $elm.height() - $(window).height()});
}