//var socket = io.connect("http://wcdemo.in.3322.org:17639");//根据本地ip配置 公云
//var socket = io.connect("192.168.1.103:3000");//根据本地ip配置，可以在同一网络环境下进行访问
var socket = io.connect();//本机多浏览器窗口测试
//var socket = io(); //这种只能本地运行127.0.0.1:3000/index.html访问
//console.log(socket.id);//在内部可以获得
var user={userid:null,username:null,socketid:null};//用户信息 
/*用户登录事件*/	
	// 点击登录按钮
	$('#login').click(function(){
		//登录事件 
		$(document).attr("title","【"+$('#n').val()+"】的聊天");//修改title值
		preName=$('#n').val();//预存储 用户昵称 发送服务器
		//preId=escape(clock());//预存储 用户唯一标识userid 并简单加密 发送服务器
		preId=socket.id;//用户唯一标识socketid 并简单加密 发送服务器
		user.userid=preId;//后面判断是都为自己的客户端时用
		var localId='';
	 	//socket.emit('name','data'); //emit()格式:参数两个，‘事件名’，‘传递的数据’
	 	if(preName!=""&&preName!=" "){
	 		//alert(user.userid)
			/*localId:如果用原用户名，则本地查询是否存在以这个uname为key的localstorage，如果存在，userid=该key的val；否则，userid=该用户本次随机生成的userid*/
			if(localStorage.getItem(preName)==null){
				localId=preId;
			}
			else{ 
				localId=localStorage.getItem(preName);
			} 
			//alert(preName+" 对应的localID:"+localId);
			socket.emit('login',{userid:localId,username:preName});  
	 		$("#send").removeAttr("disabled");//消息发送按钮可用
	 		$(this).attr("disabled", true);//登录按钮不可用
	 		$("#logout").html(preName+" | Exit");
	 		$("#toolBarSlider").html("Welcome "+preName +' ,欢迎来到C-chat！');
	 		$("#hideUname").val(preName);//在隐藏文本框内容存储用户名
	 		$("#logout").removeAttr("disabled");  //退出按钮可用 
	 		$("#loginBox").hide(); 
	 		$("#onChatBox").show(); 
			$("#chatRoom").show();
	 		$("#whiteBoard").show();
	 		$("#toolBar").show();
	 		$("#toolBarSlider").show();
	 		myscreen();  
	 	}
	 	else{  
	 		alert("错误操作!", "请输入用户名!", function () {
                //after click the confirm button, will run this callback function
            }, {type: 'error', confirmButtonText: 'OK'});
	 		return;
	 	} 
	}); 


	//服务端响应回来的login事件  
	socket.on('login', function(obj){  
		var flag = obj.flag;
		//alert(flag);
		var newName = obj.name;
		var randName = obj.rName;
		var rId = obj.id;//该客户端
		var ulist= obj.ulist; 
		var ulistLength = ulist.length;//获取用户列表的长度
		var i=0,m=0;  
		var localId = '';
		if(localStorage.getItem(newName)==null){
			localId=rId;
		}
		else{
			localId=localStorage.getItem(preName);
		} 
		//alert(newName+" 对应的localID:"+localId);
	if(flag=='0'){//不重复
		if(localId==rId){//个人客户端 
			alert("老用户"); 
			localStorage.setItem( newName, rId );//确认不重复，在本地设置个人信息存储 name，id 
			//更新在线人员列表  
			$('#userlist').html("<li>【Online】</li>");//更新在线列表 
			for(;i<ulist.length;i++){
				if(ulist[i].uname!='null'){
					m++;
					var userlistNotic = "<li><a style='background-color:rgb(130, 224, 255);' class='username' onclick='userlistClick()'>C"+m+":"+ulist[i].uname+"</a><li>"
					$('#userlist').append(userlistNotic);  
				}  
			}
			$('#showUserlist').html("Online:"+m+"s");

			//个人客户端提示登录
			var selfinNoticeshow = '<li class="notice">Hi,[ '+newName+' ] have a good time!</li>';
			$('#messages').append(selfinNoticeshow);  
			msgScroll();
		}
		else{//他人客户端显示用户登录
			$('#userlist').html("<li>【Online】</li>");//更新在线列表  
			//更新在线人员列表
			for(;i<ulist.length;i++){
				if(ulist[i].uname!='null'){
					m++;
					var userlistNotic = "<li><a  style='background-color:rgb(130, 224, 255);' class='username' onclick='userlistClick()'>C"+m+":"+ulist[i].uname+"</a><li>"
					$('#userlist').append(userlistNotic);  
				}  
				
			}
			$('#showUserlist').html("Online:"+m+"s");
			//他人客户端提示登录
			var msgSound3 = $('#myAudio3')[0];
		 	msgSound3.play();
			var otherinNoticeshow = '<li class="notice">welcome [ '+newName+' ] coming C+hat! [Ol:'+m+']</li>';
			$('#messages').append(otherinNoticeshow);  
			msgScroll();  
		}

	}
	else if(flag=='1'&&user.userid==rId){//用户名非法（重复） 
		//重复 
		//alert(rId);
		//alert(newName+"已经被使用，请君再试！您觉得 "+randName+" 如何？");
		//window.location.reload();   
 			confirm(
                "用户名重复",
                newName+"已经被使用，请君再试！\n您觉得 "+randName+" 如何？",
                function(isConfirm){
                    if (isConfirm) { 
                        //window.location.reload(); 
                        $(document).attr("title","【"+randName+"】的聊天");//修改title值 
						//preId=escape(clock());//预存储 用户唯一标识userid 并简单加密 发送服务器
						preId=socket.id+'RenAmE';//用户唯一标识socketid 并简单加密 发送服务器
						user.userid=preId;//后面判断是都为自己的客户端时用
                        socket.emit('login',{userid:preId,username:randName});
                        $("#logout").html(randName+" | Exit");
	 					$("#toolBarSlider").html("Welcome "+randName +' ,欢迎来到C-chat！');
	 					$("#hideUname").val(randName);//在隐藏文本框内容存储用户名
                    } 
                    else {
                        alert(
			                "不服啊！",
			                "起点传送门！",
			                function(){
			                	window.location.reload(); 
			                },
			                {
			                    width:300,height:230,type:'info',confirmButtonText:'OK'
			                }
			            )
                    }
                },
                {
                    width:300,height:230,type:'question',confirmButtonText:'YES',cancelButtonText:'NO'
                }
            ); 
	}
	else if(flag=='2'){//新用户,用户名合法
		if(user.userid==rId){
			localStorage.setItem( newName, rId );//对该用户名进行本地记录
			user.userid=rId;
			user.username=newName; 
			alert("新用户:您的用户信息如下\nid:"+user.userid+"\nname:"+user.username);
			$('#userlist').html("<li>【Online】</li>");//更新在线列表  
			//更新在线人员列表  
			for(;i<ulist.length;i++){
				if(ulist[i].uname!='null'){
					m++;
					var userlistNotic = "<li><a  style='background-color:rgb(130, 224, 255);' class='username' onclick='userlistClick()'>C"+m+":"+ulist[i].uname+"</a><li>"
					$('#userlist').append(userlistNotic);  
				}  
			}
			$('#showUserlist').html("Online:"+m+"s");

			//个人客户端提示登录
			var selfinNoticeshow = '<li class="notice">Hi,[ '+newName+' ] have a good time!</li>';
			$('#messages').append(selfinNoticeshow);  
			msgScroll();   
		}
		else{
			$('#userlist').html("<li>【Online】</li>");//更新在线列表  
			//更新在线人员列表
			for(;i<ulist.length;i++){
				if(ulist[i].uname!='null'){
					m++;
					var userlistNotic = "<li><a  style='background-color:rgb(130, 224, 255);' class='username' onclick='userlistClick()'>C"+m+":"+ulist[i].uname+"</a><li>"
					$('#userlist').append(userlistNotic);  
				}  
				
			}
			$('#showUserlist').html("Online:"+m+"s");
			//他人客户端提示登录
			var msgSound3 = $('#myAudio3')[0];
		 	msgSound3.play();
			var otherinNoticeshow = '<li class="notice">welcome [ '+newName+' ] coming C+hat! [Ol:'+m+']</li>';
			$('#messages').append(otherinNoticeshow);  
			msgScroll();  
		} 
	}
}); 

