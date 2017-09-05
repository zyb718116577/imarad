define([
        'text!./manageMeeting.html?v=' + staticVersion, '$css!./manageMeeting.css?v=' + staticVersion
    ],
    function (html) {
        function render() {

            // 进入页面去除聊天室，防止重复渲染
            if (chat) {
                chat.removeEventListener(chatease.events.CHATEASE_INDENT, onChatIdent);
                chat.removeEventListener(chatease.events.CHATEASE_MESSAGE, onChatMessage);
                chat.removeEventListener(chatease.events.CHATEASE_USERS, onChatUsers);
                chat.removeEventListener(chatease.events.CHATEASE_EXTERN, onChatExtern);
                chat.removeEventListener(chatease.events.CHATEASE_CLOSE, onChatClose);
                chat.close();
            }

            player = undefined;
            chat = undefined;

            $('.view-window').html(html);

            main.init();

        }

        function Main() {

            var _this = this;

            // 用户类型(直播或者会议)
            _this.userType = util.getUserType();

            // 直播的状态
            _this.status = '';

            // 详情数据
            _this._response = '';

            // 页面初始化
            _this.init = function () {

                _this.getListDetails();
                // 每隔五分钟获取一次当前正在直播的日程详情
                if (_this.userType == 3) {
                    var timer = setInterval(function () {
                        if (document.URL.indexOf('manageMeeting') > 0) {
                            _this.getListDetails();
                        } else {
                            clearInterval(timer);
                        }
                    }, 300000)
                }

                // 绑定点击事件
                _this.bindEvent();

                // 表单验证
                util.verify();

                // tab切换
                imaradLayui('element', function (element) {
                    element.on('tab(docDemoTabBrief)', function (data) {
                    })
                })
            }

            // 会议获取日程安排详情  ||  专家获取直播推流地址
            _this.getListDetails = function () {
                var url = _this.userType == 3 ? 'meeting/get/liveDetails' : 'expert/get/liveInfo';
                var param = {
                    url: url,
                    postData: {
                        liveId: util.getQueryString('Id'),
                    },
                    beforeLoading: true,
                    beforeLoadingContainer: '.meeting-have',
                    successFn: function (res) {
                        if (util.checkCode(res)) {
                            _this.render(res.data);
                            _this._response = res;
                            _this.statusChangeCallBack();
                            // 初始化聊天室和播放器
                            if (!player) {
                                paler.init(res.data.livePushUrl, util.getQueryString('Id'), '', _this.statusChangeCallBack);
                            }
                        }
                    }
                };
                util.ajax(param);
            }

            // 更改直播状态之后的回调函数
            _this.statusChangeCallBack = function (e) {
                _this.liveStatus = _this._response.data.liveStatus;
                var src = _this._response.data.picPath;
                // 如果是专家直播（特殊处理，因为会议和专家后台返回数据格式不一样）
                if (_this.userType == 2) {
                    src = _this._response.data.imaradLiveInfoEntity.picPath;
                    _this.liveStatus = _this._response.data.imaradLiveInfoEntity.liveStatus;
                }
                if (e) {
                    _this.liveStatus = e;
                }
                switch (Number(_this.liveStatus)) {
                    case 0:
                        $('#post-img').show().attr('src', util.constants.MY_SERVER_URL + src);
                        if (player) {
                            player.stop();
                        }
                        break;
                    case -1:
                        $('#post-img').show().attr('src', './../../img/suspension.jpg');
                        if (player) {
                            player.stop();
                        }
                        break;
                    case 2:
                        $('#post-img').show().attr('src', './../../img/suspend.jpg');
                        if (player) {
                            player.stop();
                        }
                        break;
                    default:
                        $('#post-img').hide();
                        if (player) {
                            player.play();
                        }
                        break;
                }

            }

            // 渲染函数（渲染当前正在直播日程详情）
            _this.render = function (data) {
                var type_name = util.getUserType(true),
                    data = data;
                data.user_type = _this.userType;
                if (data.userPlace) {
                    if (data.userPlace.indexOf('_') > 0) {
                        data.userPlaceExtend = data.userPlace.split('_')[3];
                    }
                }
                imaradLayui('laytpl', function (laytpl) {
                    var getTpl = $("#list-temp").html();

                    laytpl(getTpl).render(data, function (html) {
                        $(".meeting-have")[0].innerHTML = html;
                        // 修改会议日程
                        _this.editNow();
                        // 绑定复制事件
                        _this.copy();
                    });
                })
                // 替换不同角色的名词（直播或会议）
                $(".replace").text(type_name);
            }

            // 页面点击事件
            _this.bindEvent = function () {
                var _that = $;

                // 修改直播状态
                _that('.change-status-btn').bind('click', function () {
                    var liveStatus = _that(this).attr('data-status'),
                        liveId = util.getQueryString('Id');

                    _this.changeStatus(liveId, liveStatus);
                })

                //监听查询按钮的提交
                imaradLayui('form', function (form) {
                    form.on('submit(formDemo)', function (data) {
                        _this.getStatistics(data.field)
                        return false;
                    });
                })

                // 修复tab切换后如果发生resize事件导致播放器不显示的bug
                $('.layui-this').click(function () {
                    $(window).resize();
                })
            }

            // 点击复制
            _this.copy = function () {
                $('.copy-btn').click(function () {
                    var _that = $(this);

                    // 创建元素用于复制
                    var aux = document.createElement("input");

                    // 获取复制内容
                    var content = $(this).prev('input').text() || $(this).prev('input').val();

                    // 设置元素内容
                    $(aux).val(content);

                    // 将元素插入页面进行调用
                    document.body.appendChild(aux);

                    // 复制内容
                    aux.select();

                    // 将内容复制到剪贴板
                    document.execCommand("copy");

                    // 删除创建元素
                    document.body.removeChild(aux);

                    _that.html('<i class="layui-icon" style="color: green">&#xe618;</i>');

                    var timer = setTimeout(function () {
                        _that.html('复制');
                        clearTimeout(timer);
                    }, 3000)
                })
            }

            // 修改当前正在直播日程按钮的点击事件
            _this.editNow = function () {
                $('.edit-btn').click(function () {
                    // 获取日程列表
                    _this.getLiveDetailList(function (res) {
                        // 渲染弹窗
                        imaradLayui('laytpl', function (laytpl) {
                            var html = $("#openWindow").html();
                            laytpl(html).render(res.data, function (html) {
                                // 调用弹窗
                                imaradLayui('layer', function (layer) {
                                    var index = layer.open({
                                        content: html,
                                        title: '修改正在直播日程',
                                        area: '800px',
                                        btn: ['确定', '取消'],
                                        // 弹窗确认按钮 (保存修改)POST
                                        yes: function (index, layero) {
                                            // 保存更改
                                            _this.updateLiveDetailList(layer, index);
                                        }
                                    });
                                })
                            });
                        })
                    })
                })
            }

            // 获取会议日程安排表
            _this.getLiveDetailList = function (callBack) {
                var liveId = util.getQueryString('Id'),
                    param = {
                        url: 'meeting/get/liveDetailList',
                        postData: {
                            liveId: liveId
                        },
                        beforeLoading: true,
                        beforeLoadingContainer: '.layer-anim',
                        successFn: function (res) {
                            if (util.checkCode(res)) {
                                callBack(res);
                            }
                        }
                    };
                util.ajax(param);
            }

            // 保存会议日程安排调整
            _this.updateLiveDetailList = function (layer, index) {
                var postData = {
                        liveId: $('.now-setting').attr('live-id'),
                        recId: $('.now-setting').attr('rec-id')
                    },
                    param = {
                        url: 'meeting/update/liveDetailFlag',
                        postData: postData,
                        successFn: function (res) {
                            if (util.checkCode(res)) {
                                layer.msg(res.data, {icon: 1});
                                layer.close(index);
                                _this.getListDetails();
                            }
                        }
                    };
                if (postData.liveId && postData.recId) {
                    util.ajax(param);
                } else {
                    alert('请选择一个日程置顶!');
                }
            }

            // 更改直播(会议)状态  liveId:直播ID  liveStatus:状态
            _this.changeStatus = function (liveId, liveStatus) {
                // 聊天室广播
                if (chat) {
                    chat.send({
                        "cmd": "extern",
                        "data": "[player]:" + liveStatus,
                        "type": "multi",
                        "channel": {"id": "001"}
                    })
                }
                // 避免相同状态重复提交
                if (liveStatus == _this.liveStatus) {
                    imaradLayui('layer', function (layer) {
                        layer.msg('该直播已处于该状态，请勿重复提交!', {icon: 5});
                    })
                    return;
                }
                var postData = {
                        liveId: liveId,
                        liveStatus: liveStatus
                    },
                    url = _this.userType == '2' ? 'expert/update/liveStatus' : 'meeting/update/liveStatus',
                    param = {
                        url: url,
                        postData: postData,
                        showAjaxLoading: true,
                        successFn: function (res) {
                            if (util.checkCode(res)) {
                                imaradLayui('layer', function (layer) {
                                    layer.msg(res.data, {icon: 1})
                                })
                            }
                            _this.liveStatus = liveStatus;
                        }
                    };
                util.ajax(param);
            }


            // 获取直播(会议)统计数据
            _this.getStatistics = function (data) {
                var user_type = util.getUserType(),
                    url = user_type == '2' ? 'expert/get/liveCounts' : 'meeting/get/meetingCount',
                    postData = data;
                postData.liveId = util.getQueryString('Id');
                var param = {
                    url: url,
                    postData: postData,
                    showAjaxLoading: true,
                    successFn: function (res) {
                        if (util.checkCode(res) && res.data.length != 0) {
                            _this.makeData(res.data);
                        } else {
                            $('.statistics-main').html(util.noData())
                        }
                    }
                };
                util.ajax(param);
            }

            // 封装图表数据
            _this.makeData = function (data) {
                var echartData = {};
                echartData.dataAxis = [],
                    echartData.data = [];
                _.each(data, function (item) {
                    echartData.dataAxis.push(item.playTime);
                    echartData.data.push(item.totlePlay);
                })
                // 总观看次数
                $('.total-number').text(_this.totalNumber(echartData.data));
                require(['echarts'], function (echarts) {
                    // 如果是IE8提醒用户升级浏览器
                    if (document.all && document.querySelector && !document.addEventListener) {
                        var img = '<img src="./img/forie.png" style="width: 84%;height: 70%;margin-top: 10%">';
                        $('#main').css({'background':'#293c55','text-align':'center'}).html(img);
                    } else {
                        _this.canvas(echarts, echartData);
                    }
                })
            }

            // 计算总观看次数
            _this.totalNumber = function (array) {
                if (_.isArray(array)) {
                    var total = 0;
                    _.each(array, function (item) {
                        total += Number(item);
                    })
                    return total
                }
            }

            // 图表配置
            _this.canvas = function (echarts, data) {
                var dataAxis = data.dataAxis;
                var data = data.data;
                var yMax = _.max(data);
                var dataShadow = [];
                for (var i = 0; i < data.length; i++) {
                    dataShadow.push(yMax);
                }
                var option = {
                    title: {
                        text: '统计信息展示',
                        subtext: '注: 可以点击柱子放大或者进行鼠标缩放',
                        subtextStyle: {
                            color: 'red'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        data: dataAxis,
                        show: (function (dataAxis) {
                            var flag = true;
                            dataAxis.length > 40 ? flag = false : '';
                            return flag;
                        })(dataAxis),
                        axisLabel: {
                            data: dataAxis,
                            inside: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 85
                        },
                        z: 1155
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            name: '播放量',
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            {offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    )
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                            data: data
                        },
                    ]
                };
                // 先对目标节点解除echarts绑定，因为不能在同一个节点上绑定多个视图（修复从无数据跳到有数据不渲染的bug）
                echarts.dispose(document.getElementById('main'));
                var myChart = echarts.init(document.getElementById('main'));
                // 响应式
                window.onresize = myChart.resize;
                myChart.setOption(option);
                var zoomSize = 6;
                myChart.on('click', function (params) {
                    myChart.dispatchAction({
                        type: 'dataZoom',
                        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                    });
                });
            }

        }

        var main = new Main();

        return {
            render: render
        }
    })

// 修改当前正在播放的日程按钮事件
function pinned(element) {
    $(element).attr('live-flag', 1).addClass('now-setting').parents('tr').siblings('tr').find('.setting').removeClass('now-setting').hide();
}






