/* global jQuery */
(function ($) {
	//定义私有方法
	var _prefix = (function (temp) {
		//存放浏览器前缀
		var aPrefix = ["webkit", "Moz", "o", "ms"],
			props = "";
		for (var i in aPrefix) {
			props = aPrefix[i] + "Transition";
			if (temp.style[props] !== undefined) {
				return "-" + aPrefix[i] + "-";
			}
		}
	})(PageSwitch);
	var PageSwitch = (function () {
		function PageSwitch(element, options) {
			this.settings = $.extend(true, $.fun.PageSwitch.defaults, options || {});
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			// 初始化插件
			// 实现: 初始化dom结构,布局,分页及绑定时间
			init: function () {
				var me = this;
				//dom 初始化
				me.selectors = me.settings.selectors;
				me.sections = me.element.find(me.selectors.sections);
				me.section = me.sections.find(me.selectors.section);
				// 初始化方向
				me. ection = me.settings.direction == "vertical" ? true : false;
				// 获取页面的数量
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

				me.canScroll = true;

				//判断方向
				if (!me.direction) {
					me._initLayout();
				}
				//判断是否支持翻页效果
				if (me.settings.pagination) {
					me._initPaging();//如果支持翻页，就调用此方法。
				}

				me._initEvent();


			},
			// 说明:获取滑动页面数量
			pagesCount: function () {
				return this.section.length;
			},
			// 滑动的宽度或者高度
			switchLength: function () {
				return this.direction ? this.element.height() : this.element.width();
			},
			//向上滑动方法
			prev: function(){
				var me = this;
				if (me.index > 0) {
					me.index--;
				} else if(me.settings.loop){
					me.index = me.pagesCount - 1;
				}
				me._scrollPage();
			},
			//向下滑动的方法
			next: function () {
				var me = this;
				if (me.index < me.pagesCount ) {
					me.index++;
				} else if (me.settings.loop) {
					me.index = 0;
				}
				me._scrollPage();
			},
			// 主要针对横屏情况，进行页面布局
			_initLayout: function () {
				var me = this;
				var width = (me.pagesCount * 100) + "%",
					cellWidth = (100 / me.pagesCount).toFixed(2)/*这是取两位小数的意思*/ + "%";
				me.sections.width(width);
				me.section.width(cellWidth).css("float","left") ;
			},
			//  实现分页的dom结构及css样式
			_initPaging: function () {
				var me = this,
					pagesClass = me.selectors.page.substring(1);//截取字符串,使用substring
				me.activeClass = me.selectors.active.substring(1);
				var	pageHtml = "<ul class=" + pagesClass + ">";
				for (var i = 0; i < me.pagesCount; i++){
					pageHtml += "<li></li>";
				}
				pageHtml += "</ul>";
				me.element.append(pageHtml);
				//增加active
				var pages = me.element.find(me.selectors.page);
				me.pageItem = pages.find("li");
				me.pageItem.eq(me.index).addClass(me.activeClass);

				//判断方向
				if (me.direction) {
					pages.addClass("vertical");
				} else {
					pages.addClass("horizontal");
				}

			 },
			// 初始化插件事件
			_initEvent: function () {
				//采用事件委托 "on"
				var me = this;
				//绑定点击事件
				me.element.on('click', me.selectors.pages + "li", function () {
					me.index = $(this).index();
					//调用滑动方法
					me._scrollPage();
				});
				//绑定鼠标滚动事件
				me.element.on("mousewheel DOMMouseScroll", function (e) {
					if (me.canScroll) {
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					//如果向上翻页，调用prev()，向下调用next()
					if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
						me.prev();
					} else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
						me.next();
					}
					}
				});
				//绑定键盘事件
				if (me.settings.keybord) {
					$(window).on("keydown", function (e) {
						var keyCode = e.keyCode;
						if (keyCode == 37 || keyCode == 38) {
							me.prev();
						} else if (keyCode == 39 || keyCode == 40) {
							me.next();
						}
					});
				}
				//绑定resize事件
				$(window).resize(function () {
					var currentLength = me.switchLength(),
						offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset.left;
					if (Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1)) {
						me.index++;
					}
					if (me.index) {
						me._scrollPage();
					}
				});
				//绑定transitioned事件 ,用于动画结束后，执行的函数
				me.section.on("trasitionend webkitTransitionEnd oTransitionEnd otransitionend", function () {
					me.canScroll = true;
					if (me.settings.callback && $.type(me.settings.callback) == "function") {
						me.settings.callback();
					}
				});
				//上面的事件10.28日再添加
				//已添加10.28


			},
			// 实现滑动动画
			_scrollPage: function () {
				var me = this,
					dest/*用来存放坐标值 */ = me.section.eq(me.index).position();
				if (!dest) return;
				me.canScroll = false;
				// 判断浏览器是否支持transition属性
				if (_prefix) {
					//支持，就添加前缀
					me.sections.css(_prefix + "transition", "all" + me.settings.duration + "ms" + me.settings.easing);
					//每次滑动的距离。竖屏滑动，获取top值，横屏滑动，获取left值
					var translate = me.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
					//再添加transform属性
					me.sections.css(_prefix + "transform", translate);
				} else {
					//不支持，就用animate()属性
					var animateCss = me.direction ? { top: -dest.top } : { left: -dest.left };
					me.sections.animate(animateCss, me.settings.duration, function () {
						me.canScroll = true;
						if (me.settings.callback && $.type(me.settings.callback) == "function") {
							me.settings.callback();
						}
					});
				}

				//分页样式的调整
				if (me.settings.pagination) {
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
				}
			}


		};
		return PageSwitch;
	})();
	$.fn.PageSwitch = function (options) {
		return this.each(function () {
			var me = $(this),
				instance = me.data("PageSwitch");
			if (!instance) {
				instance = new PageSwitch(me, options);
				me.data("PageSwitch", instance);
			}
			if ($.type(options) === "string") return instance[options]();
			//调用上面init 方法
			$("div").PageSwitch("init");
		});
	};
	// 如下设置默认值
	$.fn.PageSwitch.defaults = {
		selectors: {
			sections: ".sections",
			section: ".section",
			page: ".pages",
			active: ".active"
		},
		index: 1,
		easing: "ease",
		duration: 500,
		loop: false,
		pagination: true,
		keybord: true,
		direction: "vertical",
		callback: ""
	};
	//在javascript内部实现初始化
	// $(function () {
	// 	$("[data-PageSwitch]").PageSwitch();
	// });
})(jQuery);
