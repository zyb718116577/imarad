// 获取地址栏的参数
var liveId = utilOther.getId();
$('.qrcode').find('img').attr('src', '../../../imarad/ability/make/QRCode?videoId=' + liveId + '&videoType=1');
// 点击切换用户或者注销用户
$('body').click(function (e) {
    $('.logout-and-handover-box').hide();
});
$('.header-info-center').click(function (e) {
    var e = e || window.event;
    if (e.stopPropagation) { //W3C阻止冒泡方法
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
// 是否输入观看密码的标识
var checkFlag = 0;
/*localStorage.clear();*/
// 判断用户是否输入过观看密码
if (localStorage.getItem('info')) {
    var allInfo = JSON.parse(localStorage.getItem('info'));
    $(allInfo).each(function (index, item) {
        if (item.id === liveId && (item.endTime - (new Date()).getTime()) > 0) {
            checkFlag = 1;
        }
    });
}
var cdnUrl;
var livePushUrl;
var playFlag = 0;
function getUrl(data) {
    var playerUrl = data;
    playerUrl = playerUrl.split('|');
    var url = [];
    for (var i = 0; i < playerUrl.length; i++) {
        if (playerUrl[i].slice(0, 4) === 'http' && (playerUrl[i].slice(playerUrl[i].length - 4, playerUrl[1].length) === 'm3u8')) {
            url.push(playerUrl[i]);
        }
        if (playerUrl[i].slice(0, 4) === 'http' && (playerUrl[i].slice(playerUrl[i].length - 4, playerUrl[1].length) === 'flv')) {
            url.push(playerUrl[i]);
        }
    }
    return url;
}
// 获取默认数据(直播)
utilOther.myAjax({
    url: 'tourist/get/liveInfo',
    postData: {
        liveId: liveId,
        checkFlag: checkFlag,
    },
    successFn: function (res) {
        if (res.code === 0) {
            var expertId = res.data.liveInfo.uId;
            var attentionFlag = res.data.attentionFlag;
            var img = res.data.liveInfo.picPath;
            var attentionType = res.data.attentionType;
            cdnUrl = res.data.liveInfo.cdnUrl;
            livePushUrl = res.data.liveInfo.livePushUrl;
            cdnUrl ? playFlag = 1 : playFlag = 0;
            // 判断视频的状态
            switch (res.data.liveInfo.liveStatus) {
                // 停播
                case -1:
                    paler.initChat(liveId,userName);
                    $('#ardLiveVideoImg').attr('src','../../../img/suspension.jpg');
                    break;
                // 未开始
                case 0:
                    paler.initChat(liveId,userName);
                    if (img !== '') {
                        $('#ardLiveVideoImg').attr('src', '../../../imarad/image/' + img);
                        $('.live-type').text('')
                    }else{
                        $('#ardLiveVideoImg').attr('src','../../../img/not-begin.jpg');
                        /*$('.live-type').text('直播未开始，请等待......')*/
                    }
                    break;
                // 正在播放
                case 1:
                    // 判断是否需要输入观看密码
                    if (cdnUrl) {
                        // 播放地址
                        $('#ardLiveVideoImg').hide();
                        paler.init(livePushUrl,'../../../img/login1.png',liveId,'',userName);
                    }else{
                        paler.initChat(liveId,userName);
                        $('#ardLiveVideoImg').attr('src','../../../img/suspen.jpg');
                        $('.account-disgraceful').show();
                        $('.ardLive-video-password').show();
                    }
                    break;
                // 暂停
                case 2:
                    paler.initChat(liveId,userName);
                    $('#ardLiveVideoImg').attr('src','../../../img/suspend.jpg');
                    break;
            }
            // 替换头部数据
            utilOther.laytpl(liveInfoTpl1, res.data, liveInfo1);
            utilOther.laytpl(liveInfoTpl2, res.data, liveInfo2);
            // 专家直播
            $('.expert-live').show();
            utilOther.laytpl(liveInfoTpl3, res.data, liveInfo3);

            // 获取关注总人数
            utilOther.myAjax({
                url: 'tourist/get/attentionNum',
                postData: {
                    attentionId: expertId,
                    attentionType: 1,
                },
                successFn: function (res) {
                    if (res.code === 0) {
                        // 替换默认信息数据
                        utilOther.laytpl(attentionNumTpl, res, attentionNum);
                        if (attentionFlag === 0) {
                            $('#anchor').text('关注主播')
                        } else {
                            $('#anchor').text('取消关注')
                        }
                    } else {
                        utilOther.layerError(res.msg, 5, 200);
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
            utilOther.layerError(res.msg, 5, 200);
        }
    },
    errorFn: function (error) {

    }
});

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
            })
        } else {
            utilOther.layerError(res.msg, 5, 200);
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
        alert('问题反馈不能为空！')
    } else {
        // 向后台发送问题反馈Ajax
        utilOther.myAjax({
            url: 'tourist/save/liveCommit',
            postData: {
                videoId: liveId,
                liveType: 1,
                commitDesc: commitDesc
            },
            button: $(this),
            successFn: function (res) {
                if (res.code === 0) {
                    $('.ardLive-video-problem').hide();
                    utilOther.layerError('问题反馈成功', 6, 200);
                } else {
                    utilOther.layerError(res.msg, 5, 200);
                }
            },
            errorFn: function (error) {

            }
        });
    }
});

// 点击验证密码是否错误
$('#surePassword').click(function () {
    if ($.trim($('#videoPassword').val()) === '') {
        utilOther.layerError('密码不能为空', 5, 200);
    } else {
        utilOther.myAjax({
            url: 'tourist/check/authority',
            postData: {
                checkCode: $('#videoPassword').val(),
                liveId: liveId,
            },
            button: $(this),
            successFn: function (res) {
                if (res.code === 0) {
                    // 把此视频的id和输入的时间存储在本地
                    var arr = [];
                    var obj = {};
                    var d1 = new Date();
                    var d2 = new Date(d1);
                    d2.setDate(d1.getDate() + 7);
                    obj.id = liveId,
                        obj.endTime = d2.getTime();
                    arr.push(obj);
                    if (!localStorage.getItem('info')) {
                        localStorage.setItem('info', JSON.stringify(arr));
                    } else {
                        var a = JSON.parse(localStorage.getItem('info'));
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].id === liveId) {
                                a.splice(i, 1);
                            }
                            var b = arr.concat(a);
                            localStorage.setItem('info', JSON.stringify(b));
                        }
                        ;
                    }
                    $('.ardLive-video-password').hide();
                    $('.account-disgraceful').hide();
                    // 加载视频
                    $('#ardLiveVideoImg').hide();
                    livePushUrl = res.data.livePushUrl;
                    paler.initPlayer(livePushUrl,'../../../img/login1.png');
                    playFlag = 1;
                } else {
                    utilOther.layerError(res.msg, 5, 200);
                }
            },
            errorFn: function (error) {

            }
        });

    }
});
// 给聊天室写的接口
var forChat = {
    init: function (type) {
        switch (type){
            // 停播
            case '-1':
                if(player){
                    player.fullpage(true);
                    player.fullscreen(true);
                    player.stop();
                    player = undefined;
                    normalFullpageStyle({exit:true});
                }
                $('#playwrap').hide();
                $('#ardLiveVideoImg').attr('src','../../../img/suspension.jpg');
                $('#ardLiveVideoImg').show();
                $('.ardLive-video-password').hide();
                $('.account-disgraceful').hide();
                break;
            // 正在播放
            case '1':
                if(playFlag === 1){
                    $('#playwrap').show();
                    $('#ardLiveVideoImg').hide();
                    paler.initPlayer(livePushUrl,'../../../img/login1.png');
                }else{
                    $('#ardLiveVideoImg').attr('src','../../../img/suspen.jpg');
                    $('.account-disgraceful').show();
                    $('.ardLive-video-password').show();
                }
                break;
            // 暂停
            case '2':
                if(player){
                    player.fullpage(true);
                    player.fullscreen(true);
                    player.stop();
                    player = undefined;
                    normalFullpageStyle({exit:true});
                }
                $('#playwrap').hide();
                $('#ardLiveVideoImg').attr('src','../../../img/suspend.jpg');
                $('#ardLiveVideoImg').show();
                $('.ardLive-video-password').hide();
                $('.account-disgraceful').hide();
                break;
        }
    }
};
























