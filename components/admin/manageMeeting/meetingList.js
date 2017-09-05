define([
        'text!./meetingList.html?v='+staticVersion, '$css!./meetingList.css?v='+staticVersion
    ],
    function (html) {
        function render() {

            $('.view-window').html(html);

            main.changeTitle();
            // 页面初始化
            main.init({
                page: 1,
                queryObj: '',
                reRenderPageFlag: true,
                renderQueryFlag: true
            });

            //chatease = undefined;

            //chat = undefined;
        }

        var Main = function () {

            var _this = this;

            // 根据不同的用户类型更改顶部header的名字
            _this.changeTitle = function () {
                var type = util.getUserType(true) || '';
                $('.user-type').text(type);
            }

            _this.frameName = util.getUserType() == 3 ? 'meetingManageList' : 'expertManageList';

            // 页面初始化 param{page:页码，queryObj：搜索条件对象，reRenderPageFlag：是否渲染分页，renderQueryFlag：是否渲染搜索列表}
            _this.init = function (param) {
                var ajaxParam = {
                    url: 'frame/get/frameList',
                    postData: {
                        frameName: _this.frameName,
                        curPage: param.page || 1,
                        queryObj: param.queryObj || ''
                    },
                    beforeLoading: true,
                    beforeLoadingContainer: '.attention-bottom',
                    successFn: function (data) {
                        // 跳转到前台播放的url
                        data.data.jumpUrl = util.getUserType() == 3 ? util.constants.WEB_MEETTING_URL : util.constants.WEB_EXPERT_URL;
                        if (util.checkCode(data)) {
                            if (param.renderQueryFlag) {
                                _this.renderQuery(data);
                            }
                            _this.render(data, param.queryObj, param.reRenderPageFlag);
                        }

                    },
                    errorFn: function () {
                        var noData = '<p class="no-data">暂无数据!</p>';
                        $(".attention-bottom")[0].innerHTML = noData
                    }
                }
                util.ajax(ajaxParam);
            }

            // 获取数据后渲染列表
            _this.render = function (data, queryObj, reRenderPageFlag) {
                // 是否渲染分页
                if (reRenderPageFlag) {
                    _this.page(data.data.page.totalPages, queryObj);

                }

                // 如果没数据
                var noData = util.noData();
                if (!util.checkCode(data) || data.data.fieldDatas == null || data.data.fieldDatas.length == 0) {
                    $('.attention-bottom')[0].innerHTML = noData;
                    return false;
                }
                // 有数据
                layui.use(['laytpl', 'form', 'layer'], function () {
                    var laytpl = layui.laytpl,
                        form = layui.form(),
                        layer = layui.layer,
                        getTpl = $('#likePro').html();

                    laytpl(getTpl).render(data.data, function (html) {
                        $(".attention-bottom")[0].innerHTML = html;
                        form.render();
                        // 渲染成功后绑定点击事件
                        _this.bindEvent(form, layer);
                    });
                })
            }

            // 渲染搜索条件
            _this.renderQuery = function (data) {
                if (!util.checkCode(data) || data.data.fieldDatas == null || data.data.fieldDatas.length == 0) {
                    return false;
                }
                // 有数据
                layui.use(['laytpl', 'form', 'layer'], function () {
                    var laytpl = layui.laytpl,
                        form = layui.form(),
                        layer = layui.layer,
                        getTpl = $('#query').html();

                    laytpl(getTpl).render(data.data, function (html) {
                        $(".content-top")[0].innerHTML = html;
                        form.render();
                        // 渲染成功后绑定点击事件
                        _this.bindEvent(form, layer);
                    });
                })
            }

            // 分页
            _this.page = function (totalPage, query) {
                imaradLayui('laypage', function () {
                    var laypage = layui.laypage;
                    laypage({
                        cont: 'page',
                        pages: totalPage,
                        skin: "#f1f1f1",
                        jump: function (obj, first) {
                            var curr = obj.curr;
                            if (!first) {
                                _this.init({
                                    page: curr,
                                    queryObj: query,
                                    reRenderPageFlag: false
                                });
                            }
                        }
                    });
                })
            }


            // 页面点击事件
            _this.bindEvent = function (form, layer) {
                // 跳转到专家详情页
                $("tr").on("click", function (event) {
                    var uId = $(this).attr('live_id');
                    if (event.target.nodeName == 'TD' || event.target.nodeName == 'DIV' || event.target.nodeName == 'IMG') {
                        window.location.hash = "#manageMeeting?Id=" + uId;
                        return false;
                    }
                })

                // 全选&取消全选
                form.on('checkbox(checkbox)', function (data) {
                    var flag = data.elem.checked.toString();
                    $(".checkbox").prop({"name": flag, "checked": data.elem.checked});
                    form.render('checkbox');
                });
                form.on('checkbox(checkbox1)', function (data) {
                    var flag = data.elem.checked;
                    flag ? data.elem.name = "true" : data.elem.name = "false";
                    var size = $(".checkbox[name='true']").size(), lenght = $(".checkbox").size();
                    size == lenght ? $(".chooseAll").prop("checked", true) : $(".chooseAll").removeProp("checked");
                    form.render('checkbox');
                });

                // 查询按钮点击事件
                form.on('submit(query)', function (data) {
                    var queryObj = data.field;
                    // 删除空项
                    for (var n in queryObj) {
                        if (data.field[n] == "" || data.field[n] == 0) {
                            delete data.field[n];
                        }
                    }
                    _.each($('.between'), function (item, index) {
                        var val = $(item).find('.between-item').eq(0).val() + "##" + $(item).find('.between-item').eq(1).val();
                        if (val != "##") {
                            var name = $(item).attr('name');
                            queryObj[name] = val;
                        }
                    })
                    _this.init({
                        page: 1,
                        queryObj: JSON.stringify(queryObj),
                        reRenderPageFlag: true
                    });
                    _this.queryObj = JSON.stringify(queryObj);
                    return false;
                });

                // 删除多个推送
                $('.default-like').click(function () {
                    if ($('.checkbox:checked').size() > 0) {
                        layer.confirm('确定删除选中项吗？', {icon: 3, title: '删除'}, function (index) {
                            var idsArr = new Array();
                            $('.checkbox:checked').each(function (index, item) {
                                idsArr.push(Number($(item).parents('tr').attr('live_id')))
                            })
                            _this.deletePush(idsArr);
                            layer.close(index);
                        })
                    }
                })

                // 删除推送(单个)
                $('.icon-delete').click(function () {
                    var idsArr = new Array();
                    idsArr.push($(this).parents('tr').attr('live_id'));
                    layer.confirm('确定删除该选中项吗？', {icon: 3, title: '删除'}, function (index) {
                        _this.deletePush(idsArr);
                        layer.close(index);
                    })
                })
            }

            // 头部关注推送，系统推送，浏览痕迹切换事件
            _this.tabBar = function () {
                imaradLayui('element', function (element) {
                    element.on('tab(docDemoTabBrief)', function (data) {
                        _this.frameName = data.index == 0 ? 'attentionPushList' : ( data.index == 1 ? 'systemPushList' : 'browseMarkList');
                        _this.init({
                            page: 1,
                            queryObj: '',
                            reRenderPageFlag: true,
                            renderQueryFlag: true
                        });
                        data.index == 2 ? $('.likeMeeting-query').hide() : $('.likeMeeting-query').show();
                    })
                })
            }


            // 删除会议
            _this.deletePush = function (linkId) {
                // 系统推送不提供删除
                var url = _this.frameName == 'meetingManageList' ? 'meeting/delete/historyMeeting' : 'expert/delete/liveInfo';
                var param = {
                    url: url,
                    postData: JSON.stringify(linkId),
                    contentType: 'application/json',
                    successFn: function (res) {
                        if (util.checkCode(res)) {
                            main.init({
                                page: 1,
                                queryObj: _this.queryObj,
                                reRenderPageFlag: true,
                                renderQueryFlag: false
                            });
                        }
                    }
                }
                util.ajax(param);
            }


        }

        var main = new Main();


        return {
            render: render
        }
    })