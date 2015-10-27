(function ($) {
	//定义私有方法
	var PrivateFun = function () {

	};
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
				console.log(me);
				//dom 初始化
				me.selectors = me.settings.selectors;
				me.sections = me.selectors.sections;
				me.section = me.selectors.section;
				// 初始化方向
				me.direction = me.settings.direction == "vertical" ? true : false;
				// 获取页面的数量
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index < pagesCount) ? me.settings.index : 0;

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
				if (me.index < me.pagesCount - 1) {
					me.index++;
				} else if (me.settings.loop) {
					me.index = 0;
				}
				me._scrollPage();
			}
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
					pagesClass = me.selectors.page.substring(1),//截取字符串,使用substring
					activeClass = me.selectors.active.substring(1),
					pageHtml = "<ul class=" + pagesClass + ">";
				for (var i = 0; i < me.pagesCount; i++){
					pageHtml += "<li></li>";
				}
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
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					//如果向上翻页，调用prev()，向下调用next()
					if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
						me.prev();
					} else if (delta < 0 && (me.index <(me.pagesCount -1)&&!me.settings.loop || me.settings.loop)) {
						me.next();
					}
				})
			 }

		};
		return PageSwitch;
	})();
	$.fn.PageSwitch = function () {
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
		index: 0,
		easing: "ease",
		duration: 500,
		loop: fasle,
		pagination: true,
		keybord: true,
		direction: "vertical",
		callback: ""
	};
	//在javascript内部实现初始化
	$(function () {
		$("[data-PageSwitch]").PageSwitch();
	});

})(jQuery);