//退出按钮事件
$('#logout').click(function(){
	confirm(
        "退出",
        "真的要离开了吗？",
        function(isConfirm){
            if (isConfirm) {
                $("#login").removeAttr("disabled");//登录可用
				$(this).attr("disabled", true);//退出按钮不可用
				$("#send").attr("disabled", true);//发送按钮不可用
				$("#n").val("");
	 		    $("#toolBarSlider").html("welcome!");
				$(document).attr("title","C+hat");//修改title值
				$("#onChatBox").hide(); 
				$("#chatRoom").hide();
				$("#whiteBoard").hide();
				$("#faceBoard").hide();
				$("#toolBar").hide(); 
				$("#toolBarSlider").hide(); 
				$("#loginBox").show(); 
				//var localId=localStorage.getItem(user.username);
				//alert("name=:"+user.username+",id="+localId);
				socket.emit('logout',{id:user.userid,name:user.username});  
				$(this).html("Exit");
            } else { 
                alert("没事儿别乱点！")
            }
        },
        {
            width:300,height:230,type:'question',confirmButtonText:'YES',cancelButtonText:'NO'
        }
    );

});  

//服务端响应回来的logout事件 
socket.on('logout', function(obj){  
	//更新在线人员列表
	$('#userlist').html("<li>【Online】</li>");//更新在线列表  
	var ulist= obj.ulist; 
	var ulistLength = ulist.length;//获取用户列表的长度
	var i=0,m=0;  
	for(;i<ulist.length;i++){
		if(ulist[i].uname!='null'){
			m++;
			var userlistNotic = "<li><a  style='background-color:rgb(130, 224, 255);' class='username' onclick='userlistClick()'>C"+m+":"+ulist[i].uname+"</a><li>"
			$('#userlist').append(userlistNotic);  
		}  
		
	}
	$('#showUserlist').html("Online:"+m+"s");
	//广播给所有人 某某某退出聊天室
	if(obj.uid==user.userid){
		localStorage.removeItem(obj.uname);//清除c的值  
		var outNotice = '<li class="notice" >You have left C+hat!</li>';
		$('#messages').append(outNotice);
		msgScroll();
		alert("走好！");
		setTimeout(function(){
			window.location.reload();
		},1000)
	}else{	
		var msgSound3 = $('#myAudio3')[0];
	 	msgSound3.play();  
		var outNotice = '<li class="notice">[ '+obj.uname+' ] said Goodbye to everybody and left!</li>';
		$('#messages').append(outNotice);
		msgScroll();  
	}    
});	


