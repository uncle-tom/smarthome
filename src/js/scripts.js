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

function scrollToTop() {
	$('body,html').animate({
    scrollTop: 0
  }, 400);
}

//HEADER MENU TOGGLE
$('.header_mobile_toggle').on('click', function(){
	$(this).toggleClass('open');
	$('.header_mobile_menu').toggleClass('open');
});

//Modal Width
// if ($(window).outerWidth() > 998) {
// 	var modalWidth = $( window ).outerWidth() * 0.379166667;
// 	$('.modal').css({'width':modalWidth});
// }

//Modal Open
let bgModal = document.querySelectorAll('.modal-bg');
let modalsClickId = document.querySelectorAll('.modal_click_js');
let modalsPreviewClickId = document.querySelectorAll('.constr_preview');

for (modalClickId of modalsClickId) {
  if (modalClickId) {
    modalClickId.addEventListener('click', function(){
      modalThisId = this.dataset.modalId;
      let modal = document.querySelector(".modal[data-modal-id='" + modalThisId + "'");
      modal.classList.add('open');
      $('.modal-bg').addClass('open');
    });
  }
}

//Открываем модальное окно Preview
for (modalPreviewClickId of modalsPreviewClickId) {
	if (modalPreviewClickId) {
	  modalPreviewClickId.addEventListener('click', function(){
	    modalThisId = this.dataset.modalId;
	    let modal = document.querySelector(".modal_preview[data-modal-id='" + modalThisId + "'");
	    modal.classList.add('open');
	    $('.modal-bg_preview').addClass('open');
	  });
	}
}
//Закрываем модальное окно Preview
$('.modal_preview_close').on('click', function(){
	$('.modal-bg_preview').removeClass('open');
	$('.modal_preview').removeClass('open');
});

//Modal Close
let modalCloseBtns = document.querySelectorAll('.modal .modal_close');
let allModals = document.querySelectorAll('.modal');
document.addEventListener('click', function(e){
  if(e.target.classList.value === 'modal-bg open') {
  	for (bM of bgModal) {
  		bM.classList.remove('open');	
  	}
    for (allModal of allModals) {
      allModal.classList.remove('open');  
    }
  }
});

if (modalCloseBtns) {
  for (modalCloseBtn of modalCloseBtns) {
    modalCloseBtn.addEventListener('click', function(){
    	for (bM of bgModal) {
    		bM.classList.remove('open');	
    	}
      for (allModal of allModals) {
        allModal.classList.remove('open');  
      }
    });
  }
}

//SEND FORM
let contactSuccess = document.querySelector('.send_success');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxCEvyzzib-ySwcQ1MDNvR-R24vU4WsgJIsvtuhSnTXNOxMr5PC/exec'
const contact_form = document.forms['contact']
if (contact_form) {
	contact_form.addEventListener('submit', e => {
	  e.preventDefault()
	  let this_form = contact_form
	  let data = new FormData(contact_form)
	  fetch(scriptURL, { method: 'POST', mode: 'cors', body: data})
	    .then(response => showSuccessMessage(data, this_form))
	    .catch(error => console.error('Error!', error.message))
	})	
}

function showSuccessMessage(data, this_form){
	this_form.reset();
	contactSuccess.classList.add('show');
}

$('.send_success_close').on('click', function(){
	$('.send_success').removeClass('show');
});

//Отступ для HEADER
// if ($(window).outerWidth() > 768) {
// 	var headerPaddingTop = $( window ).height() * 0.0925925;
// 	$('.header').css({'padding-top': headerPaddingTop});	
// }


//Размеры и отступы в Конструкторе
let constrWrapper = document.querySelectorAll('.constr_wrapper');
let constrBlocks = document.querySelectorAll('.constr_block');
let constrMetaSticky = document.querySelector('.constr_meta_sticky');
let constrBoxes = document.querySelectorAll('.constr_box');
let constrBlocksHeight = window.innerHeight*0.644;
let constrBoxHeight = window.innerHeight*0.4;


if ($(window).outerWidth() > 768) {
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
}

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

  	//Делаем видимым область
  	$('.constr_selected').addClass('show');

  	//Уменьшаем размер тайтла
  	if ($(window).outerWidth() > 768) {
			$('.constr_title.advanced').addClass('added');
		}

		//Делаем видимым элемент в "корзине"
		$('.constr_selected_title').addClass('show');
		$('.constr_selected_item[data-box-id='+addBtnDataId+']').addClass('added');

		//Меняем кнопку -- add to qty
    $('.constr-add-js[data-box-id='+addBtnDataId+']').addClass('added');
  });
});

$('.constr_selected_title').on('click', function(){
	$('.constr_selected_grid').toggleClass('hidden');
	$('.constr_selected_title img').toggleClass('up');
});

if ($(window).outerWidth() > 768) {
	let previewPhotoWidth = $(window).outerWidth() * 0.723958333;
	$('.modal_preview_photo').css({'width': previewPhotoWidth});
}

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

	//Поднимаемся вверх
	scrollToTop();
});

//Constr Slider Back
$('.constr_back_slide_js').on('click', function(){
	var currentConstrSlideId = $(this).closest('.constructor-slide').data('constr-slide');
	$('.constructor-slide[data-constr-slide='+currentConstrSlideId+']').removeClass('active');
	
	ConstrSlideNumber = currentConstrSlideId - 1;
	$('.constructor-slide[data-constr-slide='+ConstrSlideNumber+']').addClass('active');

	//Поднимаемся вверх
	scrollToTop();
})

//MASONRY
var portfolioWrap = document.querySelector('.portfolio_wrap');
if ($('.portfolio_wrap').length > 0) {
	var portfolioMasonry = new Masonry( portfolioWrap, {
	  itemSelector: '.portfolio-masonry',
	  columnWidth: '.portfolio-masonry-size',
	  percentPosition: true,
	  gutter: 20,
	  horizontalOrder: true,
	})
}

var productsWrap = document.querySelector('.products_wrap');
if ($('.products_wrap').length > 0) {
	var productsMasonry = new Masonry( productsWrap, {
	  itemSelector: '.products-masonry',
	  columnWidth: '.products-masonry-size',
	  percentPosition: true,
	  gutter: 20,
	  horizontalOrder: true
	})
}

$( document ).ready(function() {
	if ($('.portfolio_wrap').length > 0) {
		portfolioMasonry();
	}
	if ($('.products_wrap').length > 0) {
		productsMasonry();
	}
});

//SWIPER

//Portfolio :: SWIPER
if ($('.swiper-portfolio').length > 0) {
	var swiper = new Swiper('.swiper-portfolio', {
		slidesPerView: 'auto',
		loop: true,
	  navigation: {
	    nextEl: '.swiper-portfolio-button-next',
	    prevEl: '.swiper-portfolio-button-prev',
	  },
	});
}