//Размеры и отступы на первом экране
var heightConditLine = $( window ).height() * 0.3842;
$('.overview_welcome_condit_line').css({'height':heightConditLine});
var heightMusicLine = $( window ).height() * 0.3842;
$('.overview_welcome_music_line').css({'height':heightMusicLine});
var widthLampLine = $( window ).outerWidth() * 0.0335;
$('.overview_welcome_lamp_line').css({'width':widthLampLine});
var leftLampCircle = widthLampLine + 8;
$('.overview_welcome_lamp_circle').css({'left':-leftLampCircle});
var widthTorchereLine = $( window ).outerWidth() * 0.0341145;
$('.overview_welcome_torchere_line').css({'width':widthTorchereLine});
var rightTorchere = $( window ).outerWidth() * 0.1473958;
$('.overview_welcome_torchere').css({'right':rightTorchere});
var rightTorchereCircle = widthTorchereLine + 4;
$('.overview_welcome_torchere_circle').css({'right':-rightTorchereCircle});

var overviewLightLampCircle = $( window ).outerWidth() * 0.1734375;
var overviewLightLampCircleLeft = $( window ).outerWidth() * 0.6671875;
var overviewLightLampCircleTop = $( window ).height() * 0.153703704;

$('.light-lamp-circle').css({
	'width': overviewLightLampCircle,
	'height': overviewLightLampCircle,
	'left': overviewLightLampCircleLeft,
	'top': overviewLightLampCircleTop
});

var overviewLightLampRayWidth = $( window ).outerWidth() * 0.388541667;
var overviewLightLampRayHeight = $( window ).height() * 0.641666667;
var overviewLightLampRayLeft = $( window ).outerWidth() * 0.561979167;
var overviewLightLampRayTop = $( window ).height() * 0.316666667;

if ($(window).outerWidth() > 998) {
	$('.light-lamp-ray').css({
		'width': overviewLightLampRayWidth,
		'height': overviewLightLampRayHeight,
		'left': overviewLightLampRayLeft,
		'top': overviewLightLampRayTop
	});
} else {
	$('.light-lamp-ray').css({
		'height': overviewLightLampRayHeight,
	});
}

var overviewTorcherePathUpWidth = $( window ).outerWidth() * 0.105729167;
var overviewTorcherePathUpHeight = $( window ).height() * 0.00740740741;
var overviewTorcherePathUpLeft = $( window ).outerWidth() * 0.8765625;
var overviewTorcherePathUpTop = $( window ).height() * 0.422222222;

$('.torchere-path-up').css({
	"background-size": overviewTorcherePathUpWidth+"px " + overviewTorcherePathUpHeight + "px",
	"width": overviewTorcherePathUpWidth,
	"height": overviewTorcherePathUpHeight,
	"left": overviewTorcherePathUpLeft,
	"top": overviewTorcherePathUpTop
});

var overviewTorcherePathDownWidth = $( window ).outerWidth() * 0.0953125;
var overviewTorcherePathDownHeight = $( window ).height() * 0.00277777778;
var overviewTorcherePathDownLeft = $( window ).outerWidth() * 0.877083333;
var overviewTorcherePathDownTop = $( window ).height() * 0.638888889;

$('.torchere-path-down').css({
	"background-size": overviewTorcherePathDownWidth+"px " + overviewTorcherePathDownHeight + "px",
	"width": overviewTorcherePathDownWidth,
	"height": overviewTorcherePathDownHeight,
	"left": overviewTorcherePathDownLeft,
	"top": overviewTorcherePathDownTop
});

//Включаем/выключаем свет на планшете
$('.light-toggle-js').on('click', function(){
	$(this).toggleClass('on');
	$(this).closest('.lighting-widget').find('.notice').toggleClass('on');
	$('.overview_welcome').toggleClass('on');
	$('.light-lamp-circle').toggleClass('on');
	$('.light-lamp-ray').toggleClass('on');
	$('.torchere-path-up').toggleClass('animate');
	$('.torchere-path-down').toggleClass('animate');
});

//Включаем/выключаем охрану на планшете
$('.security-toggle-js').on('click', function(){
	$(this).toggleClass('on');
	$(this).closest('.security-widget').find('.notice').toggleClass('on');
});