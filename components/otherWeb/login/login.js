// 清空IE input标签刷新后有值问题
$(function () {
    $('#resetFirst').click();
    $('#resetTwo').click();
});
//回车事件
document.onkeydown = function (event) {
    var e = event || window.event;
    var flag = $('#sign3').hasClass('sign-active');
    if (e && e.keyCode == 13) { //回车键的键值为13
        if (!flag) {
            $('#accountSubmit').click();
        } else {
            if(document.all){  //只有ie识别
                e.cancelBubble=true;
                e.returnValue = false;
            }else{
                e.stopPropagation();
                e.preventDefault();
            }
            $('#iphoneSubmit').click();
        }
    }
};

// 让IE8浏览器支持placeholder属性
utilOther.JPlaceHolder.init();

// 点击切换手机登录和账号登录(样式的改变)
$('.sign').find('li').each(function (index) {
    $(this).click(function () {
        $(this).addClass('sign-active').siblings().removeClass('sign-active');
        if (index === 0) {
            $('.account').hide();
            $('.tel').show();
        } else {
            $('.account').show();
            $('.tel').hide();
        }
    })

})

// 不能输入空格(账户登录)
function nullTest(_this, index) {
    if ($.trim($(_this).val()) === '') {
        _this.value = '';
        $('.error').eq(index).show();
    } else {
        $('.error').eq(index).hide();
    }
}
$("#accountNumber").keyup(function () {
    var _this = this;
    nullTest(_this, 0);
});
$("#accountPassword").keyup(function () {
    var _this = this;
    nullTest(_this, 1);
});

// 点击账户登录
$('#accountSubmit').click(function () {
    var accountNumber = $('#accountNumber').val();           // 账号
    var accountPassword = $('#accountPassword').val();       // 密码
    var loginType;                                          // 登录类型
    var rememberMe;                                         // 是否自动登录
    if (accountNumber === '') {
        $('.error').eq(0).show();
    }
    if (accountPassword === '') {
        $('.error').eq(1).show();
    }
    if (accountNumber === '') {
        utilOther.layerError('请输入账号', 5, 180);
        return;
    }
    if (accountPassword === '') {
        utilOther.layerError('请输入密码', 5, 180);
        return;
    }
    // 发送登录Ajax
    utilOther.myAjax({
        url: 'login',
        postData: {
            loginName: accountNumber,
            loginPwd: accountPassword,
            loginType: '01',
            _remember_me: true,
        },
        button: $(this),
        showAjaxLoading: true,
        successFn: function (res) {
            if (res.code === 0) {
                window.location = '../../../index.html';
            } else {
                utilOther.layerError(res.msg, 5, 180);
            }
        },
        errorFn: function (error) {

        }
    })
});

// 验证是否输入手机号
function checkIphoneNumber() {
    $('.error').eq(2).show();
    if ((/^1[34578]\d{9}$/.test($('#iphoneNumber').val()))) {
        $('.error').eq(2).hide();
        // 滑块验证
        utilOther.graphicalVerification();
        $('.disgraceful').hide();
    } else {
        $('.disgraceful').show();
    }
}

// 不能输入空格(手机登录)
$("#iphoneNumber").keyup(function () {
    checkIphoneNumber();
    if ($.trim($(this).val()) === '') {
        this.value = '';
    }
});
$("#iphonePassword").keyup(function () {
    var _this = this;
    nullTest(_this, 3);
});

// 点击获取短信验证码
$('.img-verification').click(function () {
    var iphoneNumber = $('#iphoneNumber').val();
    var _this = this;
    if (!(/^1[34578]\d{9}$/.test(iphoneNumber))) {
        utilOther.layerError('请输入正确的手机号', 5, 220);
        return;
    }
    // 发送短信Ajax
    $(_this).attr('disabled', 'disabled');
    utilOther.myAjax({
        url: 'ability/send/codeToPhone',
        postData: {phone: iphoneNumber},
        showAjaxLoading: true,
        successFn: function (res) {
            if (res.code === 0) {
                var countdown = 5;
                $(_this).text('重新发送(' + countdown + ')');
                var that = _this;

                function setTime() {
                    if (countdown == 0) {
                        $(that).removeAttr('disabled');
                        $(that).text('获取验证码');
                        clearInterval(time);
                    } else {
                        countdown--;
                        $(that).text('重新发送(' + countdown + ')');
                    }
                }

                var time = setInterval(function () {
                    setTime()
                }, 1000);
            }
        },
        errorFn: function (error) {
            $(_this).removeAttr('disabled');
        }
    });
});

// 点击手机登录
$('#iphoneSubmit').click(function () {
    var iphoneNumber = $('#iphoneNumber').val();            //  手机号
    var iphonePassword = $('#iphonePassword').val();        //  验证码
    checkIphoneNumber();
    if (iphonePassword === '') {
        $('.error').eq(3).show();
    }
    if (!(/^1[34578]\d{9}$/.test(iphoneNumber))) {
        utilOther.layerError('请输入正确的手机号', 5, 220);
        return;
    }
    if (iphonePassword === '') {
        utilOther.layerError('请输入动态密码', 5, 200);
        return;
    }
    // 填写Ajax
    utilOther.myAjax({
        url: 'login',
        postData: {
            'loginName': iphoneNumber,
            'loginPwd': iphonePassword,
            'loginType': '02',
            '_remember_me': true,
        },
        button: $(this),
        showAjaxLoading: true,
        successFn: function (res) {
            if (res.code === 0) {
                window.location = '../../../index.html';
            } else {
                utilOther.layerError(res.msg, 5, 180);
            }
        },
        errorFn: function (error) {

        }
    });
});













