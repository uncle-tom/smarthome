/*!
 * jQuery Scrollify
 * Version 1.0.20
 *
 * Requires:
 * - jQuery 1.7 or higher
 *
 * https://github.com/lukehaas/Scrollify
 *
 * Copyright 2016, Luke Haas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
if touchScroll is false - update index
 */
(function (global,factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function($) {
      return factory($, global, global.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'), global, global.document);
  } else {
    // Browser globals
    factory(jQuery, global, global.document);
  }
}(typeof window !== 'undefined' ? window : this, function ($, window, document, undefined) {
  "use strict";
  var heights = [],
    names = [],
    elements = [],
    overflow = [],
    index = 0,
    currentIndex = 0,
    interstitialIndex = 1,
    hasLocation = false,
    timeoutId,
    timeoutId2,
    $window = $(window),
    portHeight,
    top = $window.scrollTop(),
    scrollable = false,
    locked = false,
    scrolled = false,
    manualScroll,
    swipeScroll,
    util,
    disabled = false,
    scrollSamples = [],
    scrollTime = new Date().getTime(),
    firstLoad = true,
    initialised = false,
    destination = 0,
    wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll',
    settings = {
      //section should be an identifier that is the same for each section
      section: ".section",
      sectionName: "section-name",
      interstitialSection: "",
      easing: "easeOutExpo",
      scrollSpeed: 1100,
      offset: 0,
      scrollbars: true,
      target:"html,body",
      standardScrollElements: false,
      setHeights: true,
      overflowScroll:true,
      updateHash: true,
      touchScroll:true,
      before:function() {},
      after:function() {},
      afterResize:function() {},
      afterRender:function() {}
    };
  function getportHeight() {
    return ($window.height() + settings.offset);
  }
  function animateScroll(index,instant,callbacks,toTop) {
    if(currentIndex===index) {
      callbacks = false;
    }
    if(disabled===true) {
      return true;
    }
    if(names[index]) {
      scrollable = false;
      if(firstLoad===true) {
        firstLoad = false;
        settings.afterRender();
      }
      if(callbacks) {
        if( typeof settings.before == 'function' && settings.before(index,elements) === false ){
          return true;
        }
      }
      interstitialIndex = 1;
      destination = (!index) ? 0 : heights[index];
      if(firstLoad===false && currentIndex>index && toTop===false) {
        //We're going backwards
        if(overflow[index]) {
          portHeight = getportHeight();

          interstitialIndex = parseInt(elements[index].outerHeight()/portHeight);

          destination = parseInt(heights[index])+(elements[index].outerHeight()-portHeight);
        }
      }


      if(settings.updateHash && settings.sectionName && !(firstLoad===true && index===0)) {
        if(history.pushState) {
            try {
              history.replaceState(null, null, names[index]);
            } catch (e) {
              if(window.console) {
                console.warn("Scrollify warning: Page must be hosted to manipulate the hash value.");
              }
            }

        } else {
          window.location.hash = names[index];
        }
      }

      currentIndex = index;
      if(instant) {
        $(settings.target).stop().scrollTop(destination);
        if(callbacks) {
          settings.after(index,elements);
        }
      } else {
        locked = true;
        if( $().velocity ) {
          $(settings.target).stop().velocity('scroll', {
            duration: settings.scrollSpeed,
            easing: settings.easing,
            offset: destination,
            mobileHA: false
          });
        } else {
          $(settings.target).stop().animate({
            scrollTop: destination
          }, settings.scrollSpeed,settings.easing);
        }

        if(window.location.hash.length && settings.sectionName && window.console) {
          try {
            if($(window.location.hash).length) {
              console.warn("Scrollify warning: ID matches hash value - this will cause the page to anchor.");
            }
          } catch (e) {}
        }
        $(settings.target).promise().done(function(){
          locked = false;
          firstLoad = false;
          if(callbacks) {
            settings.after(index,elements);
          }
        });
      }

    }
  }

  function isAccelerating(samples) {
    function average(num) {
      var sum = 0;

      var lastElements = samples.slice(Math.max(samples.length - num, 1));

      for(var i = 0; i < lastElements.length; i++){
          sum += lastElements[i];
      }

      return Math.ceil(sum/num);
    }

    var avEnd = average(10);
    var avMiddle = average(70);

    if(avEnd >= avMiddle) {
      return true;
    } else {
      return false;
    }
  }
  var scrollify = function(options) {
    initialised = true;
    $.easing['easeOutExpo'] = function(x, t, b, c, d) {
      return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };

    manualScroll = {
      handleMousedown:function() {
        if(disabled===true) {
          return true;
        }
        scrollable = false;
        scrolled = false;
      },
      handleMouseup:function() {
        if(disabled===true) {
          return true;
        }
        scrollable = true;
        if(scrolled) {
          //instant,callbacks
          manualScroll.calculateNearest(false,true);
        }
      },
      handleScroll:function() {
        if(disabled===true) {
          return true;
        }
        if(timeoutId){
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(function(){
          scrolled = true;
          if(scrollable===false) {
            return false;
          }
          scrollable = false;
          //instant,callbacks
          manualScroll.calculateNearest(false,true);
        }, 200);
      },
      calculateNearest:function(instant,callbacks) {
        top = $window.scrollTop();
        var i =1,
          max = heights.length,
          closest = 0,
          prev = Math.abs(heights[0] - top),
          diff;
        for(;i<max;i++) {
          diff = Math.abs(heights[i] - top);

          if(diff < prev) {
            prev = diff;
            closest = i;
          }
        }
        if((atBottom() && closest>index) || atTop()) {
          index = closest;
          //index, instant, callbacks, toTop
          animateScroll(closest,instant,callbacks,false);
        }
      },
      wheelHandler:function(e) {
        if(disabled===true) {
          return true;
        } else if(settings.standardScrollElements) {
          if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
            return true;
          }
        }
        if(!overflow[index]) {
          e.preventDefault();
        }
        var currentScrollTime = new Date().getTime();


        e = e || window.event;
        var value;
        if (e.originalEvent) {
            value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
        } else {
            value = e.wheelDelta || -e.deltaY || -e.detail;
        }
        var delta = Math.max(-1, Math.min(1, value));

        //delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;

        if(scrollSamples.length > 149){
          scrollSamples.shift();
        }
        //scrollSamples.push(Math.abs(delta*10));
        scrollSamples.push(Math.abs(value));

        if((currentScrollTime-scrollTime) > 200){
          scrollSamples = [];
        }
        scrollTime = currentScrollTime;


        if(locked) { 
          e.preventDefault(); 
          return false; 
        }
        if(delta<0) {
          if(index<heights.length-1) {
            if(atBottom()) {
              if(isAccelerating(scrollSamples)) {
                e.preventDefault();
                index++;
                locked = true;
                //index, instant, callbacks, toTop
                animateScroll(index,false,true, false);
              } else {
                return false;
              }
            }
          }
        } else if(delta>0) {
          if(index>0) {
            if(atTop()) {
              if(isAccelerating(scrollSamples)) {
                e.preventDefault();
                index--;
                locked = true;
                //index, instant, callbacks, toTop
                animateScroll(index,false,true, false);
              } else {
                return false
              }
            }
          }
        }

      },
      keyHandler:function(e) {
        if(disabled===true || document.activeElement.readOnly===false) {
          return true;
        } else if(settings.standardScrollElements) {
          if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
            return true;
          }
        }
        if(locked===true) {
          return false;
        }
        if(e.keyCode==38 || e.keyCode==33) {
          if(index>0) {
            if(atTop()) {
              e.preventDefault();
              index--;
              //index, instant, callbacks, toTop
              animateScroll(index,false,true,false);
            }
          }
        } else if(e.keyCode==40 || e.keyCode==34) {
          if(index<heights.length-1) {
            if(atBottom()) {
              e.preventDefault();
              index++;
              //index, instant, callbacks, toTop
              animateScroll(index,false,true,false);
            }
          }
        }
      },
      init:function() {
        if(settings.scrollbars) {
          $window.on('mousedown', manualScroll.handleMousedown);
          $window.on('mouseup', manualScroll.handleMouseup);
          $window.on('scroll', manualScroll.handleScroll);
        } else {
          $("body").css({"overflow":"hidden"});
        }
        window.addEventListener(wheelEvent, manualScroll.wheelHandler, { passive: false });
        //$(document).bind(wheelEvent,manualScroll.wheelHandler);
        $window.on('keydown', manualScroll.keyHandler);
      }
    };

    swipeScroll = {
      touches : {
        "touchstart": {"y":-1,"x":-1},
        "touchmove" : {"y":-1,"x":-1},
        "touchend"  : false,
        "direction" : "undetermined"
      },
      options:{
        "distance" : 30,
        "timeGap" : 800,
        "timeStamp" : new Date().getTime()
      },
      touchHandler: function(event) {
        if(disabled===true) {
          return true;
        } else if(settings.standardScrollElements) {
          if($(event.target).is(settings.standardScrollElements) || $(event.target).closest(settings.standardScrollElements).length) {
            return true;
          }
        }
        var touch;
        if (typeof event !== 'undefined'){
          if (typeof event.touches !== 'undefined') {
            touch = event.touches[0];
            switch (event.type) {
              case 'touchstart':
                swipeScroll.touches.touchstart.y = touch.pageY;
                swipeScroll.touches.touchmove.y = -1;

                swipeScroll.touches.touchstart.x = touch.pageX;
                swipeScroll.touches.touchmove.x = -1;

                swipeScroll.options.timeStamp = new Date().getTime();
                swipeScroll.touches.touchend = false;
              case 'touchmove':
                swipeScroll.touches.touchmove.y = touch.pageY;
                swipeScroll.touches.touchmove.x = touch.pageX;
                if(swipeScroll.touches.touchstart.y!==swipeScroll.touches.touchmove.y && (Math.abs(swipeScroll.touches.touchstart.y-swipeScroll.touches.touchmove.y)>Math.abs(swipeScroll.touches.touchstart.x-swipeScroll.touches.touchmove.x))) {
                  //if(!overflow[index]) {
                    event.preventDefault();
                  //}
                  swipeScroll.touches.direction = "y";
                  if((swipeScroll.options.timeStamp+swipeScroll.options.timeGap)<(new Date().getTime()) && swipeScroll.touches.touchend == false) {

                    swipeScroll.touches.touchend = true;
                    if (swipeScroll.touches.touchstart.y > -1) {

                      if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
                        if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {

                          swipeScroll.up();

                        } else {
                          swipeScroll.down();

                        }
                      }
                    }
                  }
                }
                break;
              case 'touchend':
                if(swipeScroll.touches[event.type]===false) {
                  swipeScroll.touches[event.type] = true;
                  if (swipeScroll.touches.touchstart.y > -1 && swipeScroll.touches.touchmove.y > -1 && swipeScroll.touches.direction==="y") {

                    if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
                      if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
                        swipeScroll.up();

                      } else {
                        swipeScroll.down();

                      }
                    }
                    swipeScroll.touches.touchstart.y = -1;
                    swipeScroll.touches.touchstart.x = -1;
                    swipeScroll.touches.direction = "undetermined";
                  }
                }
              default:
                break;
            }
          }
        }
      },
      down: function() {

        if(index<heights.length) {

          if(atBottom() && index<heights.length-1) {

            index++;
            //index, instant, callbacks, toTop
            animateScroll(index,false,true,false);
          } else {
            portHeight = getportHeight();
            if(Math.floor(elements[index].height()/portHeight)>interstitialIndex) {

              interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));
              interstitialIndex += 1;

            } else {
              interstitialScroll(parseInt(heights[index])+(elements[index].outerHeight()-portHeight));
            }

          }
        }
      },
      up: function() {
        if(index>=0) {
          if(atTop() && index>0) {

            index--;
            //index, instant, callbacks, toTop
            animateScroll(index,false,true,false);
          } else {

            if(interstitialIndex>2) {
              portHeight = getportHeight();

              interstitialIndex -= 1;
              interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));

            } else {

              interstitialIndex = 1;
              interstitialScroll(parseInt(heights[index]));
            }
          }

        }
      },
      init: function() {
        if (document.addEventListener && settings.touchScroll) {
          var eventListenerOptions = {
            passive: false
          };
          document.addEventListener('touchstart', swipeScroll.touchHandler, eventListenerOptions);
          document.addEventListener('touchmove', swipeScroll.touchHandler, eventListenerOptions);
          document.addEventListener('touchend', swipeScroll.touchHandler, eventListenerOptions);
        }
      }
    };


    util = {
      refresh:function(withCallback,scroll) {
        clearTimeout(timeoutId2);
        timeoutId2 = setTimeout(function() {
          //retain position
          sizePanels(true);
          //scroll, firstLoad
          calculatePositions(scroll,false);
          if(withCallback) {
              settings.afterResize();
          }
        },400);
      },
      handleUpdate:function() {
        //callbacks, scroll
        //changed from false,true to false,false
        util.refresh(false,false);
      },
      handleResize:function() {
        //callbacks, scroll
        util.refresh(true,false);
      },
      handleOrientation:function() {
        //callbacks, scroll
        util.refresh(true,true);
      }
    };
    settings = $.extend(settings, options);

    //retain position
    sizePanels(false);

    calculatePositions(false,true);

    if(true===hasLocation) {
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    } else {
      setTimeout(function() {
        //instant,callbacks
        manualScroll.calculateNearest(true,false);
      },200);
    }
    if(heights.length) {
      manualScroll.init();
      swipeScroll.init();

      $window.on("resize",util.handleResize);
      if (document.addEventListener) {
        window.addEventListener("orientationchange", util.handleOrientation, false);
      }
    }
    function interstitialScroll(pos) {
      if( $().velocity ) {
        $(settings.target).stop().velocity('scroll', {
          duration: settings.scrollSpeed,
          easing: settings.easing,
          offset: pos,
          mobileHA: false
        });
      } else {
        $(settings.target).stop().animate({
          scrollTop: pos
        }, settings.scrollSpeed,settings.easing);
      }
    }

    function sizePanels(keepPosition) {
      if(keepPosition) {
        top = $window.scrollTop();
      }

      var selector = settings.section;
      overflow = [];
      if(settings.interstitialSection.length) {
        selector += "," + settings.interstitialSection;
      }
      if(settings.scrollbars===false) {
        settings.overflowScroll = false;
      }
      portHeight = getportHeight();
      $(selector).each(function(i) {
        var $this = $(this);

        if(settings.setHeights) {
          if($this.is(settings.interstitialSection)) {
            overflow[i] = false;
          } else {
            if(($this.css("height","auto").outerHeight()<portHeight) || $this.css("overflow")==="hidden") {
              $this.css({"height":portHeight});

              overflow[i] = false;
            } else {

              $this.css({"height":$this.outerHeight()});

              if(settings.overflowScroll) {
                overflow[i] = true;
              } else {
                overflow[i] = false;
              }
            }

          }

        } else {

          if(($this.outerHeight()<portHeight) || (settings.overflowScroll===false)) {
            overflow[i] = false;
          } else {
            overflow[i] = true;
          }
        }
      });
      if(keepPosition) {
        $window.scrollTop(top);
      }
    }
    function calculatePositions(scroll,firstLoad) {
      var selector = settings.section;
      if(settings.interstitialSection.length) {
        selector += "," + settings.interstitialSection;
      }
      heights = [];
      names = [];
      elements = [];
      $(selector).each(function(i){
          var $this = $(this);
          if(i>0) {
            heights[i] = parseInt($this.offset().top) + settings.offset;
          } else {
            heights[i] = parseInt($this.offset().top);
          }
          if(settings.sectionName && $this.data(settings.sectionName)) {
            names[i] = "#" + $this.data(settings.sectionName).toString().replace(/ /g,"-");
          } else {
            if($this.is(settings.interstitialSection)===false) {
              names[i] = "#" + (i + 1);
            } else {
              names[i] = "#";
              if(i===$(selector).length-1 && i>1) {
                heights[i] = heights[i-1] + (parseInt($($(selector)[i-1]).outerHeight()) - parseInt($(window).height())) + parseInt($this.outerHeight());
              }
            }
          }
          elements[i] = $this;
          try {
            if($(names[i]).length && window.console) {
              console.warn("Scrollify warning: Section names can't match IDs - this will cause the browser to anchor.");
            }
          } catch (e) {}

          if(window.location.hash===names[i]) {
            index = i;
            hasLocation = true;
          }

      });

      if(true===scroll) {
        //index, instant, callbacks, toTop
        animateScroll(index,false,false,false);
      }
    }

    function atTop() {
      if(!overflow[index]) {
        return true;
      }
      top = $window.scrollTop();
      if(top>parseInt(heights[index])) {
        return false;
      } else {
        return true;
      }
    }
    function atBottom() {
      if(!overflow[index]) {
        return true;
      }
      top = $window.scrollTop();
      portHeight = getportHeight();

      if(top<parseInt(heights[index])+(elements[index].outerHeight()-portHeight)-28) {

        return false;

      } else {
        return true;
      }
    }
  }

  function move(panel,instant) {
    var z = names.length;
    for(;z>=0;z--) {
      if(typeof panel === 'string') {
        if (names[z]===panel) {
          index = z;
          //index, instant, callbacks, toTop
          animateScroll(z,instant,true,true);
        }
      } else {
        if(z===panel) {
          index = z;
          //index, instant, callbacks, toTop
          animateScroll(z,instant,true,true);
        }
      }
    }
  }
  scrollify.move = function(panel) {
    if(panel===undefined) {
      return false;
    }
    if(panel.originalEvent) {
      panel = $(this).attr("href");
    }
    move(panel,false);
  };
  scrollify.instantMove = function(panel) {
    if(panel===undefined) {
      return false;
    }
    move(panel,true);
  };
  scrollify.next = function() {
    if(index<names.length) {
      index += 1;
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    }
  };
  scrollify.previous = function() {
    if(index>0) {
      index -= 1;
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    }
  };
  scrollify.instantNext = function() {
    if(index<names.length) {
      index += 1;
      //index, instant, callbacks, toTop
      animateScroll(index,true,true,true);
    }
  };
  scrollify.instantPrevious = function() {
    if(index>0) {
      index -= 1;
      //index, instant, callbacks, toTop
      animateScroll(index,true,true,true);
    }
  };
  scrollify.destroy = function() {
    if(!initialised) {
      return false;
    }
    if(settings.setHeights) {
      $(settings.section).each(function() {
        $(this).css("height","auto");
      });
    }
    $window.off("resize",util.handleResize);
    if(settings.scrollbars) {
      $window.off('mousedown', manualScroll.handleMousedown);
      $window.off('mouseup', manualScroll.handleMouseup);
      $window.off('scroll', manualScroll.handleScroll);
    }
    // $window.off(wheelEvent,manualScroll.wheelHandler);
    window.removeEventListener(wheelEvent,manualScroll.wheelHandler);
    $window.off('keydown', manualScroll.keyHandler);

    if (document.addEventListener && settings.touchScroll) {
      document.removeEventListener('touchstart', swipeScroll.touchHandler, false);
      document.removeEventListener('touchmove', swipeScroll.touchHandler, false);
      document.removeEventListener('touchend', swipeScroll.touchHandler, false);
    }
    heights = [];
    names = [];
    elements = [];
    overflow = [];
  };
  scrollify.update = function() {
    if(!initialised) {
      return false;
    }
    util.handleUpdate();
  };
  scrollify.current = function() {
    return elements[index];
  };
  scrollify.currentIndex = function() {
    return index;
  };
  scrollify.disable = function() {
    disabled = true;
  };
  scrollify.enable = function() {
    disabled = false;
    if (initialised) {
      //instant,callbacks
      manualScroll.calculateNearest(false,false);
    }
  };
  scrollify.isDisabled = function() {
    return disabled;
  };
  scrollify.setOptions = function(updatedOptions) {
    if(!initialised) {
      return false;
    }
    if(typeof updatedOptions === "object") {
      settings = $.extend(settings, updatedOptions);
      util.handleUpdate();
    } else if(window.console) {
      console.warn("Scrollify warning: setOptions expects an object.");
    }
  };
  $.scrollify = scrollify;
  return scrollify;
}));
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
var smartSliderBottom = $(window).height() * 0.2814814;
$('.smartslider-bottom').css({'bottom':smartSliderBottom});
var bottomMorningNotices = $(window).height() * 0.1611111;
var rightMorningNotices = $(window).outerWidth() * 0.078125;

if ($(window).outerWidth() > 998) {
	$('.overview_morning_notices').css({'bottom':bottomMorningNotices});
	$('.overview_morning_notices').css({'right':rightMorningNotices});	
}
if ($(window).outerWidth() > 998) {
	var overviewScreenHeight = $( window ).height();
	var overviewScreenWidth = $( window ).outerWidth();
	$('.overview_screen').css("background-size", overviewScreenWidth+"px " + overviewScreenHeight + "px");
}

if ($(window).outerWidth() > 998) {
	var overviewContentWidth = $(window).outerWidth() * 0.377604167;
	$('.overview_content').css({'width':overviewContentWidth});	
}

//Размеры и отступы на первом экране
let welcomeLightToggle = document.querySelector('.light-toggle-js');
let welcomeLightTop = document.querySelector('.overview_01_light_top');
let welcomeLightSide = document.querySelector('.overview_01_light_side');
let welcomeShapeOne = document.querySelector('.overview_01_shape_01');
let welcomeShapeTwo = document.querySelector('.overview_01_shape_02');
let welcomeShapeThree = document.querySelector('.overview_01_shape_03');

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