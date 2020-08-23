var overviewScreenHeight = $( window ).height();
var overviewScreenWidth = $( window ).outerWidth();
$('.overview_screen').css("background-size", overviewScreenWidth+"px " + overviewScreenHeight + "px");

var overviewContentWidth = $(window).outerWidth() * 0.377604167;
$('.overview_content').css({'width':overviewContentWidth});