/*单聊/群聊 singlechat*/ 
var flag = '0';//表示群聊  
$("#send").click(function(){
	
console.log(socket.id);			
	var msg = $('#m').val();
	if(msg!=""&&msg!=" "){
 		$("#send").removeAttr("disabled");
 		var a = msg.indexOf("@");
 		var b = msg.lastIndexOf("@");
 		if(a==b&&a!=-1){//判断是否含有且只有 @ 符号，有说明是私聊
 			var thename = msg.split("@")[0];//获取私聊对象昵称
 			//alert(thename);
 			flag = '1';  
 		}
 		else{
 			flag = '0';
 		}
		socket.emit('singlechat', {fromuid:user.userid,fromuname:user.username,frommsg:msg,toname:thename,flag:flag}); 
		$('#m').val("");
		return false;
	}
	else{ 
 		alert("你想说啥？");
 		return false;
 	} 
 });
//服务端响应回来的singlechat事件
socket.on('singlechat', function(smsgObj){
	//把聊天内容广播给所有人  逻辑处理：1判断是私聊还是群聊；2判断是个人发送的数据还是他人发送的数据；
	//smsgObj对象的内容包括userid,username,msg等信息； 
	//alert(smsgObj.flag);
	if(smsgObj.flag=='1'){//说明是私聊
		if(smsgObj.tname==user.username){//说明消息是某人发给我的 
			var themsg = smsgObj.fmsg.split("@")[1];//获取私聊对象昵称
			var frommsg = '<li style="background:coral;color:white;">[<span class="msg_uname">'+smsgObj.fname+'</span>] 对你说:'+themsg+'<br>'+clock()+'<a class="atYou" onclick="atYouMsg(\''+smsgObj.fname+'\')">@Ta'+'</a></li>';
	 		$('#messages').append(frommsg);
	 		rgb();//设置消息色彩
	 		var msgSound4 = $('#myAudio4')[0];
	 		msgSound4.play();
			msgScroll();
		}
		else{
			if(smsgObj.fid==user.userid){//说明消息自己发送的
				var sendSmsg = '<li style="background:#1E90ff;color:white;">['+smsgObj.fname+'</span>]:'+smsgObj.fmsg+'<br>'+clock()+'</li>';
				$('#messages').append(sendSmsg);  
				//下方代码使得消息自动向下滚动到最近的一条 (让消息保持在底部)
			 	msgScroll();
			}
			else{ //这个也许去掉更好，因为私聊的话，聊天室一直提示也不好。
				var tips = '<li style="background: black;color:white;">有人私下勾搭'+smsgObj.tname+' 哟~<br>'+clock()+'</li>' ;
				$('#messages').append(tips); 
				msgScroll();
				var msgSound1 = $('#myAudio1')[0];
	 			msgSound1.play(); 
			}

		}
	}
	else{//群聊
		//那就群聊
		if(smsgObj.fid==user.userid){//自己发的群聊 个人客户端显示 
			var msgDate = smsgObj.fmsg;
			if(msgDate.indexOf("↓")!=-1){//判断是否发送的是图片信息
				var msgSrc = smsgObj.fmsg.split("↓")[1];//取↓符号后面的内容
				var sendMsg = "<br><img onclick='imgBig()' class='imgMsg' src='"+msgSrc+"' style='max-width:300px;'/>";//图片信息
			}
			else{
				sendMsg=smsgObj.fmsg;//文字信息
			}
			 
			var groupMsg1='<li  class="msgli" style="background:#1E90FF;color:white">['+smsgObj.fname+']:'+sendMsg+'<br>'+clock()+'</li>';
			$('#messages').append(groupMsg1);  
			//下方代码使得消息自动向下滚动到最近的一条 (让消息保持在底部)
		 	msgScroll();
		}
		else{//个人\他人 发的群聊 个人\他人客户端显示
			var msgSound2 = $('#myAudio2')[0];
	 		msgSound2.play(); 
			var msgDate = smsgObj.fmsg;
			if(msgDate.indexOf("↓")!=-1){//判断是否发送的是图片信息
				var msgSrc = smsgObj.fmsg.split("↓")[1];//取↓符号后面的内容
				var sendMsg = "<br><img onclick='imgBig()' class='imgMsg' src='"+msgSrc+"' style='max-width:300px;'/>";//图片信息
			}
			else{
				sendMsg=smsgObj.fmsg;//文字信息
			}
	 		var groupMsg2='<li class="msgli" style="background:#fff;color:black">[<span class="msg_uname">'+smsgObj.fname+'</span>]:'+sendMsg+'<br>'+clock()+'<a class="atYou" onclick="atYouMsg(\''+smsgObj.fname+'\')">@Ta'+'</a></li>';
			$('#messages').append(groupMsg2);  
			rgb();//设置消息色彩
			msgScroll();
		}
	} 
});	 

