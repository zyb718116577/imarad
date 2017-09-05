$(function () {
    // 类似pullPage的配置
    window.onload = function(){
        var mySwiper = new Swiper('.swiper-container',{
            speed:400,
            mode : 'vertical',
            resistance:'100%',
            loop:true,
            mousewheelControl : true,
            grabCursor: true,
            pagination: '.pagination',
            paginationClickable: true,
            onFirstInit:function(){
                $('.slide1').addClass('ani-slide');
            }
        })

        mySwiper.wrapperTransitionEnd(function () {//隐藏方法
            $('.ani-slide').removeClass('ani-slide')
            $('.swiper-slide').eq(mySwiper.activeIndex).addClass('ani-slide')
        },true);
    };
    // 判断用户是否登录(给予不同的显示)
    $.ajax({
        url: '../../../imarad/user/get/userInfo',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        type: "POST",
        dataType: "json",
        success: function (res) {
            if (res.code === 0) {
                $('#userName').html(res.data.userName);
                if(res.data.headPicPath){
                    $('.head-portrait').attr('src','../../../imarad/image/' + res.data.headPicPath );
                }
                $('.login-sign').hide();
                $('.login-sign-info').show();
            } else {
                $('.login-sign').show();
                $('.login-sign-info').hide();
            }
        },
        error: function (res) {

        }
    });
    // 点击切换用户或者注销用户
    $('.head-portrait').click(function (e) {
        var e = e || window.event;
        if(e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
        $('.logout-and-handover-box').show();
    });
    $('body').click(function (e) {
        $('.logout-and-handover-box').hide();
    });
    // 点击注销
    $('#logout').click(function () {
        /* 向后台发送注销Ajax */
        $.ajax({
            url: '../../../imarad/logout',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            type: "POST",
            dataType: "json",
            success: function (data) {
                window.location.reload();
            },
            error: function (res) {

            }
        });
    });
    // 点击跳转到产品与服务具体位置
    $('#toSomeApplicationScenarios').click(function () {
        window.location = "/index.html#liveService";
        cookie.setCookie('id',1,'/');
    });
    $('#toSomeProductAdvantage').click(function () {
        window.location = "/index.html#liveService";
        cookie.setCookie('id',2,'/');
    });
    // 处理IE8下hover事件的兼容性
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    var trim_Version = version[1].replace(/[ ]/g, "");
    if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0"){
        $('.nav-two-menu-box').css({'background':'','top':'80px','height':'172px'});
        $('.nav-two-menu').css({'top':'0px'});
        $('.triangle-up').hide();
        $('.nav-three-menu-box').css({'left':'245px','background':'white'})
    }
});
