var express = require('express');
var app = express();
app.use(express.static('www')); /*关键点，静态路径的声明，客户端可以通过访问public下的文件夹/文件的形式引用（不用加public）*/
//文字聊天服务
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var server = http.createServer(app);

http.listen(80, function() {
    console.log('chat server running at *:80');
});
// var reload = require('auto-reload');
// var data = reload('server.js', 3600000); // 每 1hour重新加载一次



//文件、视频服务 
var server = require('http').createServer(app);
var SkyRTC = require('skyrtc').listen(server);
var path = require("path");
server.listen(3001, function() {
    console.log("skyrtc server running at *:3001");
});








//设置 主页聊天 路由
app.get('/index.html', function(req, res) {
    // var pathname = url.parse(request.url).pathname;
    //    console.log("Request for " + pathname + " received.");
    //res.writeHead(200, {"Content-Type": "text/html;charset:utf-8"});
    res.sendFile(path.resolve(__dirname , "../www/index.html"));
})

///////////////////////////////////////////////////


// process.on('uncaughtException', function(e) {
// 　　console.log(e);
// });
///////////////////////////////////////////////
//定义对象数组
var userList = new Array();
var userVideo = new Array(); //保存用户视频数据及id，name的数组
userList[0] = { uid: 'admin', uname: 'admin', sid: null, sayto: null }; //数据初始化  

console.log("用户列表当前长度：" + userList.length);
for (var i = 0; i < userList.length; i++) {
    console.log("name:" + userList[i].uname + ";ID:" + userList[i].uid);
}
//var uinfo = new KeyValueArr();
/*键值对数组定义、操作*/
//自定义字典对象
function KeyValueArr() {
    this.data = new Array();

    this.put = function(key, value) {
        this.data[key] = value;
    };

    this.get = function(key) {
        return this.data[key];
    };

    this.remove = function(key) {
        this.data[key] = null;
    };

    this.isEmpty = function() {
        return this.data.length == 0;
    };

    this.size = function() {
        return this.data.length;
    };
}
/*判断元素是否存在于某数组中*/
function contains(arr, e) {
    var i = arr.length;
    while (i--) {
        if (arr[i].uname === e) {
            return true;
        }
    }
    return false;
}

//获取某个数组中的某个属性是否存在
function getArrEle(myarr, myname, myid) {
    var arr = myarr;
    var name = myname;
    var id = myid;
    var i = myarr.length;
    while (i--) {
        if (arr[i].uname == name) {
            if (arr[i].uid == id) {
                return "0"; //没有重复,老用户 
            } else {
                return "1"; //用户名重复
            }
        } else {
            return "2"; //新用户，用户名不重复 
        }
    }
}

