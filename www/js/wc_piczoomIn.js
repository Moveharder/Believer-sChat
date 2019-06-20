/**
 * Created by Administrator on 2016/10/19 0019.
 * 图片点击放大预览效果
 */
function showCanvasShare(canStream){
        var box=$(".newImgBox")[0];
        if(box!=null){
            $(".newImgBox img").attr("src",canStream);//指定新图片对象的图片路径
        }
        else{ 
             //创建全图预览的图片外层元素
            var imgbox="<div class='newImgBox'></div>";
            //创建关闭全图预览的图标
            var cloIcon="<button class='cloImgView'>×</button>";
            $("body").append(imgbox);
            $('.newImgBox').css({"position":"fixed","width":"100%","height":"100%","top":"0","left":"0","zIndex":"200",
                "border":"solid 2px mediumpurple","background":"rgba(255,255,255,0.7)","box-shadow": "0px 0px 2px 5px white inset"});
            var boxH = $('.newImgBox').css("height");//相框最大高度
            var boxW = $('.newImgBox').css("width");//相框最大宽度 
            var theImage = new Image();//创建新图片对象
            theImage.src = canStream;//指定新图片对象的图片路径
            var imageWidth = theImage.width;//原始图片的宽度
            var imageHeight = theImage.height;//原始图片的高度
            //如果原图图片宽高比大于一，则以宽为是否放大的标准。
            if(imageWidth>imageHeight){
                //如果原始尺寸大于屏幕尺寸 则适当的缩小图片
                if(imageWidth>parseInt(boxW)||imageHeight>parseInt(boxH)){
                    //计算缩小图片需要的宽高比
                    var wbh=imageWidth/imageHeight;
                    var needwbh=wbh*(parseInt(boxH)/parseInt(boxW));
                    zoomInW=parseInt(boxW)*needwbh+"px";
                    zoomInH=parseInt(boxH)+"px";
                }
                else{
                    //放大后的图片尺寸--宽,如果放大后会超出屏幕的宽度，则保持原始图片宽度
                    if(imageWidth<=parseInt(boxW)/2){
                        zoomInW=imageWidth*2+"px";
                        zoomInH=imageHeight*2+"px";
                    }
                    else{
                        zoomInW=imageWidth+"px";
                        zoomInH=imageHeight+"px";
                    }
                }
            }
            //如果图片宽高比小于一，则以高为是否放大的标准。
            else{
                //如果原始尺寸大于屏幕尺寸 则适当的缩小图片
                if(imageWidth>parseInt(boxW)||imageHeight>parseInt(boxH)){
                    //计算缩小图片需要的宽高比
                    var wbh=imageWidth/imageHeight;
                    var needwbh=wbh*(parseInt(boxH)/parseInt(boxW));
                    zoomInW=parseInt(boxW)*needwbh+"px";
                    zoomInH=parseInt(boxH)+"px";
                }
                else{
                    if(imageHeight<=parseInt(boxH)/2){
                        zoomInH=imageHeight*2+"px";
                        zoomInW=imageWidth*2+"px";
                    }
                    else{
                        //放大后的图片尺寸--高，如果放大后会超出屏幕的高度，则保持原始图片高度
                        zoomInH=imageHeight+"px";
                        zoomInW=imageWidth+"px";
                    }
                }
            }
            var imgWNum=parseInt(zoomInW)/2;//图片宽度数值一半
            var imgHNum=parseInt(zoomInH)/2;//图片高度数值一半
            var ml=-parseInt(zoomInW)/2;//用于水平居中的margin-left
            var mt=-parseInt(zoomInH)/2;//用于垂直居中的margin-top
            var cloIconL=(parseInt(boxW)/2+imgWNum-35)+"px";//关闭全图预览的图标的left
            var cloIconT=(parseInt(boxH)/2-imgHNum+10)+"px";//关闭全图预览的图标的top
            //说明：close图标的位置：top是屏幕高度的一半减去放大后的图片的高度的一半，再减去图标自身高度的一半。（left类似） 
            $('.newImgBox').append(cloIcon);
            $('.cloImgView').css({"zIndex":'900',"width":"30px","height":"30px","borderRadius":"15px","position":"fixed","left":cloIconL,"top":cloIconT,"cursor":"pointer","background":"black","color":"white","fontSize":"20px"});
            $(theImage).css({"zIndex":'100','width':zoomInW,'height':zoomInH,'position':'absolute','left':'50%','margin-left':ml,'top':'50%','margin-top':mt});
            $('.cloImgView').click(function(){
                $(this).parent().remove();
            });
            $('.newImgBox').append(theImage); 
    }
}

 