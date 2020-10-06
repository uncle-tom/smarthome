$( document ).ready(function() {
  $('.smartslider').each(function(){
  	dataSmartSlider = $(this).data('smartslider');
	  initSmartslider(dataSmartSlider);
	});  
});

function initSmartslider(dataSmartSlider) {
	//Считаем отступ слева
	if ($(window).outerWidth() > 767) {
		var koefLeft = 0.333333333;
		var leftSmartsliderPhoto = $( window ).outerWidth() * koefLeft;
		var leftSmartsliderPhotoNext = leftSmartsliderPhoto;
	} else {
		var leftSmartsliderPhoto = $( window ).outerWidth();
		var leftSmartsliderPhotoNext = 0;
	}
	
	$('.smartslider[data-smartslider="'+dataSmartSlider+'"] .smartslider-photo').each(function(){
		$(this).css({
			'left': leftSmartsliderPhotoNext,
		})
		leftSmartsliderPhotoNext = leftSmartsliderPhotoNext + leftSmartsliderPhoto;
	});
}

if ($(window).outerWidth() > 767) {
	var koefTransform = 33;
} else {
	var koefTransform = 100;
}


//Клик Вперед
$('.smartslider-next').on('click', function(){
	thisSmartSlider = $(this).data('smartslider-name');
	iteralSmartslider = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-iteral').val();

	if (iteralSmartslider < $('.smartslider[data-smartslider="'+thisSmartSlider+'"] .smartslider-slide').length) {
		
		iteralSmartslider++;
		$(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-iteral').val(iteralSmartslider);
		
		//Двигаем фото
		var currentSmartsliderPhotos = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos');

		currentSmartsliderPhotosTransform = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-transform').val();
		currentSmartsliderPhotosTransform = parseInt(currentSmartsliderPhotosTransform, 10);
		currentSmartsliderPhotosTransform = currentSmartsliderPhotosTransform + koefTransform;

		$(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-transform').val(currentSmartsliderPhotosTransform);
		
		currentSmartsliderPhotos.transition({
			transform: 'translateX(-'+currentSmartsliderPhotosTransform+'%)',
		});

		//Меняем класс на фото
		var currentSmartSliderPhoto = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos .active');
		var nextSmartSliderPhoto = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos .active').next();
		nextSmartSliderPhoto.addClass('active');
		currentSmartSliderPhoto.removeClass('active');

		//Меняем класс на слайде
		var currentSmartSliderSlide = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-slides .active');
		var nextSmartSliderSlide = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-slides .active').next();
		nextSmartSliderSlide.addClass('active');
		currentSmartSliderSlide.removeClass('active');

		//Меняем класс на пагинации
		var currentSmartSliderPagi = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-pagination .active');
		var prevSmartSliderPagi = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-pagination .active').next();
		prevSmartSliderPagi.addClass('active');
		currentSmartSliderPagi.removeClass('active');
	}
});

//Клик назад
$('.smartslider-prev').on('click', function(){
	thisSmartSlider = $(this).data('smartslider-name');
	iteralSmartslider = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-iteral').val();
	if (iteralSmartslider > 1) {
		
		iteralSmartslider--;
		$(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-iteral').val(iteralSmartslider);

		//Двигаем фото
		var currentSmartsliderPhotos = $(this).closest('.smartslider').find('.smartslider-photos');
		currentSmartsliderPhotosTransform = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-transform').val();
		currentSmartsliderPhotosTransform = parseInt(currentSmartsliderPhotosTransform, 10);
		currentSmartsliderPhotosTransform = currentSmartsliderPhotosTransform - koefTransform;
		$(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos-transform').val(currentSmartsliderPhotosTransform);

		currentSmartsliderPhotos.css({
			'transform': 'translateX(-'+currentSmartsliderPhotosTransform+'%)',
		});

		//Меняем класс на фото
		var currentSmartSliderPhoto = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos .active');
		var prevSmartSliderPhoto = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-photos .active').prev();
		prevSmartSliderPhoto.addClass('active');
		currentSmartSliderPhoto.removeClass('active');

		//Меняем класс на слайде
		var currentSmartSliderSlide = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-slides .active');
		var prevSmartSliderSlide = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-slides .active').prev();
		prevSmartSliderSlide.addClass('active');
		currentSmartSliderSlide.removeClass('active');

		//Меняем класс на пагинации
		var currentSmartSliderPagi = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-pagination .active');
		var prevSmartSliderPagi = $(this).closest('.smartslider[data-smartslider="'+thisSmartSlider+'"] ').find('.smartslider-pagination .active').prev();
		prevSmartSliderPagi.addClass('active');
		currentSmartSliderPagi.removeClass('active');
	}
});

var smartSliderBottom = $(window).height() * 0.22;
var smartSliderBottomMobile = $(window).height() * 0.266129032;

if ($(window).outerWidth() > 768) {
	$('.smartslider-bottom').css({'bottom':smartSliderBottom});
} else {
	$('.smartslider-bottom').css({'bottom':smartSliderBottomMobile});
}