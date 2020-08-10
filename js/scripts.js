setTimeout(function(){
	//Preloader
	let preloader = document.querySelector('.preloader');
	preloader.classList.add('hide');
}, 3500);

$.scrollify({
  section : ".smart-slide",
  easing: "easeOutExpo",
  updateHash: false,
  passive: false,
});

let windowPadding = (window.screen.width - 1280)/2;
let headerClass = document.querySelector('header');
let overviewBottomAll = document.querySelectorAll('.overview_bottom');

for (overviewBottom of overviewBottomAll) {
	if (overviewBottom) {
		overviewBottom.style.bottom = windowPadding/1.5 + 'px';
	}
}
headerClass.style.paddingTop = windowPadding/1.5 + 'px';



//OVERVIEW SLIDER (Four)
let prevBtnFour = document.querySelector('.overview_prev[data-swipe="4"]');
let nextBtnFour = document.querySelector('.overview_next[data-swipe="4"]');
let currentSlideFour = 1;
let translatePhotoFour = 0;

let prevBtnSix = document.querySelector('.overview_prev[data-swipe="6"]');
let nextBtnSix = document.querySelector('.overview_next[data-swipe="6"]');
let currentSlideSix = 1;
let translatePhotoSix = 0;

let allSlidesFour = document.querySelectorAll('.swipe[data-swipe="4"]');
let pagiFour = document.querySelector('.overview_pagination[data-pagi="4"]');
for (allSlideFour of allSlidesFour) {
	if (allSlideFour) {
		slidePagi = document.createElement('div');
		slidePagi.classList.add('pagi');
		pagiFour.after(slidePagi);
	}
}

let allSlidesSix = document.querySelectorAll('.swipe[data-swipe="6"]');
let pagiSix = document.querySelector('.overview_pagination[data-pagi="6"]');
for (allSlideSix of allSlidesSix) {
	if (allSlideSix) {
		slidePagi = document.createElement('div');
		slidePagi.classList.add('pagi');
		pagiSix.after(slidePagi);
	}
}

if (nextBtnFour) {
	nextBtnFour.addEventListener('click', function(){
		//REMOVE ALL ACTIVE
		n = 4;
		let allSlides = document.querySelectorAll('.swipe[data-swipe="'+n+'"]');
		for (allSlide of allSlides) {
			if (allSlide) {
				allSlide.classList.remove('active');
			}
		}
		let allSlidePhotos = document.querySelectorAll('.swipe-photos[data-swipe="'+n+'"] .swipe-photo');
		for (allSlidePhoto of allSlidePhotos) {
			if (allSlidePhoto) {
				allSlidePhoto.classList.remove('active');
			}
		}

		currentSlideFour = currentSlideFour + 1;
		let activeSlide = document.querySelector('.swipe[data-swipe-id="'+n+'-0'+currentSlideFour+'"]');
		let activeSlidePhoto = document.querySelector('.swipe-photo[data-swipe-id="'+n+'-0'+currentSlideFour+'"]');

		let swipePhotos = document.querySelector('.swipe-photos[data-swipe="'+n+'"]')
		translatePhotoFour = translatePhotoFour + 33;
		if (swipePhotos) {
			swipePhotos.style.transform = 'translateX(-' + translatePhotoFour + '%)';
		}

		activeSlide.classList.add('active');
		activeSlidePhoto.classList.add('active');
		
	}); 
}

if (prevBtnFour) {
	prevBtnFour.addEventListener('click', function(){
		//REMOVE ALL ACTIVE
		n = 4;
		let allSlides = document.querySelectorAll('.swipe[data-swipe="'+n+'"]');
		for (allSlide of allSlides) {
			if (allSlide) {
				allSlide.classList.remove('active');
			}
		}
		let allSlidePhotos = document.querySelectorAll('.swipe-photos[data-swipe="'+n+'"] .swipe-photo');
		for (allSlidePhoto of allSlidePhotos) {
			if (allSlidePhoto) {
				allSlidePhoto.classList.remove('active');
			}
		}
		
		currentSlideFour = currentSlideFour - 1;
		let activeSlide = document.querySelector('.swipe[data-swipe-id="'+n+'-0'+currentSlideFour+'"]');
		let activeSlidePhoto = document.querySelector('.swipe-photo[data-swipe-id="'+n+'-0'+currentSlideFour+'"]');
		
		let swipePhotos = document.querySelector('.swipe-photos[data-swipe="'+n+'"]')
		translatePhotoFour = translatePhotoFour - 33;
		if (swipePhotos) {
			swipePhotos.style.transform = 'translateX(-' + translatePhotoFour + '%)';
		}

		activeSlide.classList.add('active');
		activeSlidePhoto.classList.add('active');
	});
}

if (nextBtnSix) {
	nextBtnSix.addEventListener('click', function(){
		//REMOVE ALL ACTIVE
		n = 6;
		let allSlides = document.querySelectorAll('.swipe[data-swipe="'+n+'"]');
		for (allSlide of allSlides) {
			if (allSlide) {
				allSlide.classList.remove('active');
			}
		}
		let allSlidePhotos = document.querySelectorAll('.swipe-photos[data-swipe="'+n+'"] .swipe-photo');
		for (allSlidePhoto of allSlidePhotos) {
			if (allSlidePhoto) {
				allSlidePhoto.classList.remove('active');
			}
		}

		//NEXT SLIDE
		currentSlideSix = currentSlideSix + 1;
		let activeSlide = document.querySelector('.swipe[data-swipe-id="'+n+'-0'+currentSlideSix+'"]');
		let activeSlidePhoto = document.querySelector('.swipe-photo[data-swipe-id="'+n+'-0'+currentSlideSix+'"]');

		let swipePhotos = document.querySelector('.swipe-photos[data-swipe="'+n+'"]')
		translatePhotoSix = translatePhotoSix + 33;
		if (swipePhotos) {
			swipePhotos.style.transform = 'translateX(-' + translatePhotoSix + '%)';
		}

		activeSlide.classList.add('active');
		activeSlidePhoto.classList.add('active');
	}); 
}

