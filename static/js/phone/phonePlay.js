var player, chat;
var paler = {
    chatSetup: function (id) {
        var chatUrl;
        if (id) {
            chatUrl = 'ws://chat.qcus.cn/' + id + (function () {
                    var params = window.location.search;
                    if (params && params.indexOf('name=') != -1) {
                        return params;
                    }

                    var id = Math.ceil(Math.random() * 1000);

                    return '?name=游客' + chatease.utils.pad(id, 3);
                })()
        } else {
            chatUrl = ''
        }
        var users;
        users = document.getElementById('audience');
        chat = chatease('chat').setup({
            url: chatUrl,
            width: 380,
            height: (function () {
                if (playease.utils.isMobile() && !playease.utils.isHorizontal()) {
                    var videoHeight = window.innerWidth * 9 / 16 + 50;
                    return window.innerHeight - videoHeight;
                }

                return 580;
            })(),
            maxretries: -1,
            events: {
                onIdent: function (e) {
                    //users.innerText = e.channel.total;
                },
                onMessage: function (e) {
                    player.shoot(e.data);
                },
                onUsers: function (e) {
                    //users.innerText = e.channel.total;
                },
                onExtern: function(e) {
                    forChat.init(e.data.slice(e.data.indexOf(':')+1));
                },
                onClose: function (e) {
                    //users.innerText = 0;
                }
            }
        });
    },
    playerSetup: function (playerUrl,loginImg) {
        if (player) {
            return;
        }

        player = playease('player').setup({
            width: 640,
            height: 400,
            aspectratio: '16:9',
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
            autoplay: true,
            //poster: 'images/poster.png',
            report: false,
            loader: {
                mode: 'cors'
            },
            logo: {
                file: loginImg
            },
            render: {
                name: 'def',
                swf: '../../../static/js/swf/playease.swf'
            },
            events: {
                onReady: function (e) {
                    if (chat) {
                        chat.resize();
                    }
                },
                onStopped: function () {
                    if (player) {
                        player.fullpage(true);
                        player.fullscreen(true);
                    }
                },
                onFullpage: function (e) {
                    normalFullpageStyle(e);
                }
            }
        });
        if (playease.utils.isMobile()) {
            window.addEventListener('resize', function (e) {
                setTimeout(function () {
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
    },
    init: function (playerUrl, loginImg, id,videoFlag) {
        paler.chatSetup(id);
        if(videoFlag){
            player = playease('player').setup({
                width: 640,
                height: 400,
                aspectratio: '16:9',
                file: videoFlag,
                mode: 'live',
                bufferTime: 1,
                maxretries: 0,
                controls: true,
                autoplay: true,
                //poster: 'images/poster.png',
                loader: {
                    mode: 'cors'
                },
                logo: {
                    file: loginImg
                },
                render: {
                    name: 'def',
                    swf: '../../../static/js/swf/playease.swf'
                },
                events: {
                    onReady: function (e) {
                        if (chat) {
                            chat.resize();
                        }
                    },
                    onFullpage: function (e) {
                        var pw = document.getElementById('playwrap');
                        pw.style.width = e.exit ? '' : '100%';
                        pw.style.height = e.exit ? '' : '100%';
                        pw.style.position = e.exit ? '' : 'fixed';
                        pw.style.zIndex = e.exit ? '' : 99999;
                        pw.style.top = e.exit ? '' : '0';
                        pw.style.left = e.exit ? '' : '0';
                        if (chat) {
                            chat.resize();
                        }
                    }
                }
            });
        }else{
            paler.playerSetup(playerUrl,loginImg)
        }

    },
    initPlayer: function (playerUrl, loginImg) {
        paler.playerSetup(playerUrl,loginImg);
    },
    initChat: function (id) {
        paler.chatSetup(id);
    }
}

function normalFullpageStyle(e) {
    var pw = document.getElementById('playwrap');
    pw.style.width = e.exit ? '' : '100%';
    pw.style.height = e.exit ? '' : '100%';
    pw.style.position = e.exit ? '' : 'fixed';
    pw.style.zIndex = e.exit ? '' : 9999;
    pw.style.top = e.exit ? '' : '0';
    pw.style.left = e.exit ? '' : '0';
    if (chat) {
        chat.resize();
    }
}
