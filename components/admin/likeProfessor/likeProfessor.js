define([
        'text!./likeProfessor.html?v='+staticVersion, '$css!./likeProfessor.css?v='+staticVersion
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);

            main.init(1, '', true, true);

        }


        var Main = function () {

            var _this = this;

            // 搜索条件
            _this.queryObj = '';

            _this.curpage = 1;

            // 页面初始化
            _this.init = function (page, queryObj, reRenderPageFlag, isQuery) {
                console.log(queryObj)
                var param = {
                    url: 'frame/get/frameList',
                    postData: {
                        frameName: 'expertList',
                        curPage: page || 1,
                        queryObj: queryObj || ''
                    },
                    beforeLoading: true,
                    beforeLoadingContainer: '.attention-bottom',
                    successFn: function (data) {
                        console.log(data)
                        if (util.checkCode(data)) {
                            if (isQuery) {
                                _this.renderQuery(data);
                            }
                            _this.render(data, queryObj, reRenderPageFlag);
                        }

                    },
                    errorFn: function () {
                        var noData = '<p class="no-data">暂无数据!</p>';
                        $(".attention-bottom")[0].innerHTML = noData;
                    }
                }
                util.ajax(param);
            }

            // 获取数据后渲染列表
            _this.render = function (data, queryObj, reRenderPageFlag) {
                if (reRenderPageFlag) {
                    _this.page(data.data.page.totalPages, queryObj)
                }
                var noData = util.noData();
                // 如果没数据
                if (!util.checkCode(data) || data.data.fieldDatas == null || data.data.fieldDatas.length == 0) {
                    $(".attention-bottom")[0].innerHTML = noData
                    return false;
                }
                // 有数据
                layui.use(['laytpl', 'form', 'layer'], function () {
                    var laytpl = layui.laytpl,
                        form = layui.form(),
                        layer = layui.layer,
                        getTpl = $("#likePro").html();

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
                        getTpl = $("#query").html();

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
                            _this.curpage = curr;
                            if (!first) {
                                _this.init(curr, query, false);
                            }
                        }
                    });
                })
            }

            // 关注、取消关注
            _this.attention = function (attentionIds) {
                var data = JSON.stringify(attentionIds);
                var param = {
                    url: 'audience/cancel/attentionExperts',
                    contentType: 'application/json',
                    postData: data,
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            main.init(_this.curpage, _this.queryObj, true, false);
                        }
                    }
                }
                util.ajax(param);
            }

            // 页面点击事件
            _this.bindEvent = function (form, layer) {
                // 跳转到专家详情页
                $("tr").on("click", function (event) {
                    var uId = $(this).attr('uid');
                    if (event.target.nodeName == 'TD' || event.target.nodeName == 'DIV' || event.target.nodeName == 'IMG') {
                        window.location.hash = "#professorDetails?uId=" + uId;
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
                    _this.init(1, JSON.stringify(queryObj), true);

                    _this.queryObj = JSON.stringify(queryObj);
                    return false;
                });

                // 关注、取消关注(多个专家)
                $('.default-like').click(function () {
                    if ($('.checkbox:checked').size() > 0) {
                        layer.confirm('确定取消关注选中专家吗？', {icon: 3, title: '取消关注'}, function (index) {
                            var idsArr = new Array();
                            $('.checkbox:checked').each(function (index, item) {
                                idsArr.push(Number($(item).parents('tr').attr('uid')))
                            })
                            _this.attention(idsArr);
                            layer.close(index);
                        })
                    }
                })

                // 取消关注(单个专家)
                $('.unfollow').click(function () {
                    var idsArr = new Array();
                    idsArr.push($(this).attr('uid'));
                    layer.confirm('确定取消关注该专家吗？', {icon: 3, title: '取消关注'}, function (index) {
                        _this.attention(idsArr);
                        layer.close(index);
                    })
                })

            }

        }

        var main = new Main();


        return {
            render: render
        }
    })




