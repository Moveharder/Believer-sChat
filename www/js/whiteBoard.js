$(document).ready(function(){
	var newFixPy=0,newFixPx=10;//用户调整画笔位置
	$('#draw').mouseover(function(){
	    $(this).css({cursor:"url('../img/pen.png'),auto"});
	    newFixPy=$("#whiteBoard")[0].offsetTop-10;//鼠标在画板上的竖直位置应该是鼠标的位置减去whiteboard的上边界再加上标题的高度。 
	});
	var canvas=document.getElementById("draw");
	var draw=canvas.getContext("2d"); 
	var eraserCol='#EFEFEF';
	draw.lineWidth=5; //线条粗细
	draw.strokeStyle="black"; //颜色
	var h=w=50;//橡皮尺寸 
	var fixPx=issetLocalStorage("fixPx",newFixPx);//鼠标位置校准
	var fixPy=issetLocalStorage("fixPy",newFixPy);//鼠标位置校准 
	$("#fixPenX").val(fixPx);
	$("#fixPenY").val(fixPy);
	$("#fixX").text("X:"+fixPx+" px");
	$("#fixY").text("Y:"+fixPy+" px");
	console.log("获取笔触校验值：("+fixPx+","+fixPy+")");
	//判断某个localstorage是否存在
	function issetLocalStorage(varName,defaultVal){
		var varValue = localStorage.getItem(varName);  
		if(varValue==null){
			console.log(varName+":"+defaultVal);
			return defaultVal;//不存在就把当前的值设为默认值
		}
		else{
			console.log(varName+":"+varValue);
			return varValue;//存在就把当前的值设为获取到的localstorage的值
		}
	}

	//画笔位置校准
	$("#fixPenX").change(function(){
		fixPx = $(this).val();  
		localStorage.setItem("fixPx",fixPx);//设置本地存储fixPx
		$("#fixX").text("X:"+fixPx+" px");
		console.log("设置："+fixPx);
	})
 	
 	$("#fixPenY").change(function(){
		fixPy = $(this).val(); 
		localStorage.setItem("fixPy",fixPy);//设置本地存储fixPy
		$("#fixY").text("Y:"+fixPy+"px");
		console.log("设置："+fixPy);
	}) 

	var godraw=false; 
	var eraser = false;

	//按下鼠标
	$("#draw").mousedown(function(e){ 
		if(e.which==1){//鼠标左键按下  画画 
			$(this).css({cursor:"url('../img/pen.png'),auto"})
			//准确坐标
			draw.beginPath(); //起始一条路径 如果没有设置一次绘画的起始与结束 那么下一次绘画原来被擦除的线条又显示出来
			var mouseX=e.pageX-this.offsetLeft;
			var mouseY=e.pageY-this.offsetTop;  
			//draw.moveTo(mouseX-fixPx,mouseY-fixPy); //这个加鼠标位置调整的
			draw.moveTo(mouseX-newFixPx,mouseY-newFixPy); 
			draw.save();
			draw.closePath(); //创建从当前点回到起始点的路径
			godraw=true;//标记左键为激活状态
			eraser=false;//标记右键为锁定状态
		}
		else if(e.which==3){//鼠标右键按下 擦除 
			//eraserCol = $('#draw').css('color');
		    $(this).css({cursor:"url('../img/eraser.png'),auto"}) 
			var initSize = $("#penPixel").val();
			var clrMouseX=e.pageX-this.offsetLeft-initSize/2;
			var clrMouseY=e.pageY-this.offsetTop-initSize/2; 
			draw.fillStyle=eraserCol;//橡皮擦得颜色与设置的底色一样
			console.log(eraserCol);
			draw.fillRect(clrMouseX-newFixPx,clrMouseY-newFixPy,initSize,initSize);//橡皮擦大小
			//draw.clearRect(clrMouseX-fixPx,clrMouseY-fixPy,initSize,initSize);//橡皮擦大小
			draw.save();
			eraser=true;
			godraw=false;  
		}
	})

	//放开鼠标
	$("#draw").mouseup(function(e){
		$(this).css({cursor:"url('../img/pen.png'),auto"})
		godraw=false;
		eraser = false;

	})
	//移动鼠标
	$("#draw").mousemove(function(e){
		e=e;
		if(godraw){
			var mouseX=e.pageX-this.offsetLeft;
			var mouseY=e.pageY-this.offsetTop; 
			//draw.lineTo(mouseX-fixPx,mouseY-fixPy);//这个加鼠标位置调整的
			draw.lineTo(mouseX-newFixPx,mouseY-newFixPy);
			draw.stroke();
			draw.save(); 
		}
		else if(eraser){ 
			var clrMouseX=e.pageX-this.offsetLeft-w/2;
			var clrMouseY=e.pageY-this.offsetTop-h/2;  
			draw.fillStyle=eraserCol;//橡皮擦得颜色与设置的底色一样
			//console.log(eraserCol);
			draw.fillRect(clrMouseX-newFixPx,clrMouseY-newFixPy,w,h);//橡皮擦大小
			//draw.clearRect(clrMouseX-fixPx,clrMouseY-fixPy,w,h);//橡皮擦大小
			draw.save();

		} 
	})
	
	//获取画板当前尺寸
	function getCanvasSize(){
		var H=parseInt($("#draw").css("height"));
		var W=parseInt($("#draw").css("width"));
		return [W,H];
	}

	//更改画板颜色
	$("#drawPanColor").change(function(){
		var CanSize=getCanvasSize();
		console.log(CanSize);
		panColor = $(this).val(); 
		eraserCol=panColor;//更新橡皮擦得颜色
		console.log("更新了橡皮擦颜色:"+eraserCol);
		draw.fillStyle=panColor;
		draw.fillRect(0,0,CanSize[0],CanSize[1]);
	    //$("#draw").css("background-color",panColor);
	});

	//更改画笔颜色
	$("#penColor").change(function(){
	    draw.strokeStyle=$(this).val(); 
	});

	//更改画笔颜色
	$("#penPixel").change(function(){
	    draw.lineWidth=$(this).val(); 
	});

	//更改橡皮尺寸
	$("#eraserSize").change(function(){
		w =$(this).val(); 
		h =$(this).val();
		$("#sizenum").text(w+" px");
	}) 

	//截图
	$("#shootPic").click(function(){
		$("#m").focus();//这句放在 val后面会卡死
		var canvas=$("#draw")[0]; 
		var image = canvas.toDataURL("image/png");
		//var image = canvas.toDataURL('image/jpeg',0.5);   //black bg
		var mVal=$("#m").val();
		$("#m").val(mVal+"↓"+image);//获取val之前先聚焦  
		//var w=window.open('about:blank','image from canvas'); 
		//w.document.write("<img src='"+image+"' alt='from canvas'/>"); 
	})

	/**
     * imgTobase64：将img转换成base64
     * inSrc：图片地址
     * outFormat：输出格式，默认'image/png'
     */
    function imgTobase64(inSrc,outFormat){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image; 
        var dataURL='';
        img.crossOrigin = '*';
        img.src = inSrc;
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            dataURL = canvas.toDataURL(outFormat || 'image/png'); 
            // 清理canvas
            canvas = null; 
        	//console.log(dataURL);
	    	$("#m").focus();//这句放在 val后面会卡死
			var mVal=$("#m").val(); 
			$("#m").val(mVal+"↓"+dataURL);//获取val之前先聚焦  
        }; 
    }

    /**
     * sendEmojiMsg：发送表情消息
     * emojiSrc：表情路径
     */
  //   function sendEmojiMsg(){
  //       var emojiSrc=$(this).attr('src');
  //       var toSendeSrc=imgTobase64(emojiSrc);

		// $("#m").focus();//这句放在 val后面会卡死
		// var mVal=$("#m").val(); 
		// $("#m").val(mVal+"↓"+toSendeSrc);//获取val之前先聚焦  
  //   }

	//发送图片表情 
	$('#emojibox').delegate('li','click',function(){
		$("#emojibox").hide();
	    var emojiSrc=$(this).find('img').attr('src');  
	    var toSendeSrc=imgTobase64(emojiSrc); 
	});
    
	//隐藏、显示表情
	$('#showEmoji').click(function(){ 
		$('#emojibox').toggle(300); 
	});
	

	//自由截屏
	// function init(){
	//     ctx=$("#draw")[0].getContext("2d");//[0]把jquery对象转换为dom对象 才能获取getContent
	//     ctx.lineWidth=1; //线条粗细
	//     ctx.strokeStyle="red"; //颜色
	// }
 //    var cutScr=false,onCut=false;
    // $("#freeShootPic").click(function(){  
   	// 	var mouseX,mouseY,mouseX2,mouseY2;	
    // 	console.log("shoot");
    //     init();
    //     cutScr=true;//点击了截图按钮
    //     $("#draw").mousedown(function(e){
	   //          if(e.which==1&&cutScr==true){//按下左键
	   //              onCut=true;//开始截图
	   //              //设置截图起始坐标
	   //              mouseX=e.pageX-this.offsetLeft;
	   //              mouseY=e.pageY-this.offsetTop;
	   //              ctx.moveTo(mouseX,mouseY);
	   //              console.log("begin:"+mouseX+","+mouseY);
	   //              $("#draw").mousemove(function(e){
	   //                  if(onCut==true){
	   //                      ctx.beginPath();
	   //                      mouseX2=e.pageX-this.offsetLeft;
	   //                      mouseY2=e.pageY-this.offsetTop;
	   //                      //console.log("end:"+mouseX2+","+mouseY2);
	   //                      ctx.lineWidth = 0;//边框宽度
	   //                      //ctx.strokeRect(mouseX,mouseY,mouseX2-mouseX,mouseY2-mouseY);//这两句为了显示截图过程的框
	   //                      ctx.lineTo(mouseX2,mouseY2);
	   //                      ctx.closePath();
	   //                      ctx.save();
	   //                  }
	   //              });

	   //              $("#draw").mouseup(function(e){//鼠标放掉后结束绘画
	   //                  if(onCut==true){
	   //                      ctx.beginPath();
	   //                      mouseX2=e.pageX-this.offsetLeft;
	   //                      mouseY2=e.pageY-this.offsetTop;
	   //                      console.log("begin:"+mouseX+","+mouseY);
	   //                      ctx.strokeRect(mouseX,mouseY,mouseX2-mouseX,mouseY2-mouseY);
	   //                      ctx.closePath();
	   //                      ctx.save();
	   //                      console.log("end:"+mouseX2+","+mouseY2);
	   //                      cutScr=false;//关闭截图
	   //                      onCut=false;//终止截图
	   //                      var imgData=ctx.getImageData(mouseX,mouseY,mouseX2-mouseX,mouseY2-mouseY);//获取指定区域的画布数据
	   //                      ctx.putImageData(imgData,100,360);
	   //                  }
	   //              });
	   //          }
	   //          else{
	   //              //ctx.clearRect(mouseX,mouseY,mouseX2,mouseY2);
	   //              ctx.restore();
	   //              cutScr=false;
	   //              onCut=false;
	   //          }
	   //      });
	   //  }

    // );
	
	//打开本地图片 
	$("#imgOne").change(function(){
		 if(typeof FileReader == "undefined"){
		 	alert("您的浏览器不支持FileReader接口！");
		 }
		 var reader = new FileReader();
		 var file = this.files[0];
		 if(!/image\/\w+/.test(file.type)){
                 alert("请确保文件为图像类型");
                 return false;
         }
		 reader.readAsDataURL(file);
		 reader.onload=function(e){ 
		 	//alert(this.result);
		 	//$("#imgOne").attr("src",this.result);
		 	var img=new Image();
		 // 	console.log(this.width+","+this.height);
		 // 	var Wrate=980/this.width;
		 // 	var Hrate=570/this.height;
		 // 	console.log(Wrate+","+Hrate); 
			// img.width=this.width*Wrate;
			// img.height=this.height*Hrate;
			img.src=this.result;//图片的src存储在result中
			draw.clearRect(0,0,980,570);//清理画板 
			draw.drawImage(img,0,0,980,570); 
		}

	});

	//清屏
	$("#cleanScreen").click(function(){
	    var conf=confirm("确定清理画板内容吗？");
	    if(conf){ 
			var CanSize=getCanvasSize(); 
	        draw.clearRect(0,0,CanSize[0],CanSize[1]);
	    }
	});

	
	//鼠标靠近画板左侧边缘处显示工具栏
	$("#draw").mousemove(function(e){ 
		var mouseX=e.pageX-13;
		var mouseY=e.pageY-106; 
		$("#test").html("("+mouseX+","+mouseY+")");//显示鼠标位置
		if (mouseX<=2) {
			$("#drawOption").show(200);
			$("#drawOptionSlider").hide(200);
		} 
		else{
			$("#drawOption").hide(200);
			$("#drawOptionSlider").show(200);
		}
	});
	//或是点击slider
	$("#drawOptionSlider").click(function(e){  
		$("#drawOption").show(200);
		$("#drawOptionSlider").hide(200); 
	});

 // 	//本地视频获取
	// var fps=30,videoObj;// 1000/30
	// var canvas=document.getElementById("localVideo");
	// var localVideo=canvas.getContext("2d");
	// setInterval(function(){
	//  	videoObj=$("#myself")[0]; //没有[0]不是对象本身 
	//     localVideo.drawImage(videoObj,0,0,100,70);  
	// },fps);


		// var eleH=$("#chatRoom").outerHeight();
		// var eleW=$("#chatRoom").outerWidth();
		// console.log("宽，高"+eleW+":"+eleH);
		// //newTop=$("#chatRoom")[0].offsetTop;
		// //newLeft=$("#chatRoom")[0].offsetLeft;
		// var newLeft,newTop,isMove=false;
		// $("#chatRoom").mousedown(function(e){
		// 	isMove=true;
		// });
		// $("#chatRoom").mousemove(function(e){
		// 	if(isMove){
		// 		var e = e|| window.event;
		// 		newLeft=e.clientX-eleW/2;
		// 		newTop=e.clientY-eleH/2;
		// 		console.log("上，左"+newTop+":"+newLeft);  
		// 		$("#chatRoom").css({"left":newLeft,"top":newTop}); 
		// 	}
		// });

		// $("#chatRoom").mouseup(function(){
		// 	isMove=false;
		// 	document.onmousemove = null;
  //         	document.onmouseup = null; 
		// });

	//判断是否进入可拖动区域
 	var onMovePoint=false;//是否移动到可拖动的中心点
 	$(document).mousemove(function(e){
		eleH=$("#chatRoom").outerHeight();
		eleW=$("#chatRoom").outerWidth();
		eleTop=$("#chatRoom")[0].offsetTop;
		eleLeft=$("#chatRoom")[0].offsetLeft;
		var limitX=[eleLeft+eleW/2-15,eleLeft+eleW/2+15];//设定可识别水平范围
		var limitY=[eleTop+eleH/2-15,eleTop+eleH/2+15];//设定可识别竖直范围
		var eX=e.clientX;
		var eY=e.clientY; 

		if (eX>=limitX[0]&&eX<=limitX[1]&&eY>=limitY[0]&&eY<=limitY[1]) {
			//console.log("onMovePoint bingo");
			$("#chatRoom").css({cursor:"pointer"});
			onMovePoint=true;//移动到可拖动的中心点,可以点击拖动  
		}
		else{
			$("#chatRoom").css({cursor:"auto"});
			onMovePoint=false;//没有移动到可拖动的中心点
		}
	});

	//拖动元素
	var newLeft,newTop,isMove=false;  
	$("#messages").mousedown(function(e){ 
		isMove=true;//开启可点击状态移动标志
		//console.log("isMove bingo");
	});
	//移动元素
	$("#chatRoom").mousemove(function(e){
		if(isMove&&onMovePoint){
			//console.log("double bingo");
			var e = e|| window.event;
			newLeft=e.clientX-eleW/2;
			newTop=e.clientY-eleH/2; 
			$("#chatRoom").css({"left":newLeft,"top":newTop}); 
		}
	});
	$("#chatRoom").mouseup(function(){
		isMove=false; 
	}); 
 
	function dropElement(elem){
		//console.log("宽，高"+eleW+":"+eleH);
		//newTop=$(elem)[0].offsetTop;
		//newLeft=$(elem)[0].offsetLeft;
		var newLeft,newTop,isMove=false; 

		$(elem).mousedown(function(e){
			isMove=true;
			console.log("isMove bingo");
		});
		$(elem).mousemove(function(e){
			if(isMove&&onMovePoint){
				console.log("double bingo");
				var e = e|| window.event;
				newLeft=e.clientX-eleW/2;
				newTop=e.clientY-eleH/2;
				//console.log("上，左"+newTop+":"+newLeft);  
				$(elem).css({"left":newLeft,"top":newTop}); 
			}
		});
		$(elem).mouseup(function(){
			isMove=false;
			document.onmousemove = null;
          	document.onmouseup = null; 
		});
	} 
})