//服务器重启
var count=61; 	
socket.on('restart', function(obj){  
	var TF = obj.flag; 
	
	if(TF=='0'){
		count--; 
		outNotice = '<li class="notice" style="background-color:red;color:white;">[系统通知:] 系统将于'+count+'s后重新启动，请做好下线准备！</li>';
		$('#messages').append(outNotice); 
		
		msgScroll();
	}
	else if(TF=='1'){
		var outNotice = '<li class="notice" style="background-color:red;color:white;">[系统通知:] 系统已重新启动,5s后全体重新登录！</li>';
		$('#messages').append(outNotice); 
		msgScroll();   
		localStorage.removeItem(user.username);//清除c的值
		setTimeout("window.location.reload();",5000);
	}  
});


/*消息框内容滚动*/
function msgScroll(){
	var mscrollHeight = $('#messages')[0].scrollHeight;
	//var mscrollTop = $('#messages');
	//mscrollTop.scrollTop(10);
	// alert(mscrollHeight);
	// alert(mscrollTop)
	$('#messages').scrollTop(mscrollHeight);
}

/*日期、日期时间 函数*/
// 获取日期函数
function show(){
   var mydate = new Date();
   var str = "" + mydate.getFullYear() + "年";
   str += (mydate.getMonth()+1) + "月";
   str += mydate.getDate() + "日";
   return "I am"+str;
}
function clock(){
	//输出星期
	var mydate=new Date();
	var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
	//输出年月日，时间
	var myyear= mydate.getFullYear();
	var mymonth = mydate.getMonth()+1;
	var myday = mydate.getDate();			
	var h = mydate.getHours();
	var m = mydate.getMinutes();
	var s = mydate.getSeconds();
	m = checkTime(m)
	s = checkTime(s)
	var dateTime = myyear+"年"+mymonth+"月"+myday+"日"+" "+weekday[mydate.getDay()]+" "+h+":"+m+":"+s;
	return dateTime; 
}
setInterval(clock,1000);
//规范时间显示格式，如果分，秒小于10，则补零达到2位显示
function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}
	return i
}

