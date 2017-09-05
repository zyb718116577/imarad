define([
        'text!./soSpecialist.html', '$css!./soSpecialist.css'
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);
            $('#online').addClass('nav-active');
            // 获取地址栏的参数
            var expertId = utilIndex.getRequest();
            // 默认数据(专家信息)
            utilIndex.myAjax({
                url: 'tourist/get/expertInfo',
                postData: {expertId: expertId},
                successFn: function (res) {
                    if (res.code === 0) {
                        // 替换数据
                        utilIndex.laytpl(expertInfoTpl1, res.data, expertInfo1);
                        utilIndex.laytpl(expertInfoTpl2, res.data, expertInfo2);
                        // 判断用户是否关注
                        if(res.data.attentionFlag === 0){
                            $('#follow').text('关注')
                        }else {
                            $('#follow').text('取消关注')
                        }
                        // 点击关注按钮
                        $('#follow').click(function () {
                            // 发送关注Ajax
                            utilIndex.myAjax({
                                url: 'averageUser/update/attention',
                                postData: {
                                    attentionId: expertId,
                                    attentionType: 1,
                                },
                                button: $(this),
                                successFn: function (res) {
                                    if (res.code === 0) {
                                        if($('#follow').text() == '关注'){
                                            utilIndex.layerError('关注成功', 6, 200);
                                            $('#follow').text('取消关注');
                                            $('.so-specialist-follow-p1').text(parseInt($('.so-specialist-follow-p1').text())+1);
                                        }else{
                                            utilIndex.layerError('取消关注成功', 6, 200);
                                            $('#follow').text('关注');
                                            $('.so-specialist-follow-p1').text(parseInt($('.so-specialist-follow-p1').text())-1);
                                        }
                                    } else {
                                        utilIndex.layerError(res.msg, 5, 200);
                                    }
                                },
                                errorFn: function (error) {

                                }
                            });

                        });
                    } else {
                        utilIndex.layerError(res.msg, 5, 200);
                    }
                },
                errorFn: function (error) {

                }
            });

            // 获取关注度
            utilIndex.myAjax({
                url: 'tourist/get/attentionNum',
                postData: {
                    attentionId: expertId,
                    attentionType: 1,
                },
                successFn: function (res) {
                    if (res.code === 0) {
                        // 替换数据
                        utilIndex.laytpl(attentionNumTpl, res, attentionNum);
                    } else {
                        utilIndex.layerError(res.msg, 5, 200);
                    }
                },
                errorFn: function (error) {

                }
            });

            // 获取总播放量
            utilIndex.myAjax({
                url: 'tourist/get/totalPlayNum',
                postData: {expertId: expertId},
                successFn: function (res) {
                    if (res.code === 0) {
                        // 替换数据
                        utilIndex.laytpl(playNumTpl, res, playNum);
                    } else {
                        utilIndex.layerError(res.msg, 5, 200);
                    }
                },
                errorFn: function (error) {

                }
            });

            // 获取专家所有视频
            utilIndex.myAjax({
                url: 'tourist/get/videoList',
                postData: {
                    curPage: 1,
                    expertId: expertId
                },
                successFn: function (res) {
                    if (res.code === 0) {
                        if(res.data.length > 0){
                            $('#nodaImg').hide()
                        }else {
                            $('#nodaImg').show()
                        }
                        // 替换数据
                        utilIndex.laytpl(allSpecialistVideoTpl, res.data, allSpecialistVideo);
                    } else {
                        utilIndex.layerError(res.msg, 5, 200);
                    }
                },
                errorFn: function (error) {

                }
            });


            var currentPage = 1;
            /* 点击上一页 */
            $('.pre').click(function () {
                currentPage--;
                if (currentPage < 1) {
                    utilIndex.layerError('已经是第一页', 6, 200);
                    currentPage = 1;
                }
                /* 发送分页Ajax */
                utilIndex.myAjax({
                    url: 'tourist/get/videoList',
                    postData: {
                        curPage: currentPage,
                        expertId: expertId
                    },
                    button: $(this),
                    successFn: function (res) {
                        if (res.code === 0) {
                            utilIndex.laytpl(allSpecialistVideoTpl, res.data, allSpecialistVideo);
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            });
            /* 点击下一页 */
            $('.next').click(function () {
                currentPage ++;
                /* 发送分页Ajax */
                utilIndex.myAjax({
                    url: 'tourist/get/videoList',
                    postData: {
                        curPage: currentPage,
                        expertId: expertId
                    },
                    button: $(this),
                    successFn: function (res) {
                        if (res.code === 0) {
                            if (res.data.length === 0) {
                                utilIndex.layerError('已经是最后一页', 6, 200);
                                currentPage--;
                            } else {
                                utilIndex.laytpl(allSpecialistVideoTpl, res.data, allSpecialistVideo);
                            }
                        } else {
                            utilIndex.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            });

        }

        return {
            render: render
        }
    })




