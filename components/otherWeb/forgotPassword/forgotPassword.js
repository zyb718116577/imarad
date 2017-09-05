// 清空IE input标签刷新后有值问题
$(function () {
    $('#resetPhone').click();
    $('#resetPassword').click();
});
var flag = 1;
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode == 13) { //回车键的键值为13
        if(flag === 1){
            if (document.all) {  //只有ie识别
                e.cancelBubble = true;
                e.returnValue = false;
            } else {
                e.stopPropagation();
                e.preventDefault();
            }
            $('.forget-submit').click();
        }else{
            $('.password-submit').click();
        }

    }

};

// 让IE8浏览器支持placeholder属性
utilOther.JPlaceHolder.init();

// 验证输入的是否为手机账号
$("#telPhone").keyup(function () {
    $('.error').eq(0).show();
    if ($.trim($(this).val()) === '') {
        $(this).val('')
    }
    if ((/^1[34578]\d{9}$/.test($(this).val()))) {
        $('.error').eq(0).hide();
        utilOther.graphicalVerification();
        $('.disgraceful').hide();
    } else {
        $('.disgraceful').show();
    }
});

// 点击获取短信验证码
$('.img-verification').click(function () {
    var iphoneNumber = $('#telPhone').val();
    if (!(/^1[34578]\d{9}$/.test(iphoneNumber))) {
        utilOther.layerError('请输入正确的手机号', 5, 220);
        return;
    }
    $(this).attr('disabled', 'disabled');
    var _this = this
    // 发送短信验证Ajax
    utilOther.myAjax({
        url: 'ability/send/codeToPhone',
        postData: {phone: iphoneNumber},
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

// 验证码不能为空
$("#iphonePassword").keyup(function () {
    if ($.trim($(this).val()) === '') {
        this.value = '';
        $('.error').eq(1).show();
    } else {
        $('.error').eq(1).hide();
    }
});

// 点击提交(跳转到修改密码页面)
$('.forget-submit').click(function () {
    var iphoneNumber = $('#telPhone').val();
    var iphonePassword = $('#iphonePassword').val();
    $('.error').eq(0).show();
    if ((/^1[34578]\d{9}$/.test($('#telPhone').val()))) {
        $('.error').eq(0).hide();
    }
    if ($('#iphonePassword').val() === '') {
        $('.error').eq(1).show();
    }
    if (!(/^1[34578]\d{9}$/.test($('#telPhone').val()))) {
        utilOther.layerError('请输入正确的手机号', 5, 220);
        return;
    }
    if ($('#iphonePassword').val() === '') {
        utilOther.layerError('请输入动态密码', 5, 200);
        return;
    }
    // 填写Ajax
    utilOther.myAjax({
        url: 'register/check/phoneToCode',
        postData: {
            phoneNum: iphoneNumber,
            phoneCode: iphonePassword,
        },
        button: $(this),
        showAjaxLoading: true,
        successFn: function (res) {
            if (res.code === 0) {
                flag++;
                $('.forget-step2').show();
                $('.forget-step1').hide();
            } else {
                utilOther.layerError(res.msg, 5, 180);
            }
        },
        errorFn: function (error) {

        }
    });
});

// 新密码不能输入空格
$("#newPassword").keyup(function () {
    $('.error').eq(2).show();
    if ($.trim($(this).val()) === '') {
        this.value = '';
        $('.error').eq(2).show();
    }
    if ($(this).val().length > 5) {
        $('.error').eq(2).hide();
        $('.correct').eq(0).show();
    } else {
        $('.error').eq(2).show();
        $('.correct').eq(0).hide();
    }
    if ($(this).val() === $('#repeatNewPassword').val() && $('#repeatNewPassword').val().length > 6) {
        $('.error').eq(3).hide();
        $('.correct').eq(1).show();
    } else {
        $('.error').eq(3).show();
        $('.correct').eq(1).hide();
    }
});

// 验证再次输入密码与新密码是否相同
$('#repeatNewPassword').keyup(function () {
    if ($.trim($(this).val()) == '') {
        this.value = '';
        $('.error').eq(3).show();
    }
    if ($('#repeatNewPassword').val() === $('#newPassword').val() && $('#repeatNewPassword').val().length > 5) {
        $('.error').eq(3).hide();
        $('.correct').eq(1).show();
    } else {
        $('.error').eq(3).show();
        $('.correct').eq(1).hide();
    }
});

// 点击隐藏所有的提示
$('.reset').click(function () {
    $('.error').eq(2).hide();
    $('.error').eq(3).hide();
    $('.correct').eq(0).hide();
    $('.correct').eq(1).hide();
})

// 点击提交
$('.password-submit').click(function () {
    var iphoneNumber = $('#telPhone').val();
    var iphonePassword = $('#iphonePassword').val();
    var newPassword = $('#newPassword').val();
    var repeatNewPassword = $('#repeatNewPassword').val();
    if (repeatNewPassword === '') {
        $('.error').eq(3).show();
    }
    if (newPassword.length > 5) {
        $('.error').eq(2).hide();
    } else {
        $('.error').eq(2).show();
        utilOther.layerError('请输入正确的密码格式', 5, 220);
        return;
    }
    if (repeatNewPassword !== newPassword) {
        utilOther.layerError('新密码二次输入必须相同', 5, 240);
        return;
    }
    utilOther.myAjax({
        url: 'register/update/retrievePwd',
        postData: {
            phoneNum: iphoneNumber,
            newPwd: newPassword,
        },
        button: $(this),
        showAjaxLoading: true,
        successFn: function (res) {
            if (res.code === 0) {
                $('.forget-step2').hide();
                $('.forget-step3').show();
                setInterval(function () {
                    if ($('.back-time').text() == 0) {
                        $('.forget-back').text('请点击跳转到登录页面！');
                        return;
                    }
                    $('.back-time').text($('.back-time').text() - 1);
                }, 1000);
                setTimeout(function () {
                    window.location = '../login/login.html';
                }, 5000)
            } else {
                utilOther.layerError(res.msg, 5, 200);
            }
        },
        errorFn: function (error) {

        }
    });

})




