///////////////////////////////////////////////////
io.on('connection', function(socket) {
    console.log('someone has connected!');
    //注册一个 “登录” 事件  含判断昵称是否重复，重复处理
    socket.on('login', function(obj) {
        var uid = obj.userid;
        var newName = obj.username; //用户提交的名字
        //console.log(newName+",uid:"+uid+" 申请加入!");
        var randName = obj.username + Math.round(Math.random() * 10); //随机一个名字建议给用户
        var ulistLength = userList.length; //用户数量 
        var chkCode = getArrEle(userList, newName, uid); //调用函数查询是否用户名重复
        //console.log("checkCode:"+chkCode+";id:"+uid);
        if (chkCode == '1') {
            console.log("用户名重复！");
            io.emit('login', { flag: chkCode, name: newName, rName: randName, id: uid, ulist: userList }); //返回状态码，以及随机名字 
        } else if (chkCode == '0') { //老用户 
            console.log("欢迎" + newName + ",uid:" + uid + " 再次回来!"); //服务端监测到login事件，通知所有人  
            io.emit('login', { flag: chkCode, name: newName, id: uid, ulist: userList }); //向所有客户端广播用户加入(响应客户端的login事件)

        } else if (chkCode == '2') { //允许新用户注册
            console.log("新用户 NO." + ulistLength + "位学霸," + newName + ",uid:" + uid + " logined in!"); //服务端监测到login事件，通知所有人  
            var user = { uid: null, uname: null, sid: null, sayto: null };
            user.uname = newName;
            user.uid = uid;
            userList.push(user); //把新用户信息存入 userList 数组
            for (var i = 0; i < userList.length; i++) {
                console.log(userList[i].uname + ";id:" + userList[i].uid);
            }
            //uinfo.put(obj.userid,obj.username);//服务器存储个人数据 
            io.emit('login', { flag: chkCode, name: user.uname, id: user.uid, ulist: userList });
        }

    });



    //注册一个 "断开下线" 事件
    socket.on('disconnected', function() {
        console.log('someone has disconnected!');
    });

    //注册一个 logout 事件
    socket.on('logout', function(obj) {
        var j;
        for (j = 0; j < userList.length; j++) {
            if (userList[j].uname == obj.name && userList[j].uid == obj.id) {
                console.log("用户:" + userList[j].uname + "已经被删除!");
                userList.splice(j, 1); //从在线列表userList里删除该用户 
            }
        }
        io.emit('logout', { uname: obj.name, uid: obj.id, ulist: userList }); //一、向所有客户端广播用户退出(响应客户端的logout事件) 
        console.log(obj.name + "离开了聊天室！");
    });



    //注册一个“单聊or群聊”事件
    socket.on('singlechat', function(smsgObj) {
        if (smsgObj.toname != undefined) {
            console.log(smsgObj.toname + ' received a private msg from ' + smsgObj.fromuname + ' said:' + smsgObj.frommsg);
            //io.sockets.socket(smsgObj.tosid).emit('singlechat', {tomsg:gmsgObj.frommsg});
            io.emit('singlechat', { fid: smsgObj.fromuid, fname: smsgObj.fromuname, fmsg: smsgObj.frommsg, tname: smsgObj.toname, tid: smsgObj.toid, flag: smsgObj.flag }); //返回用户id和消息内容 
        } else {
            if (smsgObj.frommsg.length > 300) {
                console.log(smsgObj.fromuname + "send a long story");
            } else {
                console.log(smsgObj.fromuname + ' send a group msg:' + smsgObj.frommsg);
            }

            io.emit('singlechat', { fid: smsgObj.fromuid, fname: smsgObj.fromuname, fmsg: smsgObj.frommsg, tname: smsgObj.toname, tid: smsgObj.toid, flag: smsgObj.flag }); //返回用户id和消息内容 
        }
    });


    //注册视频聊天成功事件
    socket.on('videotalk', function(blobData) {
        console.log("recieve a blobdata from others,blob:" + blobData.ublob);
        //存储这些客户端的视频流
        var userStream = { uid: null, uname: null, ustream: null };
        userStream.uname = blobData.uname;
        userStream.uid = blobData.uid;
        userStream.ustream = blobData.ublob;

        //把新用户视频流及基本信息存入 userVideo 数组
        userVideo.push(userStream);

        //遍历这些数据流信息
        for (var i = 0; i < userVideo.length; i++) {
            console.log(userVideo[i].uname + ";ID:" + userVideo[i].uid + ",Ublob:" + userVideo[i].ustream);
        }

        //将数据流广播给客户端
        io.emit('videotalk', { uid: blobData.uid, uname: blobData.uname, ublob: blobData.ublob, note: 'othersVideoBlob', usersVideo: userVideo });
    });

    //监视聊天请求失败事件
    socket.on('videoFailed', function(vFailedmsg) {
        console.log("用户:" + vFailedmsg.uname + ",尝试发起视频聊天失败！原因:" + vFailedmsg.errmsg);
    });



    /////////////////////接收来自某个客户端的 画布共享事件////////////////////////////////////////////////////
    socket.on('pushCanvas', function(canObj) {
        io.emit('pushCanvas', { fuid: canObj.uid, funame: canObj.uname, fcanvas: canObj.imgStream });
        //console.log(canObj.uname+' is sharing');
    });

    ////////////////////接收来自某个客户端的 停止画布共享事件////////////////////////////////////////////////////
    socket.on('stopPushCanvas', function(stopCanObj) {
        io.emit('stopPushCanvas', { fuid: stopCanObj.uid, funame: stopCanObj.uname });
        console.log(stopCanObj.uname + ' stoped the sharing');
    });



});

//系统定时重启服务器
function getDate() {
    var sysdate = new Date(); //获取当前日期 
    var h = sysdate.getHours();
    var m = sysdate.getMinutes();
    var s = sysdate.getSeconds() + 1;

    var newH = 23 - h;
    var newM = 59 - m;
    var newS = 60 - s;
    var strTime = "今日倒计时" + newH + "时" + newM + "分" + newS + "秒";
    //return strTime;

    if (h == 23 && m == 59) {
        console.log('系统将于60s后重启，请全体做好下线准备！' + s);
        io.emit('restart', { flag: '0', ulist: userList });
        if (s == 59) {
            console.log('系统已重新启动,5s后全体客户端将重新登录！');
            io.emit('restart', { flag: '1', ulist: userList });
            // var reload = require('auto-reload');
            // var data = reload('server.js', 1000);  
            userList.length = 1;
            console.log("用户列表已清除");
        }
    }

}
setInterval(getDate, "1000");

/***********************************文件分享/视频聊天服务**************************************/

//视频聊天服务
// var SkyRTC = require('skyrtc').listen(http);
// var path = require("path");  
// app.use(express.static('public')) 

//设置 视频页面 路由
app.get('/video.html', function(req, res) {
    res.sendFile(path.resolve(__dirname , "../www/video.html"));
})

//设置 文件页面 路由
app.get('/sendfile.html', function(req, res) {
    res.sendFile(path.resolve(__dirname , "../www/sendfile.html"));
})

//设置 文件页面2 路由
app.get('/file.html', function(req, res) {
    res.sendFile(path.resolve(__dirname , "../www/file.html"));
})


SkyRTC.rtc.on('new_connect', function(socket) {
    console.log('创建新连接:video');
});

SkyRTC.rtc.on('remove_peer', function(socketId) {
    console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function(socket, room) {
    console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function(socket, msg) {
    console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function(socket, ice_candidate) {
    console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function(socket, offer) {
    console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function(socket, answer) {
    console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function(error) {
    console.log("发生错误：" + error.message);
});