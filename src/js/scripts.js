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

//Элемент виден при скролле
function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
      change.target.classList.add('show-smart');
    }
  });
}

let scrollOptions = {
  threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, scrollOptions);
let elements = document.querySelectorAll('.animate-smart');

for (let elm of elements) {
  observer.observe(elm);
}

//HEADER MENU TOGGLE
$('.header_mobile_toggle').on('click', function(){
	$(this).toggleClass('open');
	$('.header_mobile_menu').toggleClass('open');
});

//Modal Open
let bgModal = document.querySelector('.modal-bg');
let modalsClickId = document.querySelectorAll('.modal_click_js');

for (modalClickId of modalsClickId) {
  if (modalClickId) {
    modalClickId.addEventListener('click', function(){
      modalThisId = this.dataset.modalId;
      let modal = document.querySelector(".modal[data-modal-id='" + modalThisId + "'");
      modal.classList.add('open');
      bgModal.classList.add('open');
      console.log(modalClickId);
    });
  }
}

//Modal Close
let modalCloseBtns = document.querySelectorAll('.modal .modal_close');
let allModals = document.querySelectorAll('.modal');
document.addEventListener('click', function(e){
  if(e.target.classList.value === 'modal-bg open') {
    bgModal.classList.remove('open');
    for (allModal of allModals) {
      allModal.classList.remove('open');  
    }
  }
});

if (modalCloseBtns) {
  for (modalCloseBtn of modalCloseBtns) {
    modalCloseBtn.addEventListener('click', function(){
      bgModal.classList.remove('open');
      for (allModal of allModals) {
        allModal.classList.remove('open');  
      }
    });
  }
}


//Отступ для HEADER
if ($(window).outerWidth() > 998) {
	var headerPaddingTop = $( window ).height() * 0.0925925;
	$('.header').css({'padding-top': headerPaddingTop});	
}


let overviewBottomAll = document.querySelectorAll('.overview_bottom');

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
	if (firstSlideFour) {
		firstSlideFour.classList.add('active');	
	}

	let firstSlideSix = document.querySelector('.swipe[data-swipe="6"]');
	if (firstSlideSix) {
		firstSlideSix.classList.add('active');
	}
}
beforeStartSlide();

//Считаем размер картинки в слайде
let allSwipePhotosFour = document.querySelectorAll('.swipe-photos[data-swipe="4"] .swipe-photo');
let swipePhotoFour = document.querySelector('.swipe-photos[data-swipe="4"] .swipe-photo');
if (swipePhotoFour) {
	swipePhotoWidthFour = swipePhotoFour.offsetWidth;	
	swipePhotoLeftFour = swipePhotoWidthFour - (swipePhotoWidthFour/4) - 1;
	swipePhotoNewLeftFour = swipePhotoLeftFour;
}


for (allSwipePhotoFour of allSwipePhotosFour) {
	if (allSwipePhotoFour) {
		allSwipePhotoFour.style.left = swipePhotoNewLeftFour + 'px';
		swipePhotoNewLeftFour = swipePhotoNewLeftFour + swipePhotoLeftFour;
	}
}

//Считаем размер картинки в слайде
let allSwipePhotosSix = document.querySelectorAll('.swipe-photos[data-swipe="6"] .swipe-photo');
let swipePhotoSix = document.querySelector('.swipe-photos[data-swipe="6"] .swipe-photo');
if (swipePhotoSix) {
	swipePhotoWidthSix = swipePhotoSix.offsetWidth;
	swipePhotoLeftSix = swipePhotoWidthSix - (swipePhotoWidthSix/4) - 1;
	swipePhotoNewLeftSix = swipePhotoLeftSix;	
}

for (allSwipePhotoSix of allSwipePhotosSix) {
	if (allSwipePhotoSix) {
		allSwipePhotoSix.style.left = swipePhotoNewLeftSix + 'px';
		swipePhotoNewLeftSix = swipePhotoNewLeftSix + swipePhotoLeftSix;
	}
}




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

//Размеры и отступы в Конструкторе
let constrWrapper = document.querySelectorAll('.constr_wrapper');
let constrBlocks = document.querySelectorAll('.constr_block');
let constrMetaSticky = document.querySelector('.constr_meta_sticky');
let constrBoxes = document.querySelectorAll('.constr_box');
let constrBlocksHeight = window.innerHeight*0.644;
let constrBoxHeight = window.innerHeight/2.35;

for (constrBlock of constrBlocks) {
	if (constrBlock) {
		constrBlock.style.minHeight = constrBlocksHeight + 'px';
	}
}

for (constrBox of constrBoxes) {
	if (constrBox) {
		constrBox.style.height = constrBoxHeight + 'px';
	}
}

for (cW of constrWrapper) {
	if (cW) {
		cW.style.top = window.innerHeight/4.736 + 'px';
	}
}
if (constrMetaSticky) {
	constrMetaSticky.style.top = window.innerHeight/4.736 + 'px';
}

// //Анимация при скроле
// function onEntry(entry) {
//   entry.forEach(change => {
//     if (change.isIntersecting) {
//       change.target.classList.add('show-smart');