/*键值对数组定义、操作*/
//自定义字典对象
function KeyValueArr(){
 	this.data = new Array();
 
	this.put = function(key,value){
	  	this.data[key] = value;
	 };

	this.get = function(key){
	 	 return this.data[key];
	 };

	this.remove = function(key){
	  	this.data[key] = null;
	 };
	 
	this.isEmpty = function(){
	  	return this.data.length == 0;
	 };

	this.size = function(){
	  	return this.data.length;
	 };
}
/*聊天列表用户单击事件*/
function userlistClick(){ 
	$(".username").each(function (index) {
		$(this).click(function(){
			$(this).css("color","red");
			var str = $(this).html();
			var name=str.split(":");//提取目标名称 
				var thename = name[1];
				$('#m').val(thename+"@");
				$('#m').focus();
		});
	});
} 
/*聊天消息框快速回复@Ta事件*/
function atYouMsg(atName){ 
	// var name; 
	// $(".atYou").click(function(){
	// 	name = $(this).parent(".msgli").find('.msg_uname').html();
	// 	console.log("获取到的span："+$(this).parent(".msgli").find('.msg_uname').attr("class")); 
	// 	console.log("获取到的name："+name);
		$('#m').val(atName+"@");
		$('#m').focus();  
	// });
} 

//隐藏、显示在线列表 
$("#showUserlist").click(function(){
  	$('#userlist').animate({width:'toggle'},300);
  	$('#messages').animate({width:'toggle'},300);
});
$("#userlist").mouseover(function(){
	$(this).show();  
	$('#messages').hide(); 
});
//鼠标移开列表，隐藏列表
$("#userlist").mouseout(function(){
	$(this).hide(); 
	$('#messages').show(); 
});




//视频聊天 隐藏或显示白板 并进入FaceTime
var blobSrc="",vi,vfps=60,isVidow=false;
var mediaStream = null,track = null;

