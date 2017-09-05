define([
        'text!./safety.html?v='+staticVersion, '$css!./safety.css?v='+staticVersion
    ],
    function(html){
        function render(){

            $('.view-window').html(html);

            main.init();

        }

        function Main(){

            var _this = this;

            //初始化
            _this.init = function () {
                _this.getUserInfo();
            }

            // 獲取用戶信息
            _this.getUserInfo = function () {
                var param = {
                    url: 'user/get/userInfo',
                    showAjaxLoading: true,
                    successFn: function (res) {
                        if (util.checkCode(res)) {
                            _this.render(res);
                        }
                    }
                }
                util.ajax(param);
            }

            // 处理页面显示
            _this.render = function (response) {
                var _that = jQuery,responses = response.data;
                if (responses.emailAddress){
                    _that('.chnage-icon').addClass('icon-zhengque').css('color','#01a0d8');
                    _that('.bind-email-tips').text('已绑定邮箱 : '+ responses.emailAddress);
                    _that('.bind-email-btn').text('更换邮箱');
                }
                if (responses.phoneNum){
                    _that('.bind-phone-tips').text('已绑定手机 : '+responses.phoneNum);
                }
            }
        }


        var main = new Main();


        return {
            render:render
        }
    })




