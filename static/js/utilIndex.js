/**
 * Created by a on 2017/7/6.
 */

// 公共的一些函数
var utilIndex = {
    //  公共轮播
    swiper: function (swiperName, box, point, pre, next) {
        swiperName = new Swiper(box, {
            autoplay: 3000,
            speed: 300,
            loop: true,
            pagination: point,
            paginationClickable: true,
            progress: true,
            autoplayDisableOnInteraction: false,
        });
        $(pre).click(function () {
            swiperName.swipePrev();
            return false;
        });
        $(next).click(function () {
            swiperName.swipeNext();
            return false;
        });
    },

    // 公共的Ajax
    myAjax: function (param) {
        var loading;
        $.ajax({
            type: param.method || "POST",
            url: '../../imarad/' + param.url,
            data: param.postData || null,
            dataType: "json",
            cache: false,
            async: param.async || true,
            timeout: 3000,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            beforeSend: function () {
                if (param.button) {
                    param.button.attr("disabled", true);
                }
                if (param.showAjaxLoading) {
                    utilIndex.layer(function (layer) {
                        loading = layer.load(1, {shade: 0.1});
                    })
                }
            },
            success: function (data) {
                if (data) {
                    param.successFn(data);

                }
                if (param.button) {
                    param.button.attr("disabled", false)
                }
                if (param.showAjaxLoading) {
                    utilIndex.layer(function (layer) {
                        layer.close(loading)
                    })
                }
            },
            error: function (error) {
                if (error.statusText == 'Gateway Time-out' || error.statusText == 'timeout') {
                    utilIndex.layer(function (layer) {
                        layer.msg('服务器连接超时', {icon: 5, time: 2000, shade: 0.1, maxWidth: 180})
                    })
                } else {
                    var msg = $.parseJSON(error.responseText);
                    utilIndex.layer(function (layer) {
                        layer.msg(msg.msg, {icon: 5, time: 2000, shade: 0.1, maxWidth: 220})
                    });
                }
                if (param.errorFn) {
                    param.errorFn(error)
                }
                if (param.button) {
                    param.button.attr("disabled", false)
                }
                if (param.showAjaxLoading) {
                    utilIndex.layer(function (layer) {
                        layer.close(loading)
                    })
                }
            }
        })
    },

    // 获取地址栏参数
    getRequest: function () {
        var url = document.location.href; //获取url中"?"符后的字串
        var strs = url.split("=");
        return strs[strs.length - 1];
    },

    // 显示公共底部
    showFooter: function () {
        $('.footer-contanier').show();
        $('.footer-footer').show();
    },

    // layer弹出框
    layer: function (callBack) {
        layui.config({
            dir: 'static/layui/'
        });
        layui.use('layer', function () {
            var layer = layui.layer;
            callBack(layer)
        })
    },

    // code !== 0时的提示
    layerError: function (data, icon, maxWidth) {
        layui.config({
            dir: 'static/layui/'
        });
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.msg(data, {icon: icon, time: 2000, maxWidth: maxWidth, shade: 0.1})
        })
    },

    // laytpl 模板
    laytpl: function (tpl, data, id) {
        layui.config({
            dir: 'static/layui/'
        });
        layui.use('laytpl', function () {
            var laytpl = layui.laytpl;
            var getTpl = tpl.innerHTML;
            laytpl(getTpl).render(data, function (html) {
                id.innerHTML = html;
            });
        })
    },

    // 注销
    logOut: function (callBack) {
        utilIndex.myAjax({
            url: 'logout',
            successFn: function (res) {
                callBack();
            },
            errorFn: function (error) {

            }
        });
    }
}


