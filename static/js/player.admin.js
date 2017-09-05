var player, chat, changeStatusCallBacks;
var paler = {
    init: function (playerUrl,id,loginImg,changeStatusCallBack) {
        // 更改直播状态后的回调函数
        changeStatusCallBacks = changeStatusCallBack;

        // 播放器和聊天室宽高的变化
        var chatUrl;
        if(id){
            chatUrl = 'ws://chat.qcus.cn/' + id + '?name=&role=48'
        }else {
            chatUrl = ''
        }
        window.onload = function () {
            changeDivHeight();
        };
        $(window).resize(function () {
            changeDivHeight();
        });
        function changeDivHeight() {
            if ($(window).width() > 1440) {
                $('.ardLive-video').css('width', 960);
                $('.ardLive-video').css('height', 580);
                $('.ardLive-comment').css('width', 380);
                $('.ardLive-comment').css('height', 580);
                $('.ardLive-comment').show();
            } else if ($(window).width() <= 1060) {
                $('.ardLive-video').css('width', 960);
                $('.ardLive-video').css('height', 580);
                $('.ardLive-comment').hide();
            } else {
                $('.ardLive-video-box').css('height',($(window).width()-100) * 0.405 + 40)
                $('.ardLive-video').css('width', ($(window).width()-100) * 0.72);
                $('.ardLive-video').css('height', '100%');
                $('.ardLive-comment').css('width', ($(window).width()-100) * 0.28);
                $('.ardLive-comment').css('height', '100%');
                $('.ardLive-comment').show();
            }

            if (player) {
                player.resize();
            }
            if (chat) {
                chat.resize();
            }
        }


        var users;

        users = document.getElementById('audience');
        player = playease('player').setup({
            width: 640,
            height: 400,
            aspectratio: '16:9',
            //file: '/vod/sample.mp4',
            /*http://192.168.2.51/vod/sample.2.mp4*/
            sources: (function() {
                var sources = [];
                var urls = playerUrl.split('|');
                for (var i = 0; i < urls.length; i++) {
                    var file = urls[i];
                    var label = '';
                    var matched = true;

                    var protocol = playease.utils.getProtocol(file);
                    if (protocol == 'rtmp' || protocol == 'rtmpe') {
                        continue;
                    }

                    var extension = playease.utils.getExtension(file);
                    switch (extension) {
                        case 'flv':
                        case undefined:
                            label = 'HTTP-FLV';
                            if (playease.utils.isAndroid()) {
                                matched = false;
                            }
                            break;
                        case 'm3u8':
                            label = 'HLS';
                            break;
                        default:
                            matched = false;
                            break;
                    }

                    if (matched) {
                        sources.push({
                            file: file,
                            label: label
                        });
                    }
                }

                return sources;
            })(),
            mode: 'live',
            bufferTime: 1,
            maxretries: 0,
            controls: true,
            autoplay: false,
            //poster: 'images/poster.png',
            loader: {
                mode: 'cors'
            },
            logo: {
                file: loginImg
            },
            render: {
                name: 'flash',
                swf: '../../../static/js/swf/playease.swf'
            },
            events: {
                onReady: function(e) {
                    if (chat) {
                        chat.resize();
                    }
                },
                onFullpage: function(e) {
                    var pw = document.getElementById('playwrap');
                    pw.style.width = e.exit ? '' : '100%';
                    pw.style.height = e.exit ? '' : '100%';
                    pw.style.position = e.exit ? '' : 'fixed';
                    pw.style.zIndex = e.exit ? '' : 100;
                    pw.style.top = e.exit ? '' : '0';
                    pw.style.left = e.exit ? '' : '0';
                    if (chat) {
                        chat.resize();
                    }
                },
                onFullscreen: function(e) {
                    if (e.exit) {
                        $('.header').show();
                        $('#admin-side').show();
                    } else {
                        $('.header').hide();
                        $('#admin-side').hide();
                        $('.layui-tab').css('margin',0)
                    }
                    $('.view-window').css('margin',e.exit?'':0);
                }
            }
        });

        chat = chatease('chat').setup({
            url: chatUrl,
            width: 380,
            height: (function() {
                if (playease.utils.isMobile() && !playease.utils.isHorizontal()) {
                    var videoHeight = window.innerWidth * 9 / 16 + 50;
                    return window.innerHeight - videoHeight;
                }

                return 580;
            })(),
            maxretries: -1,
            render: {
                name: 'def',
                swf: '../../../static/js/swf/chatease.swf'
            },
            skin: {
                name: 'def'
            }
        });

        chat.addEventListener(chatease.events.CHATEASE_INDENT, onChatIdent);
        chat.addEventListener(chatease.events.CHATEASE_MESSAGE, onChatMessage);
        chat.addEventListener(chatease.events.CHATEASE_USERS, onChatUsers);
        chat.addEventListener(chatease.events.CHATEASE_EXTERN, onChatExtern);
        chat.addEventListener(chatease.events.CHATEASE_CLOSE, onChatClose);

        if (playease.utils.isMobile()) {
            window.addEventListener('resize', function(e) {
                setTimeout(function() {
                    var pw = document.getElementById('playwrap');
                    var cw = document.getElementById('chatwrap');
                    if (!playease.utils.isHorizontal()) {
                        var videoHeight = window.innerWidth * 9 / 16 + 50;
                        cw.style.height = (window.innerHeight - videoHeight) + 'px';
                    } else {
                        cw.style.height = pw.clientHeight + 'px';
                    }

                    player.fullscreen(!playease.utils.isHorizontal());
                }, 500);
            });
        }
    }
}

function onChatIdent(e) {
    //users.innerText = e.channel.total;
}

function onChatMessage(e) {
    player.shoot(e.data);
}

function onChatUsers(e) {
    //users.innerText = e.channel.total;
}

function onChatExtern(e) {
    if(e.data.indexOf(':')!=-1){
        changeStatusCallBacks(e.data.split(':')[1]);
    } else {
        changeStatusCallBacks();
    }
}

function onChatClose(e) {
    //users.innerText = 0;
}
