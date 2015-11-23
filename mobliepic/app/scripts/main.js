/* global Zepto */

(function ($) {
	'use strict';
	//定义图片数量

	var total = 17;
	//取window值
	var zWin = $(window);
	//render目的:动态渲染图片列表
	var render = function () {
		//定义padding 值
		var padding = 2;
		// 获取window宽度
		var winWidth = zWin.width();
		//定义照片宽度
		var picWidth = Math.floor((winWidth - padding * 3) / 4);//四省五略
		//临时变量，保存每次for循环产生的html代码。
		var tmpl = '';
		for (var i = 1; i <= total; i++) {
			//特殊情况
			var p = padding;
			//定义total文件
			var imgSrc = 'images/' + i + '.jpg';
			if (i % 4 === 1) {
				p = 0;
			}
			//通过小图片id找到大图。
			tmpl += '<li data-id="' + i + '"class="animated bounceIn" style="width:' + picWidth + 'px;height:' + picWidth + 'px;padding-top:' + padding + 'px;padding-left:' + p + 'px"><canvas id="cvs_' + i + '"></canvas></li>';
			//创建images对象
			var imageObj = new Image();
			//标记对象
			imageObj.index = i;
			imageObj.onload = function () {
				var cvs = $('#cvs_' + this.index)[0].getContext('2d');
				//定义宽高
				cvs.width = this.width;
				cvs.height = this.height;
				//画出来
				cvs.drawImage(this, 0, 0);
			};
			//请求src
			imageObj.src = imgSrc;

		}
		$('#container').html(tmpl);
	};
	render();
	var wImage = $('#large_img');
	var domImage = wImage[0];
	//定义loadImg方法
	var loadImg = function (id, callback) {
		// $('#large_img').show();

		//操作大图的style

		$('#large_container').css({
			width: zWin.width(),
			height: zWin.height()
		}).show();
		//得到大图的地址.
		var imgsrc = 'images/' + id + '.large.jpg';
		//新建一个img,控制图片
		var imgObj = new Image();
		imgObj.onload = function () {
			var h = this.height;
			var w = this.width;
			//窗口的长宽。
			var winWidth = zWin.width();
			var winHeight = zWin.height();
			//获取竖图真实展示的宽度
			var realw = winHeight * w / h;
			//获取横图真实展示的高度
			var realh = winWidth * h / w;
			//算出竖屏的padding值
			var paddingLeft = Math.floor((winWidth - realw) / 2);
			//算出横屏的paddingTop值
			var paddingTop = Math.floor((winHeight - realh) / 2);
			//解决bug初始化
			wImage.css('width', 'auto').css('height', 'auto').css('padding-top', '0px').css('padding-left', '0px');
			//判断，横竖图
			if (h / w > 1.2) {
				//竖图
				//显示图片
				wImage.attr('src', imgsrc).css('height', winHeight).css('padding-left', paddingLeft);

			} else {
				//横图
				//显示图片
				wImage.attr('src', imgsrc).css('width', winWidth).css('padding-top', paddingTop);
			}

		};
		imgObj.src = imgsrc;
		callback && callback();

	};
	var cid;
	//为小图做事件绑定，方便大图显示。
	//通过事件代理，减少开销。
	$('#container').delegate('li', 'tap', function () {
		//获取id
		var id_ = cid = $(this).attr('data-id');
		loadImg(id_);
	});
	$('#large_container').tap(function () {
		$(this).hide();
	}).swipeLeft(function () {
		cid++;
		if (cid > total) {
			cid = total;
		} else {
			loadImg(cid, function () {
				domImage.addEventListener('webkitAnimationEnd', function () {
					wImage.removeClass('animated bounceInRight');
					domImage.removeEventListener('webkitAnimationEnd');
				}, false);
				wImage.addClass('animated bounceInRight');
			});
		}

	}).swipeRight(function () {
		cid--;
		if (cid < 1) {
			cid = 1;
		} else {
			loadImg(cid, function () {
				domImage.addEventListener('webkitAnimationEnd', function () {
					wImage.removeClass('animated bounceInLeft');
					domImage.removeEventListener('webkitAnimationEnd');
				}, false);
				wImage.addClass('animated bounceInLeft ');
			});
		}
		});

})(Zepto);