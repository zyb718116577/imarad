define([
        'text!./info.html?v='+staticVersion, '$css!./info.css?v='+staticVersion
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);

            // 获取用户信息
            info.getUserInfo();


            // bug:表单验证没有起效
            util.verify();

            $('.saveInfo').click(function () {
                $('.hide-btn').click();
            })
        }

        function Main() {
            var _this = this;

            // 头像上传成功后的返回url
            _this.headUrl = "";

            /**
             * 字符串模板
             * @param element 模板的元素节点
             * @param data 渲染的数据
             * @param userPlace 用户所在地
             */
            _this.template = function (element, data, userPlace) {
                imaradLayui('laytpl', function (laytpl) {
                    var getTpl = $(element).html();

                    laytpl(getTpl).render(data, function (html) {
                        $(".content-main")[0].innerHTML = html;
                    });
                    _this.render(userPlace, data.userType);
                    _this.uploadHead();
                })
            }

            // 获取用户信息回显
            _this.getUserInfo = function () {
                var param = {
                    url: 'user/get/userInfo',
                    showAjaxLoading: true,
                    successFn: function (data) {

                        if (!data.data.headPicPath) {
                            data.data.headPicPath = '../img/ardLive1.png',
                                data.data.SERVER_URL = '';
                        }

                        if (util.checkCode(data)) {
                            if (data.data.userPlace != undefined || data.data.userPlace != null) {
                                data.data.userPlaceExtend = data.data.userPlace.split('_')[3];
                            }

                            _this.template('#infoBox', data.data, data.data.userPlace);
                        }
                        console.log(data)
                    },
                    errorFn: function () {
                        var data = {};
                        data.headPicPath = '../img/ardLive1.png';
                        _this.template('#infoErrorBox', data);
                    }
                }
                util.ajax(param);
            }


            /**
             * 渲染省市区以及获取表单信息
             * @param areaBacShowStr
             * @param userType
             */
            _this.render = function (areaBacShowStr, userType) {
                imaradLayui('form', function (form) {
                    // 省市区三级联动
                    imaradArea(form, areaBacShowStr);
                    form.render();
                    // 表单提交
                    form.on('submit(info)', function (data) {
                        var info = data.field;
                        var updateInfo = {}, userPlaceExtend = '';
                        // 如果是直播
                        if (userType == util.userArray[1].user_number) {
                            updateInfo.userTitle = $('[name=userTitle]').val();
                            userPlaceExtend = info.userPlaceExtend;
                        }
                        updateInfo.headPicPath = _this.headUrl || $('#hideUrl').val();
                        updateInfo.userPlace = info.provence + '_' + info.city + '_' + info.county + '_' + userPlaceExtend;
                        updateInfo.userName = info.userName;
                        updateInfo.birthDate = info.birthDate;
                        updateInfo.userSex = info.userSex;
                        // 如果用户没有传头像，则取消把默认头像往后台传
                        if (updateInfo.headPicPath == "../img/ardLive1.png") {
                            updateInfo.headPicPath = '';
                        }
                        _this.saveInfo(updateInfo);
                        return false;
                    });

                })
            }


            /**
             * 更新用户信息
             * @param postData 用户信息数据
             */
            _this.saveInfo = function (postData) {
                // 用户没有填生日 则不拼接时分秒
                if (postData.birthDate) {
                    postData.birthDate = postData.birthDate + " 00:00:00";
                }
                if ($('[name=userDesc]').val()){
                    postData.userDesc = $('[name=userDesc]').val();
                }
                var param = {
                    url: 'user/update/userInfo',
                    showAjaxLoading: true,
                    postData: postData,
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            imaradLayui('layer', function (layer) {
                                layer.msg('保存成功', {icon: 1});
                                // 左侧菜单初始化
                                menuInit();
                            })
                        }
                    }
                }
                util.ajax(param);
            }


            // 头像上传
            _this.uploadHead = function () {
                util.upload({
                    filePicker: '#filePicker',
                    backshowImg: '.headimg-backshow',
                    size: 512,
                    showSize: 512,
                    sizeName: 'kb'
                }, function (res) {
                    if (util.checkCode(res)) {
                        _this.headUrl = res.data;
                    }
                })
            }

        }

        // 创建Main实例
        var info = new Main();

        return {
            render: render
        }
    })



