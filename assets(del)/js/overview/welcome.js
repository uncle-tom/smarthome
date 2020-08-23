//Размеры и отступы на первом экране
let welcomeLightToggle = document.querySelector('.light-toggle-js');
let welcomeLightTop = document.querySelector('.overview_01_light_top');
let welcomeLightSide = document.querySelector('.overview_01_light_side');
let welcomeShapeOne = document.querySelector('.overview_01_shape_01');
let welcomeShapeTwo = document.querySelector('.overview_01_shape_02');
let welcomeShapeThree = document.querySelector('.overview_01_shape_03');

var overviewWelcomeHeight = $( window ).height();
var overviewWelcomeWidth = $( window ).outerWidth();
$('.overview_welcome').css("background-size", overviewWelcomeWidth+"px " + overviewWelcomeHeight + "px");

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

if (welcomeLightTop) {
	welcomeLightTop.style.height = window.innerHeight/1.24 + 'px';	
}

if (welcomeShapeOne) {
	welcomeShapeOne.style.top = (window.innerHeight/5.2) - 34 + 'px';
	welcomeShapeOne.style.right = (window.screen.width/3.75) - 34 + 'px';	
}

if (welcomeShapeTwo) {
	welcomeShapeTwo.style.top = (window.innerHeight/3.3) - 25 + 'px';
	welcomeShapeTwo.style.right = (window.screen.width/4.1) - 25 + 'px';	
}

if (welcomeShapeThree) {
	welcomeShapeThree.style.top = (window.innerHeight/3.8) - 34 + 'px';
	welcomeShapeThree.style.right = (window.screen.width/4.5) - 34 + 'px';	
}


//Включаем свет на первом экране
if (welcomeLightToggle) {
	welcomeLightToggle.addEventListener('click', function(){
		welcomeLightToggle.classList.toggle('on');
		welcomeLightTop.classList.toggle('show');
		welcomeLightSide.classList.toggle('show');
	})
}