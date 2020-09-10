//Функции анимации GSAP

//Меняем фон у Overview Morning
function overviewMorningBgChange() {
	TweenMax.to('.overview[data-slide-id="2"] .animate-bg', 4, {
		backgroundImage:"linear-gradient(90deg, rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.0) 100%)"
	}).delay(1);
	TweenMax.to('.overview[data-slide-id="2"] .animate-bg', 0.1, {
		zIndex:"-1"
	}).delay(5);
}

function overviewMorningNoticeShow(morningNoticeTransform) {
	TweenMax.to('.overview_morning_notices_wrapper', 1, {
		transform:"translateY("+ morningNoticeTransform +"%)"
	}).delay(0.25);
}


//Элемент виден при скролле
let scrollOptions = { threshold: [0.1] };

function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
      change.target.classList.add('show-smart');
    }
  });
};

function overviewMorningShow(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
      overviewMorningBgChange();
      var x = 0;
      let morningNoticeTransform = 100;
			var intervalID = setInterval(function () {
				
				morningNoticeTransform = morningNoticeTransform - 25;
				overviewMorningNoticeShow(morningNoticeTransform);
			  if (++x === 4) {
					window.clearInterval(intervalID);
			  }
			}, 3000);
      overviewMorningNoticeShow();
    }
  });
};

let elements = document.querySelectorAll('.animate-smart');
let overviewMorningClass = document.querySelector('.overview_morning');

let observer = new IntersectionObserver(onEntry, scrollOptions);
let observerMorningShow = new IntersectionObserver(overviewMorningShow, scrollOptions);

for (let elm of elements) {
  observer.observe(elm);
}

if(overviewMorningClass) {
	observerMorningShow.observe(overviewMorningClass);	
}
