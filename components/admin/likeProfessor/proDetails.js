define([
        'text!./proDetails.html?v='+staticVersion, '$css!./proDetails.css?v='+staticVersion
    ],
    function (html) {
        function render() {

            $('.view-window').html(html);

            main.init();

        }

        function Main() {

            var _this = this;

            // 页面初始化
            _this.init = function(){
                _this.getProDetails();
                _this.getAllVideo(util.getQueryString('uId'),1,true);
            }

            // 根据UID获取专家信息
            _this.getProDetails = function () {
                var param = {
                    url: 'audience/get/expertsDetails',
                    beforeLoading: true,
                    beforeLoadingContainer: '.attention-main',
                    postData: {
                        'attentionId': util.getQueryString('uId')
                    },
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            _this.renderPro(data.data);
                        }
                    }
                }
                util.ajax(param);
            }

            // 渲染专家信息
            _this.renderPro = function (data) {
                if (data.imaradUserInfoEntity.userPlace) {
                    data.imaradUserInfoEntity.userPlaceExtend = data.imaradUserInfoEntity.userPlace.split('_')[3];
                }
                imaradLayui('laytpl', function (laytpl) {
                    var getTpl = $("#proDetailTemp").html();
                    laytpl(getTpl).render(data, function (html) {
                        $(".attention-main")[0].innerHTML = html;
                        //渲染完成后绑定事件
                        _this.bindEvnet();
                    });
                })
            }

            // 取消、添加关注/averageUser/update/attention
            _this.attentionEvnet = function (ele) {
                var param = {
                    url: 'averageUser/update/attention',
                    postData: {
                        'attentionId': util.getQueryString('uId'),
                        'attentionType': 1
                    },
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            layer.msg('操作成功!', {icon: 1});
                            $(ele).text() == '取消关注' ? $(ele).text('添加关注') : $(ele).text('取消关注');
                        }
                    }
                }
                util.ajax(param);
            }

            // 获取专家所有视频(uid:专家ID，page:页码,renderPage:是否渲染分页)
            _this.getAllVideo = function (uid,page,renderPage) {
                var param = {
                    url: 'audience/get/expertsVideo',
                    postData: {
                        'attentionId': uid,
                        'currentPage':  page
                    },
                    beforeLoading: true,
                    beforeLoadingContainer: '.tab-content',
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            _this.renderVideo(data,renderPage);
                        }
                    }
                };
                util.ajax(param);
            }
            
            // 渲染专家所有视频
            _this.renderVideo = function (response,renderPage) {
                // 如果没数据
                if ( response.data.expertVideoList == null || response.data.expertVideoList.length == 0) {
                    var noData = util.noData();
                    $(".tab-content")[0].innerHTML = noData;
                    return false;
                }
                // 有数据
                imaradLayui('laytpl', function (laytpl) {
                    var getTpl = $("#allvideo-temp").html();
                    laytpl(getTpl).render(response.data, function (html) {
                        $(".tab-content")[0].innerHTML = html;
                        //渲染完成后绑定事件
                        _this.bindEvnet();
                    });
                    // header视频数量
                    var totalNumber = response.data.page.totalRows;
                    $('#video-number').text('('+totalNumber+')');
                    if (renderPage){
                        _this.page(response.data.page.totalPages);
                    }
                })
            }

            // 分页
            _this.page = function (totalPage) {
                imaradLayui('laypage', function (laypage) {
                    laypage({
                        cont: 'page',
                        pages: totalPage,
                        skin: "#f1f1f1",
                        jump: function (obj, first) {
                            var curr = obj.curr;
                            if (!first) {
                                _this.getAllVideo(util.getQueryString('uId'),curr,false);
                            }
                        }
                    });
                })
            }

            // 页面交互事件
            _this.bindEvnet = function () {
                $('.no-like').click(function () {
                    _this.attentionEvnet($(this));
                })
            }
        }

        var main = new Main();

        return {
            render: render
        }
    })
