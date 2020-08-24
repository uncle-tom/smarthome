var bottomMorningNotices = $(window).height() * 0.1611111;
var rightMorningNotices = $(window).outerWidth() * 0.078125;

if ($(window).outerWidth() > 998) {
	$('.overview_morning_notices').css({'bottom':bottomMorningNotices});
	$('.overview_morning_notices').css({'right':rightMorningNotices});	
}