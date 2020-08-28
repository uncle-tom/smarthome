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
(function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t});
$( document ).ready(function() {
	setTimeout(function(){
		//Preloader
		let preloader = document.querySelector('.preloader');
		preloader.classList.add('hide');
	}, 3500);
});

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
};

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

//Modal Width
if ($(window).outerWidth() > 998) {
	var modalWidth = $( window ).outerWidth() * 0.379166667;
	$('.modal').css({'width':modalWidth});
}

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
if ($(window).outerWidth() > 998) {
	var headerPaddingTop = $( window ).height() * 0.0925925;
	$('.header').css({'padding-top': headerPaddingTop});	
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
$( document ).ready(function() {
  $('.smartslider').each(function(){
  	dataSmartSlider = $(this).data('smartslider');
	  initSmartslider(dataSmartSlider);
	});  
});

function initSmartslider(dataSmartSlider) {
	//Считаем отступ слева
	if ($(window).outerWidth() > 1280) {
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

if ($(window).outerWidth() > 1280) {
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

var smartSliderBottom = $(window).height() * 0.2814814;
var smartSliderBottomMobile = $(window).height() * 0.266129032;

if ($(window).outerWidth() > 768) {
	$('.smartslider-bottom').css({'bottom':smartSliderBottom});
} else {
	$('.smartslider-bottom').css({'bottom':smartSliderBottomMobile});
}
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
function welcomeLightOn() {
	$('.light-toggle-js').toggleClass('on');
	$('.light-toggle-js').closest('.lighting-widget').find('.notice').toggleClass('on');
	$('.overview_welcome').toggleClass('on');
	$('.light-lamp-circle').toggleClass('on');
	$('.light-lamp-ray').toggleClass('on');
	$('.torchere-path-up').toggleClass('animate');
	$('.torchere-path-down').toggleClass('animate');	
}
$('.light-toggle-js').on('click', function(){
	welcomeLightOn();
});

//Свет включается после загрузки сайта
$( document ).ready(function() {
  setTimeout(welcomeLightOn, 5000);
});


//Включаем/выключаем охрану на планшете
$('.security-toggle-js').on('click', function(){
	$(this).toggleClass('on');
	$(this).closest('.security-widget').find('.notice').toggleClass('on');
});