$(function () {
    // 获取用户登录信息
    utilIndex.myAjax({
        url: 'user/get/userInfo',
        successFn: function (res) {
            if (res.code === 0) {
                if(res.data.headPicPath){
                    $('#headPortrait').attr('src','../../../imarad/image/'+res.data.headPicPath);
                }
                $('#userName').html(res.data.userName);
                $('.login-sign').hide();
                $('.login-sign-info').show();
            } else {
                $('.login-sign').show();
                $('.login-sign-info').hide();
            }
        },
        errorFn: function (error) {

        }
    });

    // 点击切换用户或者注销用户
    $('body').click(function (e) {
        $('.logout-and-handover-box').hide();
    });
    $('#headPortrait').click(function (e) {
        var e = e || window.event;
        if (e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
        $('.logout-and-handover-box').show();
    });
    // 点击注销
    $('#logout').click(function () {
        /* 向后台发送注销Ajax */
        utilIndex.logOut(function () {
            window.location.reload();
        })
    });
    // 回到顶部
    $(window).scroll(function () {
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop;
        if (scrollt > 200) {
            $(".return-top").fadeIn(400);
        } else {
            $(".return-top").stop().fadeOut(400);
        }
    });
    $("#gotop").click(function () {
        $("html,body").animate({scrollTop: "0px"}, 200);
    });
    /*解决router缓存问题*/
    function locationTo(position, distance) {
        $("html,body").animate({scrollTop: ($("#" + position).offset().top - distance)}, 500);
    };
    $('#toSomeProductAdvantage').click(function () {
        var str = document.location.href;
        if(str.substr(str.length - 11) !== 'liveService'){
            cookie.setCookie('id', 2, '/');
            window.location = "#liveService";
            if (navigator.appName === 'Microsoft Internet Explorer') {
                //判断是否是IE浏览器
                if (navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 8.0/i) ) {
                    //判断浏览器内核是否为Trident内核IE8.0
                    window.location.reload();
                }
            }
        }else{
            locationTo('productAdvantage', 0);
            cookie.delCookie('id', '/');
        }
    });
    $('#toSomeApplicationScenarios').click(function () {
        var str = document.location.href;
        if(str.substr(str.length - 11) !== 'liveService'){
            cookie.setCookie('id', 1, '/');
            window.location = "#liveService";
            if (navigator.appName === 'Microsoft Internet Explorer') {
                //判断是否是IE浏览器
                if (navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 8.0/i) ) {
                    //判断浏览器内核是否为Trident内核IE8.0
                    window.location.reload();
                }
            }
        }else{
            locationTo('applicationScenarios', 0);
            cookie.delCookie('id', '/');
        }
    })
    $('.aboutUs').click(function () {
        var str = document.location.href;
        window.location = "#aboutUs";
        if (str.substr(str.length - 7) !== 'aboutUs') {
            window.location.reload();
        }
    })
    if (navigator.appName === 'Microsoft Internet Explorer') {
        //判断是否是IE浏览器
        if (navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 8.0/i) ) {
            //判断浏览器内核是否为Trident内核IE8.0
            $('.triangle-up').hide();
            $('.nav-two-menu-box').css('top', '60px');
            $('.nav-three-menu-box').css('left', '245px');
            var str = document.location.href;
            $('.home').click(function () {
                if (str.substr(str.length - 4) !== 'home') {
                    window.location.reload();
                }
            });
            $('.liveService').click(function () {
                if (str.substr(str.length - 11) !== 'liveService') {
                    window.location.reload();
                }
            });
            $('.curstomerCase').click(function () {
                if (str.substr(str.length - 13) !== 'curstomerCase') {
                    window.location.reload();
                }
            });
            $('.onlineClassroom').click(function () {
                if (str.substr(str.length - 15) !== 'onlineClassroom') {
                    window.location.reload();
                }
            });
        }
        if (navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 9.0/i)) {
            //判断浏览器内核是否为Trident内核IE9.0
            $('.triangle-up').hide();
            $('.nav-two-menu-box').css('top', '60px');
            $('.nav-three-menu-box').css('left', '245px');
        }
    }
});




























