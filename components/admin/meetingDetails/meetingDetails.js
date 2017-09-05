define([
        'text!./meetingDetails.html?v='+staticVersion, '$css!./meetingDetails.css?v='+staticVersion
    ],
    function (html) {
        function render() {

            $('.view-window').html(html);

            main.init();

        }

        function Main() {

            var _this = this;

            // 初始化页面
            _this.init = function () {
                // 如果是观众从关注会议页面跳转过来对应的处理
                if (util.getQueryString('types')) {
                    var type = {
                            'expert': '直播',
                            'meeting': '会议'
                        },
                        type_name = type[util.getQueryString('types')];
                } else {
                    // 如果是专家或者会议管理员从管理页面进入
                    var type_name = util.getUserType(true),
                        type_number = util.getUserType();
                }

                // 获取对应的详情信息
                _this.getDetails(type_number, function (data) {
                    data.type_number = type_number;
                    data.type_name = type_name;
                    _this.render(data);
                })
            }

            // 获取会议/直播详情
            _this.getDetails = function (type, callBack) {
                var liveId = util.getQueryString('Id'),
                    postData = {
                        liveId: liveId
                    },
                    requestUrl;
                // 如果是直播
                if (type == util.userArray[1].user_number || util.getQueryString('types') == 'expert') {
                    requestUrl = 'expert/get/liveInfo';
                    // 如果是会议
                } else if (type == util.userArray[2].user_number || util.getQueryString('types') == 'meeting') {
                    requestUrl = 'meeting/get/meetingDetails';
                }
                var param = {
                    url: requestUrl,
                    showAjaxLoading: true,
                    beforeLoading: true,
                    beforeLoadingContainer: '.meetingDetails-box',
                    postData: postData,
                    successFn: function (data) {
                        if (util.checkCode(data)) {
                            callBack(data.data)
                        }
                    }
                }
                util.ajax(param);
            }

            // 渲染页面
            _this.render = function (data) {
                if (util.getQueryString('type')) {
                    data.history = true;
                }
                imaradLayui('laytpl', function (laytpl) {
                    var htmls = $('#details-temp').html();
                    laytpl(htmls).render(data, function (html) {
                        $('.meetingDetails-box')[0].innerHTML = html;
                        imaradLayui('form', function (form) {
                            form.render();
                            //_this.bindEvent(form);
                        })
                    })
                })
            }

        }

        var main = new Main();

        return {
            render: render
        }
    })