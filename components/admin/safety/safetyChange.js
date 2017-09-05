define([
        'text!./safetyChange.html?v='+staticVersion, '$css!./safety.css?v='+staticVersion
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);

            main.init();

            util.verify();
        }

        // 页面逻辑
        function Main() {

            var _this = this;

            // 修改类型
            _this.changeType = util.getQueryString('type');

            // 修改类型名字
            _this.typeData = {
                email: '绑定邮箱',
                phone: '绑定手机',
                pwd: '修改密码'
            }

            //根据修改类型渲染页面
            _this.init = function () {
                var type = util.getQueryString('type');
                layui.use(['laytpl', 'form'], function () {
                    var laytpl = layui.laytpl,
                        form = layui.form(),
                        getTpl = $("#safetyBox").html(),
                        renderData = {
                            type: type,
                            names: _this.typeData
                        };

                    laytpl(getTpl).render(renderData, function (html) {
                        $(".safety-box")[0].innerHTML = html;
                        var step = $(".myStep").step();
                        _this.nextEvent(type, form, step);

                        //页面渲染完成之后再绑定事件
                        _this.bindEvent();
                    });
                })
            }

            // 验证是否已经发送了验证码
            _this.checkSendCode = function () {
                if ($('.code-btn:visible').attr('data-haveSend')) {
                    return true
                } else {
                    return false;
                }
            }

            // 页面的下一步处理事件
            _this.nextEvent = function (type, form, step) {
                form.on('submit(*)', function (data) {
                    var postData = data.field;
                    console.log(postData);
                    switch (type) {
                        case 'email':
                            _this.bindMail(postData, step);
                            break;
                        case 'phone':
                            var changeStep = $(data.elem).attr('step');
                            _this.changePhone(postData, step, changeStep);
                            break;
                        case 'pwd':
                            _this.changePwd(postData, step);
                            break;
                        default:
                            break;
                    }
                })
            }

            // 绑定邮箱
            _this.bindMail = function (postData, step) {
                var param = {
                    url: 'user/bind/email',
                    showAjaxLoading: true,
                    postData: postData,
                    successFn: function (data) {
                        if (util.checkCode(data, false)) {
                            step.nextStep();
                        }
                    },
                    errorFn: function (res) {

                    }
                }
                util.ajax(param);
            }


            // 更新手机号
            _this.changePhone = function (postData, step, changeStep) {
                // 根据传过来的changeStep判断是验证手机号还是更新手机号
                var url = changeStep == util.constants.IMARAD_ONE ? 'user/check/sendCode' : 'user/change/phone';
                var param = {
                    url: url,
                    showAjaxLoading: true,
                    postData: postData,
                    successFn: function (data) {
                        if (util.checkCode(data, false)) {
                            step.nextStep();
                        }
                    }
                }
                if (_this.checkSendCode()) {
                    util.ajax(param);
                } else {
                    imaradLayui('layer', function (layer) {
                        layer.msg('请先获取验证码!', {icon: 2})
                    })
                }
            }

            // 验证用户输入手机号是否为当前用户的手机号
            _this.checkIsBind = function (phone, url, callBack) {
                var flag = true;
                var param = {
                    url: url,//,
                    postData: {'phone': phone},
                    successFn: function (data) {
                        if (data.code == util.constants.IMARAD_ZERO) {
                            callBack(flag);
                        }
                    },
                    errorFn: function () {
                        flag = false;
                        callBack(flag);
                    }
                }
                util.ajax(param);
            }

            // 发送短信验证码
            _this.sendMsg = function (element, phone, callBack) {
                var flag = false;
                var param = {
                    url: 'ability/send/codeToPhone',
                    showAjaxLoading: true,
                    postData: {phone: phone},
                    successFn: function (data) {
                        // 给发送按钮一个标记是否已经发送验证码
                        $(element).attr('data-haveSend', 'yes');
                        if (util.checkCode(data, false)) {
                            flag = true;
                            // 发送成功执行回调函数
                            callBack(flag);
                        }
                    }
                }
                util.ajax(param);
            }

            //  更改密码
            _this.changePwd = function (postData, step) {
                var param = {
                    url: 'user/change/password',
                    showAjaxLoading: true,
                    postData: postData,
                    successFn: function (data) {
                        if (util.checkCode(data, false)) {
                            step.nextStep();
                        }
                    }
                }
                // 判断是否获取了验证码
                if (!_this.checkSendCode()) {
                    imaradLayui('layer', function (layer) {
                        layer.msg('请先获取验证码!', {icon: 2})
                    })
                    return;
                }
                // 判断新旧密码是否一致
                if (postData.oldPassword == postData.password){
                    imaradLayui('layer', function (layer) {
                        layer.msg('新旧密码不能相同!', {icon: 2});
                    })
                    return;
                }
                util.ajax(param);
            }

            // 页面处理事件(包括input、click、change)
            _this.bindEvent = function () {

                // 电话号码输入框与发送验证码按钮的联动
                $('.email-input').keyup(function () {
                    var index = $('.email-input').index($(this)),
                        that = $('.code-btn').eq(index);
                    if (util.constants.IMARAD_PHONE_PATTEN.test($(this).val())) {
                        $(that).removeClass('layui-btn-disabled').attr('disabled', false);
                    } else {
                        if (!$(that).hasClass('layui-btn-disabled')) {
                            $(that).addClass('layui-btn-disabled').attr('disabled', 'disabled');
                        }
                    }
                })

                // 验证码按钮事件(每个修改类型通用)
                $('.code-btn').bind('click', function () {
                    var count = 6,
                        _that = $(this), timer,
                        index = $('.code-btn').index($(this)),
                        input = $('.email-input').eq(index),
                        phone = $(input).val(),
                        url = index == 0 ? 'user/check/currentPhone' : 'ability/check/phone';
                    // 验证手机号是否是该用户当前绑定手机号
                    _this.checkIsBind(phone, url, function (flag) {
                        if (flag) {
                            // 号码验证通过后向服务器请求发送验证码
                            _this.sendMsg(_that, phone, function (successFlag) {
                                // 如果短信发送成功则执行回调
                                if (successFlag) {
                                    layer.msg('验证码发送成功!', {icon: 1})
                                    $(_that).text('等待(' + count + 's)').addClass('layui-btn-disabled').attr('disabled', 'disabled');
                                    $(input).attr('readonly', true);
                                    timer = setInterval(function () {
                                        $(_that).text('等待(' + --count + 's)');
                                        if (count == 0) {
                                            clearInterval(timer);
                                            $(_that).text('获取验证码').removeClass('layui-btn-disabled').attr('disabled', false);
                                            $(input).removeAttr('readonly');
                                        }
                                    }, 1000);
                                }
                            })
                        }
                    })
                })

                // 修改成功后的返回通用事件
                $('.return-button').click(function () {
                    // 去除离开页面的询问事件
                    leaveAsk(false);
                    window.location.hash = "#safety";
                })
            }
        }


        var main = new Main();

        return {
            render: render
        }
    })
