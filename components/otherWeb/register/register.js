// 清空IE input标签刷新后有值问题
$(function () {
    $('#reset').click();
});
//回车事件
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode == 13) { //回车键的键值为13
        if(document.all){  //只有ie识别
            e.cancelBubble=true;
            e.returnValue = false;
        }else{
            e.stopPropagation();
            e.preventDefault();
        }
        $("#submit").click();
    }
};
// 让IE支持placeholder属性
utilOther.JPlaceHolder.init();

// 验证是否输入手机号
function checkPhone() {
    var phone = $('#phone').val();
    if($.trim(phone) ===''){
        $('#phone').val('')
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        $('.error').eq(0).show();
        $('.correct').eq(0).hide();
        $('.disgraceful').show();
    } else {
        $('.correct').eq(0).show();
        $('.error').eq(0).hide();
        $('.disgraceful').hide();
        utilOther.graphicalVerification();
    }
}
// 手机号只能输入数字
$('#phone').keyup(function () {
    checkPhone();
});

// 点击获取短信验证码
$('.img-verification').click(function () {
    var phone = $('#phone').val();
    if (!(/^1[34578]\d{9}$/.test($('#phone').val()))) {
        utilOther.layerError('请输入正确的手机号',5,220);
        return;
    }
    var _this = this;
    $(this).attr('disabled', 'disabled');
    // 验证手机号是否被注册
    utilOther.myAjax({
        url: 'ability/check/phone',
        postData: {phone: phone},
        successFn: function (res) {
            if (res.code === 0) {
                utilOther.myAjax({
                    url: 'ability/send/codeToPhone',
                    postData: {phone: phone},
                    successFn: function (res) {
                        if (res.code === 0) {
                            /*utilOther.layerError('短信发送成功',6,190);*/
                            var phone = $('#phone').val();
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
            }
        },
        errorFn: function (error) {
            $(_this).removeAttr('disabled');
        }
    });
});

// 动态验证码
function checkDynamicPassword() {
    if ($.trim($('#dynamicPassword').val()) == '') {
        $('#dynamicPassword').val('');
        $('.error1').show();
    }else {
        $('.error1').hide();
    }
}
$("#dynamicPassword").keyup(function () {
    checkDynamicPassword();
});

// 密码验证
function checkPassword() {
    if ($.trim($('#password').val()) === '') {
        $('#password').val('')
    }
    if ($('#password').val().length > 5) {
        $('.correct').eq(1).show();
        $('.error').eq(1).hide();
    } else {
        $('.error').eq(1).show();
        $('.correct').eq(1).hide();
    }
    if ($.trim($('#password').val()) === $('#passwordAgain').val() && $('#passwordAgain').val().length > 5) {
        $('.correct').eq(2).show();
        $('.error').eq(2).hide();
    } else {
        $('.correct').eq(2).hide();
        $('.error').eq(2).show();
    }
}
$('#password').keyup(function () {
    checkPassword();
});

// 再次输入密码验证
function checkPasswordAgain() {
    if ($.trim($('#passwordAgain').val()) === '') {
        $('#passwordAgain').val('')
    }
    if ($('#passwordAgain').val() === $('#password').val() && $('#passwordAgain').val().length > 5) {
        $('.correct').eq(2).show();
        $('.error').eq(2).hide();
    } else {
        $('.error').eq(2).show();
        $('.correct').eq(2).hide();
    }
}
$('#passwordAgain').keyup(function () {
    checkPasswordAgain();
});


// 服务条款选中时隐藏error
$('#checkbox').click(function () {
    if ($("#checkbox").get(0).checked) {
        $('.error').eq(3).hide();
    }
});

// 点击提交注册
$('#submit').click(function () {
    var phone = $('#phone').val();
    var dynamicPassword = $('#dynamicPassword').val();
    var password = $('#password').val();
    var passwordAgain = $('#passwordAgain').val();
    checkPhone();
    checkDynamicPassword();
    checkPassword();
    checkPasswordAgain();
    if (!$("#checkbox").get(0).checked) {
        $('.error').eq(3).show();
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        utilOther.layerError('请输入正确的手机号',5,220);
        return;
    }
    if (dynamicPassword === '') {
        utilOther.layerError('请输入动态密码',5,220);
        return;
    }
    if (password.length < 6) {
        utilOther.layerError('请输入正确的密码格式',5,220);
        return;
    }
    if (passwordAgain !== password) {
        utilOther.layerError('重复密码必须和密码相同',5,240);
        return;
    }
    if (!$("#checkbox").get(0).checked) {
        utilOther.layerError('请勾选相关服务条款',5,220);
        return;
    }
    // 发送提交注册Ajax
    utilOther.myAjax({
        url: 'register/save/user',
        postData: {
            phoneNum: phone,
            phoneCode: dynamicPassword,
            loginPwd: password,
        },
        button: $(this),
        showAjaxLoading:true,
        successFn: function (res) {
            if (res.code === 0) {
                utilOther.layerError('注册成功',6,180);
                setTimeout(function () {
                    window.location = '../login/login.html'
                },2000);

            }
        },
        errorFn: function (error) {

        }
    });

})











