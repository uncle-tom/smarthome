if ($(window).outerWidth() > 998) {
	var overviewScreenHeight = $( window ).height();
	var overviewScreenWidth = $( window ).outerWidth();
	$('.overview_screen').css("background-size", overviewScreenWidth+"px " + overviewScreenHeight + "px");
	$('.light-on').css("background-size", overviewScreenWidth+"px " + overviewScreenHeight + "px");
}

if ($(window).outerWidth() > 998) {
	var overviewContentWidth = $(window).outerWidth() * 0.377604167;
	$('.overview_content').css({'width':overviewContentWidth});	
}

//Family section
if ($(window).outerWidth() < 768) {
	var overviewFamilyBottom = $( window ).height() * 0.15483871;
	$('.overview_family .overview_content').css({'padding-bottom':overviewFamilyBottom})
}