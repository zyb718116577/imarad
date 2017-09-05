define([
        'text!./createMeeting.html?v=' + staticVersion, '$css!./createMeeting.css?v=' + staticVersion
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);
            // 初始化
            main.init();
            // 表单验证规则
            util.verify();

        }

        function Main() {

            var _this = this;

            // 图片上传成功后的返回地址
            _this.imgUrl = [null, null, null];

            // 上传到后台的数据
            _this.postData = {};

            // 日程数组
            _this.listArray = [];

            // 白名单数据
            _this.whiteList = [];

            // F码名
            _this.fcodeName = "";

            // 会议时间段(用来控制日程时间段应该在这范围内)
            _this.timeSlot = {
                start: '',
                end: ''
            };

            // 初始化页面
            _this.init = function () {
                var type_name = util.getUserType(true),
                    type_number = util.getUserType(),
                    data = {
                        type_name: type_name,
                        type_number: type_number
                    };
                // 编辑时候
                if (_this.editOrAdd()) {
                    _this.getDetails(type_number, function (data) {
                        data.type_number = type_number;
                        data.type_name = type_name;
                        _this.render(data);
                    })
                    // 新增时候
                } else {
                    data.imaradLiveInfoEntity = {};
                    _this.render(data);
                }
            }

            // 创建or修改
            _this.editOrAdd = function () {
                var flag = util.getQueryString('type');
                if (flag) {
                    // 编辑
                    return true;
                } else {
                    return false;
                }
            }

            /**
             * 获取直播（会议）详情
             * @param type 类型（直播还是会议）
             * @param callBack （请求成功后的回调函数）
             */
            _this.getDetails = function (type, callBack) {
                var liveId = util.getQueryString('liveId'),
                    postData = {liveId: liveId},
                    requestUrl;
                console.log(postData)
                if (type == util.userArray[1].user_number) {
                    requestUrl = 'expert/get/liveInfo';
                } else if (type == util.userArray[2].user_number) {
                    requestUrl = 'meeting/get/meetingDetails';
                }
                var param = {
                    url: requestUrl,
                    showAjaxLoading: true,
                    beforeLoading: true,
                    beforeLoadingContainer: '.createMeeting-box',
                    postData: postData,
                    successFn: function (data) {
                        console.log(data)
                        if (util.checkCode(data)) {
                            callBack(data.data)
                        }
                    }
                }
                util.ajax(param);
            }

            // 渲染页面
            _this.render = function (data) {
                imaradLayui('laytpl', function (laytpl) {
                    var _that = jQuery;
                    var htmls = _that('#creat-temp').html();
                    laytpl(htmls).render(data, function (html) {
                        _that('.createMeeting-box')[0].innerHTML = html;
                        // 编辑时候渲染访问控制的回显
                        if (data.imaradLiveAuthorityEntity != undefined) {
                            // 编辑时候渲染访问控制类别的回显
                            _that('[name=authorityType] option').each(function () {
                                if (_that(this).attr('value') == data.imaradLiveAuthorityEntity.authorityType) {
                                    _that(this).attr('selected', 'selected');
                                }
                            })
                            // 编辑时候渲染访问控制对应的菜单的回显
                            _this.controlBackShow(data);
                            //编辑时候title
                            $('.is-edit').text('编辑');
                        }
                        imaradLayui('form', function (form) {
                            form.render();
                            _this.bindEvnet(form);
                        })
                    })
                })
            }

            /**
             * 基本信息编辑后的下一步
             * @param form 表单对象
             * @param step 下一步对象
             * @param title header标题数组
             */
            _this.checkBaseInfo = function (form, step, title) {
                form.on('submit(baseInfo)', function (data) {
                    var base = data.field;
                    // 专家只有海报
                    if (util.getUserType() == 3) {
                        base.logoPath = _this.imgUrl[0] || base.logoPath;
                        base.bgPicPath = _this.imgUrl[1] || base.bgPicPath;
                        base.picPath = _this.imgUrl[2] || base.picPath;
                        //封装直播时间范围  为日程时间范围判断提供条件
                        _this.timeSlot.start = util.timeToStamp(base.liveStartTime);
                        _this.timeSlot.end = util.timeToStamp(base.liveEndTime);
                    } else {
                        base.picPath = _this.imgUrl[0] || base.picPath;
                    }
                    _this.postData.imaradLiveInfoEntity = base;
                    var a = step.nextStep();
                    $('.create-title').text(title[a - 1]);
                    return false;
                });
            }

            /**
             * 封装日程信息(即日程页面的下一步事件)
             * @param form 表单对象
             * @param step 下一步对象
             * @param title header标题数组
             */
            _this.checkList = function (form, step, title) {
                //先清空数组
                _this.listArray.splice(0, _this.listArray.length);
                form.on('submit(detaiList)', function (data) {
                    //检测日程所选时间是否在会议时间范围内
                    if (!_this.checkListInTimeSolt(data)) {
                        return;
                    }
                    // 编辑时候给每个日程添加liveId和recId关联
                    if (_this.editOrAdd()) {
                        data.field.liveId = util.getQueryString('liveId');
                        data.field.recId = $('[name=recId]').val();
                    }
                    // 把每个日程数据加入日程数组
                    _this.listArray.push(data.field);
                    // 处理表单数据最后一条正常而其他非正常 直接跳到下一步的bug
                    if (_this.listArray.length == $('.schedule').size()) {
                        var a = step.nextStep();
                        $('.create-title').text(title[a - 1]);
                    }
                    return false;
                });
            }

            /**
             * 检测日程时间是否在会议直播时间范围内
             * @param data 日程的表单数据
             * @returns {true:在范围内  false:不在范围内}
             */
            _this.checkListInTimeSolt = function (data) {
                var flag = true;
                var start = util.timeToStamp(data.field.beginTime),
                    end = util.timeToStamp(data.field.endTime);
                if (start < _this.timeSlot.start || start > _this.timeSlot.end || end < _this.timeSlot.start || end > _this.timeSlot.end) {
                    var index = $(data.elem).index('.list-submit');
                    imaradLayui('layer', function (layer) {
                        layer.tips('日程时间应该在会议直播的时间范围内!', $('.tips-element').eq(index), {tipsMore: true});
                    })
                    flag = false;
                }
                return flag;
            }

            /**
             * 编辑时候权限控制的回显
             * @param res 编辑时候的liveInfo
             */
            _this.controlBackShow = function (res) {
                var control = $('[name=authorityType]').val();
                // 新增时候
                if (control == '-1' || control == '1') {
                    return;
                }

                // 渲染权限对应的右侧菜单
                var replaceHtml = $('.permission' + control).html() || "";
                $('.permissioncontainer').html(replaceHtml);

                // 对于不同的权限做不同操作
                switch (control) {
                    case '2':
                        $('[name=pwdCode]').val(res.imaradLiveAuthorityEntity.pwdCode || '');
                        break;
                    // F码
                    case '3':
                        $('.f-hide').hide();
                        $('.fcode-number').val(0);
                        $('.downloadF').show().attr('href', 'imarad/ability/get/fcode?code=' + res.imaradLiveAuthorityEntity.pwdCode);
                        $('.create-btn').text('重新生成');
                        _this.makeFcode();
                        _this.fcodeName = res.imaradLiveAuthorityEntity.pwdCode;
                        break;
                    // 白名单
                    case '4':
                        _this.whiteList = res.whiteList;
                        // 白名单回显
                        _this.whiteListBackshow(1, true);
                        if (_this.editOrAdd()) {
                            // 编辑的时候给每个白名单加上liveId
                            _.each(_this.whiteList, function (index, item) {
                                index.liveId = util.getQueryString('liveId');
                            })
                        }
                        break;
                    default:
                        break;
                }
            }

            // 保存会议、直播按钮的点击事件获取所有数据
            _this.saveLiveEvent = function (form) {
                form.on('submit(control)', function (data) {
                    var controlInfo = data.field,
                    // 是否提交标志
                        flag = true;
                    // 通过选择的权限整理上传数据的权限数据
                    switch (controlInfo.authorityType) {
                        case '-1':
                            imaradLayui('layer', function () {
                                layer.msg('请选择控制权限!', {icon: 2});
                            });
                            delete _this.postData.whiteList;
                            return false;
                            break;
                        case '4':
                            flag = _this.whiteList.length == 0 ? false : true;
                            if (flag) {
                                _this.postData.whiteList = _this.whiteList;
                            } else {
                                imaradLayui('layer', function () {
                                    layer.msg('请成功导入白名单后再提交!', {icon: 2});
                                });
                            }
                            break;
                        case '3':
                            flag = _this.fcodeName == "" ? false : true;
                            if (flag) {
                                controlInfo.pwdCode = _this.fcodeName;
                            } else {
                                imaradLayui('layer', function () {
                                    layer.msg('请生成F码后再提交!', {icon: 2});
                                });
                            }
                            break;
                    }
                    // 将控制信息加入到postData中
                    _this.postData.imaradLiveAuthorityEntity = controlInfo;
                    if (flag) {
                        console.log(_this.postData);
                        _this.saveLive(_this.postData);
                    }
                    // 阻止默认表单提交刷新页面
                    return false;
                });
            }

            // 保存直播会议
            _this.saveLive = function (postData) {
                // 根据用户类型判断是直播还是会议
                var type_number = util.getUserType(),
                    url = type_number == '2' ? 'expert/update/liveInfo' : 'meeting/update/meetingInfo',
                    param = {
                        url: url,
                        showAjaxLoading: true,
                        contentType: 'application/json',
                        postData: JSON.stringify(postData),
                        successFn: function (data) {
                            if (util.checkCode(data)) {
                                // 去除离开页面的询问事件
                                leaveAsk(false);
                                imaradLayui('layer', function (layer) {
                                    layer.msg('保存成功!', {icon: 1});
                                });
                                setTimeout(function () {
                                    window.location.hash = '#meetingList';
                                }, 2500);
                            }
                        }
                    };
                util.ajax(param);
            }

            //页面点击事件
            _this.bindEvnet = function (form) {
                // 创建分步(很重要)
                var step = $(".myStep").step();

                // 点击下一步
                $(".nextBtn").click(function (event) {
                    var user_type = util.getUserType();
                    if (user_type == util.constants.IMARAD_TWO) {
                        var title = ["", ">>访问控制"];
                    } else if (user_type == util.constants.IMARAD_THREE) {
                        var title = ["", ">>日程安排", ">>访问控制"];
                    }
                    var which = $(this).attr('which');
                    switch (which) {
                        case 'baseInfo':
                            _this.checkBaseInfo(form, step, title);
                            $('.hid-base').click();
                            // 绑定导入日程事件
                            if (util.getUserType() == 3) {
                                _this.uploadScheduleExcel(form);
                            }
                            // 编辑页面给白名单绑定事件
                            if (util.getUserType() == 2 && $('[name=authorityType]').val() == '4') {
                                _this.uploadExcel();
                            }
                            break;
                        case 'list':
                            _this.checkList(form, step, title);
                            $('.list-submit').click();
                            // 编辑页面给白名单绑定事件
                            if (util.getUserType() == 3 && $('[name=authorityType]').val() == '4') {
                                _this.uploadExcel();
                            }
                            // 把日程数据封装到上传数据中
                            _this.postData.liveDetailList = _this.listArray;
                            break;
                        default:
                            //点击保存时候
                            _this.saveLiveEvent(form);
                            $('.control-submit').click();
                            step.nextStep();
                            break;
                    }
                })

                // 上一步
                $('.preBtn').click(function () {
                    step.preStep();
                })

                // 取消
                $('.defaultBtn').click(function () {
                    window.location.hash = '#welcome';
                })

                // 上传图片
                $('.filePicker').each(function (index, item) {
                    // 只有会议有logo和背景
                    if (util.getUserType() == 3) {
                        var classArray = ['.logo-backshow', '.background-backshow', '.poster-back-img'];
                    } else {
                        var classArray = ['.poster-back-img'];
                    }
                    var param = {
                        filePicker: $(item),
                        backshowImg: classArray[index],
                        size: 1024,
                        showSize: 1,
                        sizeName: 'MB'
                    };
                    util.upload(param, function (res) {
                        if (util.checkCode(res)) {
                            _this.imgUrl[index] = res.data;
                        }
                    });
                })

                // 监听下拉框选择访问权限
                form.on('select(permission)', function (data) {
                    var replaceHtml = $('.permission' + data.value).html() || "";
                    $('.permissioncontainer').html(replaceHtml);
                    // 白名单 绑定白名单上传事件
                    if (data.value == util.authorityType.AUTHORITY_TYPE_WHITE_LIST) {
                        // 显示白名单回显容器
                        $(".white-list-container").show();
                        _this.uploadExcel();
                        // F码 绑定生成F码事件
                    } else if (data.value == util.authorityType.AUTHORITY_TYPE_F_CODE) {
                        _this.makeFcode();
                    }
                    // 非白名单隐藏白名单的回显
                    if (data.value != util.authorityType.AUTHORITY_TYPE_WHITE_LIST) {
                        $(".white-list-container").hide();
                    }

                });

                // 添加日程(删除日程在util.js里面)
                $('.add-speech').click(function () {
                    // 新增时候制造一个假数据以至于模板循环的时候至少循环一次
                    var res = {};
                    res.data = new Array();
                    res.data.push({liveTitle: ''});
                    _this.addSchedule(res, false, true);
                    form.render();
                })

            }

            // 导入会议日程(会议excel)
            _this.uploadScheduleExcel = function (form) {
                $(".upload-schedule").each(function () {
                    var param = {
                        server: 'ability/upload/schedule',
                        filePicker: $('.upload-schedule')
                    };
                    util.uploadFile(param, function (res) {
                        if (util.checkCode(res)) {
                            console.log(res)
                            // 如果数据为空
                            if (res.data.length == 0) {
                                imaradLayui('layer', function (layer) {
                                    layer.msg('您所上传的日程数据为空,请重试。', {icon: 2})
                                });
                                return;
                            }
                            // 判断已有日程的条数决定回显在其前面还是后面
                            var flag = $('.schedule').size() == 1 ? true : false;
                            if ($(param.filePicker).attr('repeat')) {
                                flag = true;
                            }
                            // 给导入的数据添加一个标志位
                            res.classFlag = 'import-schedule';
                            // 调用日程回显函数
                            _this.addSchedule(res, flag);
                            form.render();
                        }
                    });
                })
            }

            /**
             * 导入会议日程后回显以及新增一条日程(
             * @param data 日程数据;
             * @param importFlag (true导入回显  false:新增一条日程)
             * @param addFlag {true: 通过新增按钮添加}
             */
            _this.addSchedule = function (data, importFlag, addFlag) {
                imaradLayui('laytpl', function (laytpl) {
                    var htmls = $('#schedule-temp').html();
                    laytpl(htmls).render(data, function (html) {
                        // 如果不是新增按钮添加的（则就是导入的）先删除之前导入的
                        if (!addFlag) {
                            $('.import-schedule').remove();
                        }
                        // 新增和导入插入位置不一样
                        var element = importFlag ? $('.schedule:first') : $('.bottom:visible');
                        if (element.size() == 0) {
                            element = $('.bottom:visible');
                        }
                        element.before(html);
                    })
                })
            }

            // 导入白名单(白名单excel)
            _this.uploadExcel = function () {
                $('.upWhiteList').each(function (index, item) {
                    var param = {
                        server: 'ability/upload/whiteList',
                        filePicker: $(item),
                        element: '.white-list-details'
                    };
                    util.uploadFile(param, function (res) {
                        if (util.checkCode(res)) {
                            if (res.data.length == 0) {
                                $(param.element).html(util.localLoading(false, '您所上传白名单数据为空,请重试。'));
                                return;
                            }
                            if (_this.editOrAdd()) {
                                // 编辑的时候给每个白名单加上liveId
                                _.each(res.data, function (index, item) {
                                    index.liveId = util.getQueryString('liveId');
                                })
                            }
                            _this.whiteList = res.data;
                            _this.whiteListBackshow(1, true);
                        }
                    }, function () {
                        _this.whiteList = [];
                        _this.whiteListBackshow(1, true);
                    });
                })
            }

            /**
             * 白名单回显
             * @param page 页码
             * @param renderPage 是否渲染分页
             */
            _this.whiteListBackshow = function (page, renderPage) {
                // 每页条数
                var single = 20, data = _this.whiteList,
                // 总页数
                    totalPage = Math.ceil(data.length / single),
                // 如果页码等于总页数则截取到data的最后个元素
                    showArray = page == totalPage ? data.slice((page - 1) * single, data.length) : data.slice((page - 1) * single, (page - 1) * single + single);

                // 不是偶数条则追加一条空的
                if (showArray.length % 2 != 0) {
                    showArray.push({name: '', phone: ''});
                }
                // 渲染回显
                imaradLayui('laytpl', function (laytpl) {
                    var htmls = $('#white-list-temp').html();
                    laytpl(htmls).render(showArray, function (html) {
                        $('.white-list-details')[0].innerHTML = html;
                        // 分页只在第一次时候渲染
                        if (renderPage) {
                            _this.page(totalPage);
                        }
                    })
                })
            }

            // 白名单回显分页
            _this.page = function (totalPage) {
                imaradLayui('laypage', function () {
                    var laypage = layui.laypage;
                    laypage({
                        cont: 'page',
                        pages: totalPage,
                        skin: "#f1f1f1",
                        jump: function (obj, first) {
                            var curr = obj.curr;
                            if (!first) {
                                _this.whiteListBackshow(curr);
                            }
                        }
                    });
                })
            }

            // 生成F码
            _this.makeFcode = function () {
                $('.create-btn').click(function () {
                    // 编辑时候
                    if ($('.f-hide').css('display') == 'none') {
                        $('.f-hide').show();
                        $(this).text('生成');
                        return;
                    }
                    var codeNumber = $('.fcode-number').val();
                    if (!codeNumber || codeNumber.toString().indexOf('.') > 0 || codeNumber == 0 || codeNumber < 0 || codeNumber > 500) {
                        layer.msg('请输入正确的F码个数,且最多为500个！', {icon: 2});
                        return;
                    }
                    var param = {
                        url: 'ability/make/fcode',
                        showAjaxLoading: true,
                        postData: {
                            codeNum: codeNumber
                        },
                        successFn: function (data) {
                            if (util.checkCode(data)) {
                                console.log(data);
                                _this.fcodeName = data.data;
                                $('.downloadF').show().attr('href', 'imarad/ability/get/fcode?code=' + data.data);
                                imaradLayui('layer', function (layer) {
                                    layer.tips('您现在可以点击我下载F码!', '.downloadF')
                                })
                            }
                        }
                    }
                    util.ajax(param);
                })
            }

        }

        var main = new Main();

        return {
            render: render
        }
    })



