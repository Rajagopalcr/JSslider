(function($) {
    "use strict";

    if ($.slider) {
        return;
    }
	$.slider = {};	
	
    var count = 0,
        maxCount,
        instance = 0,
		animationSpeed = 2000, // 1 second delay
		pause = 3000,
        document = window.document;

    $.fn.slider = function(options) {
            var defaults = {
                files: [],
                width: null,
                height: null,
				autoslide: false
            };

            var opts = $.extend(true, {}, defaults, options);

            if ($.slider.validate(opts)) {
                $(this).css({
                    width: opts.width,
                    height: opts.height
                })
                maxCount = opts.files.length;
                $.slider.control.create(this, opts);
                $.slider.core.create(this, opts);
				if(opts.autoslide)
					$.slider.control.autosliding(this, opts);
				else
					$.slider.control.eventHandler(this, opts);
            }
        }
    

    $.slider.validate = function inputValidation(obj) {
        var status = true;
        $.each(obj, function(key, val) {
            if (key === 'files' || key === 'width' || key === 'height') {
                if (key === 'files' && (typeof val !== 'object' && val.length === 0)) {
                    status = false;
                    alert('Input files should of array');
                    return status;
                }
                if ((key === 'width' || key === 'height') && (typeof val !== 'number' || typeof val !== 'number')) {
                    status = false;
                    alert('Both width and height should be of number');
                    return status;
                }
            }
        });
        return status;
    }

    $.slider.core = {
        create: function(el, options) {
            var fs = options.files,
                h = options.height,
                w = options.width;

            var _slideWrapper = document.createElement('div'),
                _slides = document.createElement('ul'),
                _temp = '';

            _slideWrapper.id = 'slider-wrapper';
            _slides.className = 'slides';
			
			
            for (var i=0;i<fs.length;i++) {
                _temp += '<li class="slide"><img src="' + fs[i] + '" style="width:'+w+'px;height:'+h+'px;" alt='+i+'></img></li>';
            }
            _slides.innerHTML = _temp;
            _slideWrapper.appendChild(_slides);

            $("#slider-wrapper,#slider-wrapper .slides,#slider-wrapper .slide").css({
                width: w,
                height: h
            });

            el.append(_slideWrapper);
			
			

        }
    }   

    $.slider.control = {
        create : function(el, options) {
            el.html('<div id="slide-control" style="top:' + options.height / 2 + 'px"><div class="slide-prev">Previous</div><div class="slide-next" >Next</div></div>');
		},
		autosliding : function(el, options){
			$("#slide-control").hide();
			
			var w = options.width,
				interval;
			
			//cache DOM
			var $slider = $(el),
				$slidesContainer = $slider.find(".slides");
			
			function startSlide(){
				interval = setInterval(function(){
					$slidesContainer.animate({'margin-left': '-='+w},animationSpeed,function(){
						count++;
						if(count === maxCount - 1){
							count = 0;
							$slidesContainer.css("margin-left",0);					
						}
										
					});				
				},pause);				
			}

			function stopSlide(){
				clearInterval(interval);				
			}
			
			$slider.on("mousemove",stopSlide).on("mouseout",startSlide);
			
		},
		eventHandler : function(el, options){
			var $slider = $(el);
			var w = options.width,
			    n = this.next.bind(this,w),
			    p = this.prev.bind(this,w);
				
			$(".slide-next").on("click",function(event){
				n();
				event.stopPropagation();
			});
			$(".slide-prev").on("click",function(){
				p();
				event.stopPropagation();
			});
			
			var sX = 0,sY = 0, thresholdDistance = 60, thresholdCorner = 15;			
			$slider.on("mousedown",function(event){				
				sX = event.offsetX;
				sY = event.offsetY;
			});
			$slider.on("mousemove",function(event){
					var eX = event.offsetX, eY = event.offsetY;		
					if( sX!=0 && (Math.abs(sX - eX) > thresholdDistance) && (Math.abs(sY - eY) < thresholdCorner)){
						if((count !== (maxCount - 1)) && ((sX - eX) > 0)){
							n();
							sX = 0;
						}							
						else if(((sX - eX) < 0) && count !==0 ){
							p();
							sX = 0;
						}							
					}
					
			});
			this.threshold();
			
		},
        next : function(a) {
            count++;
            $(".slides").animate({
                'margin-left': -(count * a)
            }, 1000);
            this.threshold();
        },
        prev : function(a) {
            count--;
            $(".slides").animate({
                'margin-left': -(count * a)
            }, 1000);
            this.threshold();
        },
        threshold : function() {
            var n = $(".slide-next"),
                p = $(".slide-prev");
            if (count === 0) {
                n.show();
                p.hide();
            } else if (count === maxCount - 1) {
                n.hide();
                p.show();
            } else {
                n.show();
                p.show();
            }

        }

    }


}(jQuery));