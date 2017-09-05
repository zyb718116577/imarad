// 公共函数
var utilOther = {
    // 获取地址栏参数(最后一个？后的参数)
    getRequest: function () {
        var url = document.location.href; //获取url中"?"符后的字串
        var strs = url.split("?");
        return strs[strs.length - 1];
    },

    getType: function () {
        var strs = utilOther.getRequest().split('=');
        return strs[strs.length - 1];
    },

    getId: function () {
        var strs = utilOther.getRequest().split('=');
        return parseInt(strs[1]);
    },
    // 公共Ajax
    myAjax: function (param) {
        var async;
        if(param.async === false){
            async = false
        }else{
            async = true
        }
        var loading;
        $.ajax({
            type: param.method || "POST",
            url: '../../../imarad/' + param.url,
            data: param.postData || null,
            dataType: "json",
            cache: false,
            async: async,
            timeout: 5000,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            beforeSend: function () {
                if (param.button) {
                    param.button.attr("disabled", true);
                }
                if (param.showAjaxLoading) {
                    utilOther.layer(function (layer) {
                        loading = layer.load(1,{shade :0.1});
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
                if(param.showAjaxLoading){
                    utilOther.layer(function (layer) {
                        layer.close(loading)
                    })
                }
            },
            error: function (error) {
                if (param.errorFn) {
                    param.errorFn(error);
                }
                if (error.statusText == 'Gateway Time-out'|| error.statusText == 'timeout') {
                    utilOther.layer(function (layer) {
                        layer.msg('服务器连接超时', {icon: 5, time: 2000, shade: 0.1,maxWidth: 180})
                    })
                }else{
                    var msg = $.parseJSON(error.responseText);
                    utilOther.layer(function (layer) {
                        layer.msg(msg.msg, {icon: 5, time: 2000, shade: 0.1,maxWidth:220})
                    });
                }
                if (param.button) {
                    param.button.attr("disabled", false)
                }
                if(param.showAjaxLoading){
                    utilOther.layer(function (layer) {
                        layer.close(loading)
                    })
                }
            }
        })
    },

    // 注销
    logOut: function (callBack) {
        utilOther.myAjax({
            url: 'logout',
            successFn: function (res) {
                callBack();
            },
            errorFn: function (error) {

            }
        });
    },

    // 让IE8浏览器支持placeholder属性 
    JPlaceHolder: {
        //检测
        _check: function () {
            return 'placeholder' in document.createElement('input');
        },
        //初始化
        init: function () {
            if (!this._check()) {
                this.fix();
            }
        },
        //修复
        fix: function () {
            jQuery(':input[placeholder]').each(function (index, element) {
                var self = $(this), txt = self.attr('placeholder');
                self.wrap($('<div></div>').css({
                    position: 'relative',
                    zoom: '1',
                    border: 'none',
                    background: 'none',
                    padding: 'none',
                    margin: 'none'
                }));
                var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                var holder = $('<span></span>').text(txt).css({
                    position: 'absolute',
                    left: pos.left,
                    top: '15px',
                    height: h,
                    lienHeight: h,
                    paddingLeft: paddingleft,
                    color: '#aaa'
                }).appendTo(self.parent());
                self.focusin(function (e) {
                    holder.hide();
                }).focusout(function (e) {
                    if (!self.val()) {
                        holder.show();
                    }
                });
                holder.click(function (e) {
                    holder.hide();
                    self.focus();
                });
            });
        }
    },

    // 滑块验证
    graphicalVerification: function () {
        var $1 = function (selector) {
                return document.querySelector(selector);
            },
            box = $1('.drag'), //容器
            bg = $1('.bg'), //绿色背景
            text = $1('.text'), //文字
            btn = $1('.btn'), //拖动按钮
            done = false; //是否通过验证
        btn.onmousedown = function (e) {
            var e = e || window.event;
            var posX = e.clientX - this.offsetLeft;
            var _this = this;
            document.onmousemove = function (e) {
                var e = e || event;
                var x = e.clientX - posX;
                if(x > 0){
                    _this.style.left = x + 'px';
                    bg.style.width = _this.offsetLeft + 'px';
                }else{
                    _this.style.left = '0px';
                    bg.style.width = '0px';
                }
                // 通过验证
                if (x >= box.offsetWidth - btn.offsetWidth) {
                    done = true;
                    btn.onmousedown = null;
                    document.onmousemove = null;
                    text.innerHTML = '通过验证';
                    text.style.color = 'white';
                    btn.style.borderTopRightRadius = '3px';
                    btn.style.borderBottomRightRadius = '3px';
                    btn.style.left = '280px';
                    bg.style.width = '280px';
                    $('.img-verification').removeAttr('disabled');
                }
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                btn.onmouseup = null;
                if (done) return;
                btn.style.left = 0;
                bg.style.width = 0;
            }
        };
        text.onmousedown = function () {
            return false;
        };
    },

    // layer弹出框
    layer: function (callBack) {
        layui.use('layer', function () {
            var layer = layui.layer;
            callBack(layer)
        })
    },

    // code ！==0时的提示
    layerError: function (data,icon,maxWidth) {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.msg(data, {icon: icon, time: 2000, maxWidth: maxWidth, shade: 0.1})
        })
    },

    // laytpl 模板
    laytpl: function (tpl,data,id,callBack) {
        var back;
        if(typeof callBack == 'function'){
            back = callBack
        }else{
            back = function () {

            }
        }
        layui.config({
            dir: '../../../static/layui/'
        });
        layui.use('laytpl', function () {
            var laytpl = layui.laytpl;
            var getTpl = tpl.innerHTML;
            laytpl(getTpl).render(data, function (html) {
                id.innerHTML = html;
            });
            back();
        })
    },

}
    var userName;
    // 获取用户信息
    utilOther.myAjax({
        url: 'user/get/userInfo',
        async: false,
        successFn: function (res) {
            if (res.code === 0) {
                userName = res.data.userName;
                $('#userName').html(res.data.userName);
                if(res.data.headPicPath){
                    $('#userImg').attr('src','../../../imarad/image/'+res.data.headPicPath);
                }
                $('.header-info').show();
            } else {
                $('.login-sign').show();
            }
        },
        errorFn: function (error) {

        }
    });

// 点击显示(隐藏)注销和切换用户
    $('.header-info-center').click(function () {
        $('.logout-and-handover-box').show();
    });
    $('.stop').click(function () {
        $('.logout-and-handover-box').hide();
    })

// 点击注销
    $('#logout').click(function () {
        utilOther.logOut(function () {
            window.location.reload();
        });
    });
    window.onload = function () {
        changeDivHeight();
    };
    $(window).resize(function () {
        changeDivHeight();
    });
    function changeDivHeight() {
        if ($(window).width() > 1340) {
            $('.ardLive-video').css('width', 960);
            $('.ardLive-video').css('height', 580);
            $('.ardLive-comment').css('width', 380);
            $('.ardLive-comment').css('height', 580);
            $('.ardLive-comment').show();
        } else if ($(window).width() <= 960) {
            $('.ardLive-video').css('width', 960);
            $('.ardLive-video').css('height', 580);
            $('.ardLive-comment').hide();
        } else {
            $('.ardLive-video-box').css('height',($(window).width()) * 0.405 + 40);
            $('.ardLive-video').css('width', ($(window).width()) * 0.72);
            $('.ardLive-video').css('height', '100%');
            $('.ardLive-comment').css('width', ($(window).width()) * 0.28);
            $('.ardLive-comment').css('height', '100%');
            $('.ardLive-comment').show();
        }

    }
    // 滚动到一定距离显示小视屏
    /*$(window).scroll(function () {
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop;
        if (scrollt > 800 && $(window).width() > 1340) {
            $('.small-window').show()
        } else {
            $('.small-window').hide()
        }
    });*/