if (prevBtnSix) {
	prevBtnSix.addEventListener('click', function(){
		//REMOVE ALL ACTIVE
		n = 6;
		let allSlides = document.querySelectorAll('.swipe[data-swipe="'+n+'"]');
		for (allSlide of allSlides) {
			if (allSlide) {
				allSlide.classList.remove('active');
			}
		}
		let allSlidePhotos = document.querySelectorAll('.swipe-photos[data-swipe="'+n+'"] .swipe-photo');
		for (allSlidePhoto of allSlidePhotos) {
			if (allSlidePhoto) {
				allSlidePhoto.classList.remove('active');
			}
		}

		currentSlideSix = currentSlideSix - 1;
		let activeSlide = document.querySelector('.swipe[data-swipe-id="'+n+'-0'+currentSlideSix+'"]');
		let activeSlidePhoto = document.querySelector('.swipe-photo[data-swipe-id="'+n+'-0'+currentSlideSix+'"]');
		
		let swipePhotos = document.querySelector('.swipe-photos[data-swipe="'+n+'"]')
		translatePhotoSix = translatePhotoSix - 33;
		if (swipePhotos) {
			swipePhotos.style.transform = 'translateX(-' + translatePhotoSix + '%)';
		}

		activeSlide.classList.add('active');
		activeSlidePhoto.classList.add('active');
	});
}


function beforeStartSlide() {
	let firstSlideFour = document.querySelector('.swipe[data-swipe="4"]');
	firstSlideFour.classList.add('active');

	let firstSlideSix = document.querySelector('.swipe[data-swipe="6"]');
	firstSlideSix.classList.add('active');
}
beforeStartSlide();

//Считаем размер картинки в слайде
let allSwipePhotosFour = document.querySelectorAll('.swipe-photos[data-swipe="4"] .swipe-photo');
let swipePhotoWidthFour = document.querySelector('.swipe-photos[data-swipe="4"] .swipe-photo').offsetWidth;
let swipePhotoLeftFour = swipePhotoWidthFour - (swipePhotoWidthFour/4) - 1;
let swipePhotoNewLeftFour = swipePhotoLeftFour;
for (allSwipePhotoFour of allSwipePhotosFour) {
	if (allSwipePhotoFour) {
		allSwipePhotoFour.style.left = swipePhotoNewLeftFour + 'px';
		swipePhotoNewLeftFour = swipePhotoNewLeftFour + swipePhotoLeftFour;
	}
}

//Считаем размер картинки в слайде
let allSwipePhotosSix = document.querySelectorAll('.swipe-photos[data-swipe="6"] .swipe-photo');
let swipePhotoWidthSix = document.querySelector('.swipe-photos[data-swipe="6"] .swipe-photo').offsetWidth;
let swipePhotoLeftSix = swipePhotoWidthSix - (swipePhotoWidthSix/4) - 1;
let swipePhotoNewLeftSix = swipePhotoLeftSix;
for (allSwipePhotoSix of allSwipePhotosSix) {
	if (allSwipePhotoSix) {
		allSwipePhotoSix.style.left = swipePhotoNewLeftSix + 'px';
		swipePhotoNewLeftSix = swipePhotoNewLeftSix + swipePhotoLeftSix;
	}
}


//Размеры и отступы на первом экране
let welcomeLightToggle = document.querySelector('.light-toggle-js');
let welcomeLightTop = document.querySelector('.overview_01_light_top');
let welcomeLightSide = document.querySelector('.overview_01_light_side');
console.log(window.innerHeight);
welcomeLightTop.style.height = window.innerHeight/1.24 + 'px';

//Включаем свет на первом экране
welcomeLightToggle.addEventListener('click', function(){
	welcomeLightToggle.classList.toggle('on');
	welcomeLightTop.classList.toggle('show');
	welcomeLightSide.classList.toggle('show');
});

//Размеры и отступы на втором экране (Morning)
let morningNotice = document.querySelector('.overview_02_notice');
let morningNoticeItems = document.querySelectorAll('.overview_02_notice_item');

if (morningNotice) {
	morningNotice.style.bottom = 100 + windowPadding/1.5 + 'px';
}
for (morningNoticeItem of morningNoticeItems) {
	if (morningNoticeItem) {
		morningNoticeItem.style.height = window.innerHeight/11.73 + 'px';	
	}
}

//Анимация при скроле
function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
      change.target.classList.add('show-smart');

      //Для Morning блока
      morningTimeout = 2000;
      function addClassFunc(classname) {
      	classname.classList.add('show');
      	classname.style.opacity = 1;
      }
      for (morningNoticeItem of morningNoticeItems) {
    		if (morningNoticeItem) {
    			morningTimeout = morningTimeout + 2000;
    			(function(morningNoticeItem){
		        setTimeout(function(){
		          addClassFunc(morningNoticeItem);
		        }, morningTimeout);
			    })(morningNoticeItem);
    		}
    	}
    }
  });
}

let options = {
  threshold: [0.1] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.animate-smart');

for (let elm of elements) {
  observer.observe(elm);
}