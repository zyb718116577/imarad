// 获取地址栏的参数
var ardLiveId = utilOther.getId();
$('.qrcode').find('img').attr('src', '../../../imarad/ability/make/QRCode?videoId='+ ardLiveId +'&videoType=2');

// 点击切换用户或者注销用户
$('body').click(function (e) {
    $('.logout-and-handover-box').hide();
});
$('.header-info-center').click(function (e) {
    var e = e || window.event;
    if(e.stopPropagation) { //W3C阻止冒泡方法
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
    $('.logout-and-handover-box').show();
});

// 点击弹出登录窗口(隐藏)
$('.login').click(function () {
    $('.account-disgraceful').show();
    $('.sign-all-box').show();
    return false;
});
$('.sign-all-box').click(function () {
    $('.account-disgraceful').hide();
    $(this).hide();
});
$('.sign').click(function (event) {
    event.stopPropagation();
});

document.onkeydown = function (event) {
    var e = event || window.event;
    var flag = $('.ardLive-video-password').css('display');
    var loginFlag = $('.sign3').hasClass('sign-active');
    var faterFlag = $('.sign-all-box').css('display');
    if (e && e.keyCode == 13) { //回车键的键值为13
        if (document.all) {  //只有ie识别
            e.cancelBubble = true;
            e.returnValue = false;
        } else {
            e.stopPropagation();
            e.preventDefault();
        }
        if (flag === 'block') {
            $('#surePassword').click();
        } else if (faterFlag === 'block') {
            if (!loginFlag) {
                $('#accountSubmit').click();
            } else {
                $('#iphoneSubmit').click();
            }
        }

    }
};

// 获取默认数据(录播)
utilOther.myAjax({
    url: 'tourist/get/videoInfo',
    postData: {videoId: ardLiveId},
    successFn: function (res) {
        var attentionFlag = res.data.attentionFlag;
        var expertId = res.data.uId;
        var videoPath = res.data.viodeInfo.videoPath;
        if (res.code === 0) {
            // 替换默认信息数据
            utilOther.laytpl(videInfoTpl1, res.data, videInfo1);
            utilOther.laytpl(videInfoTpl2, res.data, videInfo2);
            utilOther.laytpl(videInfoTpl3, res.data, videInfo3);
            $('.expert-live').show();
            // 初始化播放器和聊天室
            paler.init('','../../../img/login1.png',ardLiveId,videoPath);
            // 获取关注总人数
            utilOther.myAjax({
                url: 'tourist/get/attentionNum',
                postData: {
                    attentionId: expertId,
                    attentionType:1
                },
                successFn: function (res) {
                    if (res.code === 0) {
                        // 替换默认信息数据
                        if (attentionFlag === 0) {
                            $('#anchor').text('关注主播')
                        } else {
                            $('#anchor').text('取消关注')
                        }
                        utilOther.laytpl(attentionNumTpl, res, attentionNum);
                    } else {
                        utilOther.layerError(res.data, 5, 200);
                    }
                },
                errorFn: function (error) {

                }
            });
            // 关注和取消关注
            $('#anchor').click(function () {
                // 向后台发送关注主播的Ajax
                utilOther.myAjax({
                    url: 'averageUser/update/attention',
                    postData: {
                        attentionId: expertId,
                        attentionType: 1,
                    },
                    button: $(this),
                    successFn: function (res) {
                        if (res.code === 0) {
                            if ($('#anchor').text() == '关注主播') {
                                $('#anchor').text('取消关注');
                                utilOther.layerError('关注成功', 6, 200);
                                $('#attentionNum').text(parseInt($('#attentionNum').text()) + 1);
                            } else {
                                $('#anchor').text('关注主播');
                                utilOther.layerError('取消关注成功', 6, 200);
                                $('#attentionNum').text(parseInt($('#attentionNum').text()) - 1);
                            }
                        } else {
                            utilOther.layerError(res.msg, 5, 200);
                        }
                    },
                    errorFn: function (error) {

                    }
                });
            });
        } else {
            utilOther.layerError(res.data, 5, 200)
        }
    },
    errorFn: function (error) {

    }
});

//获取播放总量(录播)
utilOther.myAjax({
    url: 'tourist/get/videoPlayNum',
    postData: {videoId: ardLiveId},
    successFn: function (res) {
        if (res.code === 0) {
            utilOther.laytpl(videoPlayNumTpl, res, videoPlayNum);
        } else {
            utilOther.layerError(res.data, 5, 200)
        }
    },
    errorFn: function (error) {

    }
})

// 获取热门问题
utilOther.myAjax({
    url: 'tourist/get/liveCommit',
    successFn: function (res) {
        if (res.code === 0) {
            utilOther.laytpl(liveCommitTpl, res.data, liveCommit, function () {
                // 选择后台返回的问题
                $('.feedbackInfo').click(function () {
                    if ($(this).hasClass('defaultProblem')) {
                        $(this).removeClass('defaultProblem').addClass('selectedProblem');
                    } else {
                        $(this).removeClass('selectedProblem').addClass('defaultProblem');
                    }
                });
            });
        } else {
            utilOther.layerError(res.data, 5, 200)
        }
    },
    errorFn: function (error) {

    }
});

// 问题反馈
$('#feedBack').click(function () {
    $('.ardLive-video-problem').show();
});

// 点击关闭热门问题弹窗
$('#close').click(function () {
    $('.ardLive-video-problem').hide()
});

// 点击向后台发送问题反馈
$('#problemFeedback').click(function () {
    var commitDesc = '';
    $('.feedbackInfo').each(function (index, item) {
        if ($(item).hasClass('selectedProblem')) {
            commitDesc = commitDesc + $(item).text() + ',';
        }
    });
    commitDesc = commitDesc + $('#feedbackInfoTextarea').val();
    if (commitDesc != '') {
        commitDesc = commitDesc.substring(0, commitDesc.length - 1)
    }
    $('#feedbackInfoTextarea').keyup(function () {
        if ($.trim($(this).val()) === '') {
            this.value = ''
        }
    });
    if (commitDesc === '') {
        utilOther.layerError('问题反馈不能为空', 5, 200);
    } else {
        // 向后台发送问题反馈Ajax
        utilOther.myAjax({
            url: 'tourist/save/liveCommit',
            postData: {
                videoId: ardLiveId,
                liveType: 2,
                commitDesc: commitDesc
            },
            button: $(this),
            successFn: function (res) {
                if (res.code === 0) {
                    utilOther.layerError('问题反馈成功', 6, 200);
                    $('.ardLive-video-problem').hide()
                } else {
                    utilOther.layerError(res.data, 5, 200)
                }
            },
            errorFn: function (error) {

            }
        });
    }
});