//向服务端推送视屏流
function pushVideo(){ 
	var canvas=$("#draw")[0];//获取要共享的画布 
	var imgStream = canvas.toDataURL("image/png");//将canvas数据转换成数据流
	socket.emit('pushCanvas',{uid:user.userid,uname:user.username,imgStream:imgStream}); 
	//console.log(user.username+":向服务器发送了imgStream:↓"+imgStream.slice(0,20));  
}

$("#facetime").click(function(){
	if ($(this).html()=="FaceTime") {
		isVidow=true; 
		vi = setInterval(pushVideo,vfps);//设定定时刷新重绘canvas 
		$(this).html("StopVideo");
	}else{
		isVidow=false;
		clearInterval(vi);
		socket.emit('stopPushCanvas',{uid:user.userid,uname:user.username}); 
		$(this).html("FaceTime");
	}

 
	//$("#faceBoard").toggle(200);  
	//获取本地视频流
	navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia; 
 
	if (navigator.getUserMedia) {
	   navigator.getUserMedia({ audio: true, video: { width: 100, height: 70 } },
		  function(stream) {
		  	console.log(stream);
		  	//获取本地video标签
			var video = $("#myself")[0];
			blobSrc=window.URL.createObjectURL(stream); //把视频流转换成video可以识别的URL
			video.src = blobSrc;//本地摄像头视频显示
			
			//本地视频播放及同步 
			video.onloadedmetadata = function(e) {
				video.play(); 
				//将视频同步到画布上，并通过共享同步到各个客户端
				var canvas=document.getElementById("draw");
				var draw=canvas.getContext("2d");
				window.setInterval(function () {
	                draw.drawImage(video, 0, 0,988,650);
	            }, vfps);
			}; 

			//将视频流数据发给服务器 (将stream转成URL发送改成直接发送stream到服务器,客户端收到之后再转成URL)
			//socket.emit('videotalk',{uid:user.userid,uname:user.username,ublob:blobSrc}); 
			//console.log(user.username+":向服务器发送了blob:"+window.URL.createObjectURL(stream));  
		  },
		  function(err) {
			isVidow=false;
			clearInterval(vi); 
			$("#facetime").html("FaceTime");
		  	socket.emit('videoFailed',{uid:user.userid,uname:user.username,errmsg:err.name});
		  	alert("尚未发现摄像头:"+err.name);
			console.log("The following error occurred: " + err.name);
		  }
	   );
	} 
	else{
	    console.log("getUserMedia not supported");
	    isVidow=false;
		clearInterval(vi); 
		$("#facetime").html("FaceTime");
	    return ;
	} 
});
 

//接受到来自服务器推送的其他用户的视频流
// var canvas=document.getElementById("localVideo");
// var ctx=canvas.getContext("2d"); 
// socket.on('videotalk',function(blobData){
// 	console.log("接收到了服务器的blob:"+blobData.note+":"+blobData.ublob); 
// 	//获取服务端推送的视频流stream
// 	var getStream=blobData.ublob;//是一个来自某个客户端视频的stream数据
// 	//var blobSrc=window.URL.createObjectURL(getStream); //把视频流转换成video可以识别的URL 
// 	console.log("turn to url:"+blobSrc);
// 	//客户端创建新的video标签用于显示视频数据
// 	var newOthersVideo = $("<video class='others' id='' autoplay='autoplay' ></video>");
// 	newOthersVideo.attr("src",getStream);//将视频流转换的URL绑定到该video标签上
// 	newOthersVideo.attr("id", blobData.uname);		
// 	$("#faceBoard").append(newOthersVideo);

// 	//该新增视频播放 
// 	newOthersVideo.onloadedmetadata = function(e) {
// 		newOthersVideo.play(); 
// 	};  
// }); 





