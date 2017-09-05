define([
        'text!./onlineClassroom.html', '$css!./onlineClassroom.css'
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);
            utilIndex.showFooter();

            // 头部轮播图
            utilIndex.swiper('mySwiper4', '.swiper-container4', '.pagination4', '.arrow-left4', '.arrow-right4');

            // 默认第一页
            var currentPage = 1;

            // 正在播放
            function myAjaxTolive(url, data, button) {
                utilIndex.myAjax({
                    url: url,
                    postData: data,
                    button: button || null,
                    successFn: function (res) {
                        if (res.code === 0) {
                            if(res.data.length <=0){
                                $('#onlineNodata').show();
                                $('#livePage').hide();
                            }else {
                                $('#livePage').show();
                                $('#onlineNodata').hide();
                            }
                            /* 替换数据 */
                            utilIndex.laytpl(liveListTpl, res.data, liveList);
                            $('.case-img-box').show();
                            $('.online-expert-box').hide();
                            $('.case-img-box-video').hide();
                            /*$('#livePage').show();*/
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            }

            // 历史回放的函数
            function myAjaxToVideo(url, data, button) {
                utilIndex.myAjax({
                    url: url,
                    postData: data,
                    button: button || null,
                    successFn: function (res) {
                        if (res.code === 0) {
                            if(res.data.length <=0){
                                $('#oldNodata').show();
                                $('#videoPage').hide();
                            }else {
                                $('#videoPage').show();
                                $('#oldNodata').hide();
                            }
                            /* 替换数据 */
                            utilIndex.laytpl(videoListTpl, res.data, videoList);
                            $('.case-img-box-video').show();
                            $('.case-img-box').hide();
                            $('.online-expert-box').hide();
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            }

            // 签约专家的函数
            function myAjaxToExpert(url, data, button) {
                utilIndex.myAjax({
                    url: url,
                    postData: data,
                    button: button,
                    successFn: function (res) {
                        if (res.code === 0) {
                            if(res.data.length <=0){
                                $('#expertNodata').show();
                                $('#expertPage').hide();
                                $('.online-expert-box').css('padding-top','0');
                            }else {
                                $('#expertPage').show();
                                $('#expertNodata').hide();
                                $('.online-expert-box').css('padding-top','15');
                            }
                            // 替换数据
                            utilIndex.laytpl(expertListTpl, res.data, expertList);
                            $('.case-img-box').hide();
                            $('.case-img-box-video').hide();
                            $('.online-expert-box').show();
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            }

            // 总条数的函数
            function allPage(url, data, type) {
                utilIndex.myAjax({
                    url: url,
                    postData: data,
                    successFn: function (res) {
                        if (res.code === 0) {
                            var allPage;
                            if (type === 0) {
                                allPage = Math.ceil(res.data / 4);
                                $('#allPage').val(allPage);
                            } else {
                                allPage = Math.ceil(res.data / 5);
                                $('#allPage').val(allPage);
                            }
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            }

            // 默认加载的数据
            myAjaxTolive('tourist/get/videoLiveList', {curPage: 1});
            allPage('tourist/get/totalRows', {pageType: 1}, 0)


            // 点击切换样式和内容
            $('.online-menu-list').find('li').each(function (index) {
                $(this).click(function () {
                    $(this).addClass('online-menu-list-active').siblings().removeClass('online-menu-list-active');
                    $('.online-next').removeAttr('disabled');
                    if (index === 0) {
                        // 跳转正在直播
                        myAjaxTolive('tourist/get/videoLiveList', {curPage: 1});
                        allPage('tourist/get/totalRows', {pageType: 1}, 0)
                        currentPage = 1;
                        /*urlFlag = 1;*/
                    } else if (index === 1) {
                        // 跳转历史回放
                        myAjaxToVideo('tourist/get/videoRecordList', {curPage: 1});
                        allPage('tourist/get/totalRows', {pageType: 2}, 0)
                        currentPage = 1;
                        /*urlFlag = 2;*/
                    } else {
                        // 跳转签约专家
                        myAjaxToExpert('tourist/get/expertInfoList', {curPage: 1});
                        allPage('tourist/get/totalRows', {pageType: 3}, 1);
                        currentPage = 1
                    }
                })
            })

            // 正在直播分页
            $('.online-one').click(function () {
                currentPage = 1;
                myAjaxTolive('tourist/get/videoLiveList', {curPage: currentPage}, $(this));
            });
            $('.online-pre').click(function () {
                currentPage--;
                if (currentPage < 1) {
                    currentPage = 1;
                    utilIndex.layerError('已经是第一页', 6, 200);
                    return;
                }
                myAjaxTolive('tourist/get/videoLiveList', {curPage: currentPage}, $(this));
            });
            $('.online-next').click(function () {
                currentPage++;
                if (currentPage > $('#allPage').val()) {
                    currentPage = $('#allPage').val();
                    utilIndex.layerError('已经是最后一页', 6, 200);
                    return;
                }
                myAjaxTolive('tourist/get/videoLiveList', {curPage: currentPage}, $(this));
            });
            $('.online-end').click(function () {
                currentPage = $('#allPage').val();
                myAjaxTolive('tourist/get/videoLiveList', {curPage: currentPage}, $(this));
            });

            // 历史回放分页
            $('.video-one').click(function () {
                currentPage = 1;
                myAjaxToVideo('tourist/get/videoRecordList', {curPage: currentPage}, $(this));
            });
            $('.video-pre').click(function () {
                currentPage--;
                if (currentPage < 1) {
                    currentPage = 1;
                    utilIndex.layerError('已经是第一页', 6, 200);
                    return;
                }
                myAjaxToVideo('tourist/get/videoRecordList', {curPage: currentPage}, $(this));
            });
            $('.video-next').click(function () {
                currentPage++;
                if (currentPage > $('#allPage').val()) {
                    currentPage = $('#allPage').val();
                    utilIndex.layerError('已经是最后一页', 6, 200);
                    return;
                }
                myAjaxToVideo('tourist/get/videoRecordList', {curPage: currentPage}, $(this));
            });
            $('.video-end').click(function () {
                currentPage = $('#allPage').val();
                myAjaxToVideo('tourist/get/videoRecordList', {curPage: currentPage}, $(this));
            });

            // 签约专家的分页
            $('.expert-one').click(function () {
                currentPage = 1;
                myAjaxToExpert('tourist/get/expertInfoList', {curPage: 1}, $(this));
            });
            $('.expert-pre').click(function () {
                currentPage--;
                if (currentPage < 1) {
                    currentPage = 1;
                    utilIndex.layerError('已经是第一页', 6, 200);
                    return;
                }
                myAjaxToExpert('tourist/get/expertInfoList', {curPage: currentPage}, $(this));
            });
            $('.expert-next').click(function () {
                currentPage++;
                if (currentPage > $('#allPage').val()) {
                    currentPage = $('#allPage').val();
                    utilIndex.layerError('已经是最后一页', 6, 200)
                    return;
                }
                myAjaxToExpert('tourist/get/expertInfoList', {curPage: currentPage}, $(this));
            });
            $('.expert-end').click(function () {
                currentPage = $('#allPage').val();
                myAjaxToExpert('tourist/get/expertInfoList', {curPage: currentPage}, $(this));
            });
        }

        return {
            render: render
        }
    })



