var bottomLeakNotice = $(window).height() * 0.1611111;
var rightLeakNotice = $(window).outerWidth() * 0.078125;
var widthLeakNotice = $(window).outerWidth() * 0.179166667;

if ($(window).outerWidth() > 768) {
	$('.overview_leak_notices').css({'bottom':bottomLeakNotice});
	$('.overview_leak_notices').css({'right':rightLeakNotice});	
	$('.overview_leak_notices').css({'min-width':widthLeakNotice});
}