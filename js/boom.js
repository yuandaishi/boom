//思路：
//1：html页面div容器包含img标签
//2：根据img标签的width，height以及位置（距离div容器的left以及top）创建一个位置相同position：absolute的div容器
//3：通过两个参数，确定每行每列多少个div，之后可以根据图片宽高除以div个数，得到每个div的宽高
//4：根据步骤三得到的宽高，创建N个div，position：absolute，计算位置。
//5：给每个div背景图img，超出的部分overflow，然后确定计算出背景图的位置。（会渲染很多图片，性能比较差）
//6：初始图片dispaly：none。
//以上步骤完成创建N个div的任务。
//6：点击时触发动画（每个div的动画持续时间是一样的）。透明度变为0，scale取随机参数，translate(x,y,z)、rotate取随机参数
//7:图片有空白，就会给人不规则形状的错觉，如果没有的话，则很规矩，这个之后在考虑。
//注：生成dom的话，则应该先把dom的css属性先定义好之后再生成，如果先生成，再定义css属性，会重绘，浏览器性能会降低(个人猜想)
;(function(){//立即执行
var Boom=function(settings){//局部变量
		var _this=this;
		this.settings={//默认参数，实例化之后，this指向这个函数对象，不再是指向window，所以能正确的寻找到prototype内的函数
			className:"",//默认类名
			row:30,//每行div个数
			col:10//每列div个数
		}
		$.extend(this.settings,settings||{});//获取的参数替换默认参数
		if(this.settings.logo!=""){
			$("."+this.settings.className).css({
				"position":"relative",
			})
			$("."+this.settings.className).each(function(){
				var domImg=$(this).find("img");
				var arr_w_h=_this.wid_hei(domImg);//去掉var之后定义，则为全局变量，外部重新定义（命名相同）的话，会被污染，不知道如何解决
				var arr_t_l=_this.position_t_l(domImg);
				var strDom=$("<div>",{
					class:"boom_son",//相当于attr("class","boom_son")
				}).css({//这一部分完全可以写在CSS里面(宽高，left，top不可以写，所以还是会重绘,所以这样应该是最好的方法)
					"position":"absolute",
					"width":arr_w_h[0],
					"height":arr_w_h[1],
					"top":arr_t_l[0],
					"left":arr_t_l[1],
					"cursor":"pointer",
					"perspective":8000,
					"transform-style":"preserve-3d"
				});//创建位置和大小都和图片一致的dom元素，并且赋予属性（防止重绘），但是还没有渲染出来
				$(this).append(strDom);//渲染
			})
			$(".boom_son").each(function(){
				var domImg=$(this).prev("img");
				var address=_this.img_address(domImg);
				var width_s_s=$(this).width()/_this.settings.row;
				var height_s_s=$(this).height()/_this.settings.col;
				for(var i=0;i<_this.settings.row;i++){
					for(var j=0;j<_this.settings.col;j++){
						var strDom_s=$("<div>",{
							class:"boom_son_son"
						}).css({
							"position":"absolute",
							"left":width_s_s*i,
							"top":height_s_s*j,
							"width":width_s_s,
							"height":height_s_s,
							"background":"url("+address+") no-repeat",
							"background-size":$(this).width()+"px"+" "+$(this).height()+"px",//数字和字符串相加等于字符串,设置背景图大小，用户可能自定义图片宽度
							"background-position":"left "+(-width_s_s*i)+"px top "+(-height_s_s*j)+"px",
							"transition":"all ease-in-out 1s"
						})
						$(this).append(strDom_s)
					}
				}
			})
			$("."+this.settings.className).each(function(){
				$(this).find(".boom_son").click(function(){
					$(this).find("div").each(function(){//this总是指向当前环境
						var _this=this;
						var x=(Math.random()*400-200)|0;
						var y=(Math.random()*300-150)|0;
						var z=(Math.random()*800-400)|0;
						var a=(Math.random()*720-360)|0;
						var b=(Math.random()*720-360)|0;
						var c=(Math.random()*720-360)|0;
						var e=(Math.random()*3)|0;
						var clip_arr=["polygon(50% 0%, 0% 100%, 100% 100%)",//想要跟多的效果，可自行添加
								"polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
								"polygon(20% 0%, 80% 0%, 100% 100%, 33% 67%)",
								"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
								"polygon(50% 0%, 100% 38%, 76% 89%, 11% 48%, 46% 39%)",
								"polygon(50% 0%, 100% 38%, 28% 98%, 22% 59%, 0% 38%)",
								"polygon(69% 6%, 72% 83%, 25% 80%, 28% 54%, 0% 38%)",
								"polygon(50% 0%, 66% 34%, 100% 60%, 72% 100%, 30% 84%, 4% 60%, 24% 26%)",
								"polygon(50% 0%, 66% 34%, 100% 60%, 72% 100%, 30% 84%, 4% 60%, 44% 55%)",
								"polygon(50% 0%, 100% 25%, 90% 83%, 49% 91%, 0% 75%, 26% 39%)"
						];
						var clip_img=clip_arr[Math.random()*9|0];
//						var strCss="translate3d("+x+"px,"+y+"px,"+z+"px) rotateX("+a+"deg) rotateY("+b+"deg) rotateZ("+c+"deg) scale3d("+e+","+e+","+e+")";
//						var strCss_pre="translate3d("+x+"px,"+y+"px,"+z+"px) rotateX("+a+"deg) rotateY("+b+"deg) rotateZ("+c+"deg) scale3d("+e+","+e+","+e+")"
						$(this).css({
							"transform":"translate3d("+x+"px,"+y+"px,"+z+"px) rotateX("+a+"deg) rotateY("+b+"deg) rotateZ("+c+"deg) scale3d("+e+","+e+","+e+")",
							"-webkit-clip-path":clip_img,
							"clip-path": clip_img
						});
						setTimeout(function(){
							$(_this).css({
								"transform":"translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1,1,1)",
								"-webkit-clip-path":"none",
								"clip-path":"none",
							});
						},1400)
					})
				})
			})
		}else{
			console.error("没有设置对应的boom对象")			
		}
	}
	Boom.prototype={
		wid_hei:function(dom){//获取图片宽高
			var width=dom.width();
			var heigt=dom.height();
			return [width,heigt];
		},
		position_t_l:function(dom){//图片距离外部div，也就是boom的top值和left值
			var top=dom.position().top;
			var left=dom.position().left;
			return [top,left];
		},
		img_address:function(dom){//获取图片背景图地址
			var address=dom.attr("src");
			return address;
		}
	}
	window.Boom=Boom;//Boom变为全局变量
})()