//       //Для Morning блока
//       morningTimeout = 2000;
//       function addClassFunc(classname) {
//       	classname.classList.add('show');
//       	classname.style.opacity = 1;
//       }
//       for (morningNoticeItem of morningNoticeItems) {
//     		if (morningNoticeItem) {
//     			morningTimeout = morningTimeout + 2000;
//     			(function(morningNoticeItem){
// 		        setTimeout(function(){
// 		          addClassFunc(morningNoticeItem);
// 		        }, morningTimeout);
// 			    })(morningNoticeItem);
//     		}
//     	}
//     }
//   });
// }

// let options = {
//   threshold: [0.1] };
// let observer = new IntersectionObserver(onEntry, options);
// let elements = document.querySelectorAll('.animate-smart');

// for (let elm of elements) {
//   observer.observe(elm);
// }


//Audio
//Audio BTNS
let prevSongBtn = document.querySelector('.player-prev-js');
let nextSongBtn = document.querySelector('.player-next-js');
let playSongBtn = document.querySelector('.player-play-pause-js');

let songsArray = [];
let audioNoticeAll = document.querySelectorAll('.overview_02_notice audio');
for (audioNotice of audioNoticeAll) {
	songsArray.push(audioNotice.src);
}

currentSongIndex = 0;

function prevSong() {
	if (currentSongIndex === 0) {
		currentSongIndex = document.querySelectorAll('.overview_02_notice audio').length - 1;
		stopOldSong();
		playSong();
	} else {
		currentSongIndex = currentSongIndex - 1;
		stopOldSong();
		playSong();
	}
}

function nextSong() {
	if (currentSongIndex === document.querySelectorAll('.overview_02_notice audio').length - 1) {
		currentSongIndex = 0;
		stopOldSong();
		playSong();
	} else {
		currentSongIndex = currentSongIndex + 1;	
		stopOldSong();
		playSong();
	}
}

function playSong() {
	console.log(currentSongIndex);
	currentSong = document.querySelectorAll('.overview_02_notice audio')[currentSongIndex];
	if (currentSong.paused) {
	  currentSong.play();
	}
	else {
	  currentSong.pause();
	}
}

function stopOldSong() {
	let allOldSong = document.querySelectorAll('.overview_02_notice audio');
	for (oldSong of allOldSong) {
		if (oldSong) {
			oldSong.pause();	
		}
	}
}

//Play-Pause
if (playSongBtn) {
	playSongBtn.addEventListener('click', function(){
		playSong();
	});
}

//Prev Song
if (prevSongBtn) {
	prevSongBtn.addEventListener('click', function(){
		prevSong();
	});
}

//Next Song
if (nextSongBtn) {
	nextSongBtn.addEventListener('click', function(){
		nextSong();
	});
}

//Added Box
$('.constr-add-js').each(function() {
  var $this = $(this);
  $this.on('click', function () {
  	var addBtnDataId = $(this).data('box-id');

  	//Уменьшаем размер тайтла
		$('.constr_title').addClass('added');

		//Делаем видимым элемент в "корзине"
		$('.constr_selected_item[data-box-id='+addBtnDataId+']').addClass('added');

		//Меняем кнопку -- add to qty
    $('.constr-add-js[data-box-id='+addBtnDataId+']').addClass('added');
  });
});

//Click Constr Count Minus
$('.constr_count_minus').click(function () {
	var currentCountId = $(this).closest('.constr-add-count').data('box-id');
	var currentCountInput = $('.constr-add-count[data-box-id='+currentCountId+'] .constr_count_input');
	var currentCountNumber = parseInt(currentCountInput.val()) - 1;
	currentCountNumber = currentCountNumber < 1 ? 1 : currentCountNumber;
	currentCountInput.val(currentCountNumber);
	currentCountInput.change();
	return false;
});

//Click Constr Count Plus
$('.constr_count_plus').click(function () {
	var currentCountId = $(this).closest('.constr-add-count').data('box-id');
	var currentCountInput = $('.constr-add-count[data-box-id='+currentCountId+'] .constr_count_input');
	var currentCountNumber = parseInt(currentCountInput.val()) + 1;
	currentCountNumber = currentCountNumber < 1 ? 1 : currentCountNumber;
	currentCountInput.val(currentCountNumber);
	currentCountInput.change();
	return false;
});


//Constr Slider Next
$('.constr_next_slide_js').on('click', function(){
	var currentConstrSlideId = $(this).closest('.constructor-slide').data('constr-slide');
	$('.constructor-slide[data-constr-slide='+currentConstrSlideId+']').removeClass('active');
	
	ConstrSlideNumber = currentConstrSlideId + 1;
	$('.constructor-slide[data-constr-slide='+ConstrSlideNumber+']').addClass('active');
});

//Constr Slider Back
$('.constr_back_slide_js').on('click', function(){
	var currentConstrSlideId = $(this).closest('.constructor-slide').data('constr-slide');
	$('.constructor-slide[data-constr-slide='+currentConstrSlideId+']').removeClass('active');
	
	ConstrSlideNumber = currentConstrSlideId - 1;
	$('.constructor-slide[data-constr-slide='+ConstrSlideNumber+']').addClass('active');
})