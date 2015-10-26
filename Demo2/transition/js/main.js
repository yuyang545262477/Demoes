(function ($) {
	//定义私有方法
	var PrivateFun = function () {

	}
	var PageSwitch = (function () {
		function PageSwitch(element, options) {
			this.settins = $.extend(true, $.fun.PageSwitch.default, options || {});
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			init: function () {

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
	$.fn.PageSwitch.default = {
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
	})

})(jQuery);