///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////画布共享//////////////////////////
var isShare=false,i,fps=13;//分别是：是否开启屏幕共享、计时器、刷新频率
//var img=new Image();//图像对象用于接收来自他人的共享画面
$("#draw").on("mousedown mouseup",function(e){
	if (e.type==='mousedown'&&isShare==true) {
		//如果开启了屏幕共享，并且按下鼠标按键，则继续发送画布数据
		i = setInterval(pushCanvas,fps)
	}
	if (e.type==="mouseup") {
		//如果没有关闭屏幕共享，而鼠标按键抬起，则暂停共享
		clearInterval(i); 
	}
});

//是否开启屏幕共享
$("#shareCanvas").click(function(){
	if ($(this).val()=="画布共享") {
		isShare=true; 
		//i = setInterval(pushCanvas,fps);//设定定时刷新重绘canvas 
		$(this).val("停止共享");
	}else{
		isShare=false;
		stopInterval(i);
		$(this).val("画布共享");
	}
}); 
/*********************开始共享**************************/ 
// 封装获取、推送canvas数据流方法 
var a=0;
function pushCanvas(){
	console.log(a++);
	var canvas=$("#draw")[0];//获取要共享的画布 
	var imgStream = canvas.toDataURL("image/png");//将canvas数据转换成数据流
	socket.emit('pushCanvas',{uid:user.userid,uname:user.username,imgStream:imgStream}); 
	//console.log(user.username+":向服务器发送了imgStream:↓"+imgStream.slice(0,20));  
}

//客户端接收服务端推送的canvas数据流
socket.on('pushCanvas',function(canObj){  
	if(canObj.fuid!=user.userid){ 
		showCanvasShare(canObj.fcanvas);//调用自定义插件 全屏显示共享画面
		//getImageToCanvas(canObj.fcanvas);
		//console.log('接收来自'+canObj.fuid+'的数据'); 
	}
});

//将画布数据输出到本地canvas 
function getImageToCanvas(fcanvas) { 
	//var canvas=document.getElementById("draw");
	//var draw=canvas.getContext("2d");
	//draw.drawImage(fcanvas,0,0);//获取到的图像数据绘制到canvas上 
}

/*********************停止共享**************************/  
//向服务器发送 停止canvas共享 事件
function stopInterval(i){
	socket.emit('stopPushCanvas',{uid:user.userid,uname:user.username}); 
	clearInterval(i); 
	console.log(user.username+"停止了共享"); 
	$('.newImgBox').remove();
}

//客户端接收服务端推送的 停止canvas共享事件   
socket.on('stopPushCanvas',function(stopCanObj){ 
	if(stopCanObj.fuid==user.userid){ 
		alert('你已经停止了画布共享~');
	}
	else{
		console.log(stopCanObj.funame+"停止了共享"); 
		//$("body").remove(img);
		$('.newImgBox').remove();
	}
}); 

////////////画布共享结束////////////////////////////////////////////////////////////////////////////////////
//背景颜色 
function rgb() {   
	var R = Math.ceil(Math.round(255)*Math.random());
	var G = Math.ceil(Math.round(255)*Math.random());
	var B =Math.ceil(Math.round(255)*Math.random());  
	var bgColor = "rgb("+R+","+G+","+B+")";//背景颜色
	var fontColor = "rgb("+(255-R)+","+(255-G)+","+(255-B)+")";//字体颜色,是背景颜色的反色 

	//设置颜色 设置新生成的消息记录色彩
	$(".msgli:last").each(function (index) { 
		$(this).css("background-color",bgColor);
		$(this).css("color",fontColor); 
	});
} 
//var k = setInterval("rgb()",5000);

// 点击聊天列表的图片变大显示
function imgBig(){
	$(".imgMsg").each(function (index) {
	 	$(this).click(function(){
	 		$(this).css('left','10px');
	 		$(this).animate({width:'300'},150);
	 		$(this).animate({height:'250px'},150); 
	 	}).mouseout(function(){
	 		$(this).animate({width:'100'},150);
	 		$(this).animate({height:'80px'},150); 
	 	});
	});
} 

