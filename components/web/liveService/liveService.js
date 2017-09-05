define([
        'text!./liveService.html', '$css!./liveService.css'
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);

            // 显示公共底部
            utilIndex.showFooter();

            // 左侧的导航
            $(window).scroll(function () {
                var scrollt = document.documentElement.scrollTop + document.body.scrollTop;
                if (scrollt > 450 && scrollt < 1400) {
                    $(".left-nav").show();
                } else {
                    $(".left-nav").stop().hide();
                }
            });

            // 定位到指定位置
            function GetRequest() {
                var url = document.location.href; //获取url中"?"符后的字串
                var strs = url.split("=");
                return strs[strs.length - 1];
            }

            var someId = GetRequest();

            function locationTo(position, distance) {
                $("html,body").animate({scrollTop: ($("#" + position).offset().top - distance)}, 500);
            }

            // 顶部导航出发
            if (cookie.getCookie('id') == 1) {
                if (navigator.appName === 'Microsoft Internet Explorer'&& navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 8.0/i)) {
                    //判断是否是IE浏览器
                    locationTo('applicationScenarios', 0);
                }else{
                    locationTo('applicationScenarios', 80);
                }
                cookie.delCookie('id', '/');
            }

            if (cookie.getCookie('id') == 2) {
                if (navigator.appName === 'Microsoft Internet Explorer'&& navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/MSIE 8.0/i)) {
                    //判断是否是IE浏览器
                    locationTo('productAdvantage', 0);
                }else{
                    locationTo('productAdvantage', 80);
                }
                cookie.delCookie('id', '/');
            }

            // 左侧导航点击事件触发
            $('#toApplicationScenarios').click(function () {
                locationTo('applicationScenarios', 0);
            });
            $('#toProductAdvantage').click(function () {
                locationTo('productAdvantage', 0);
            });

            // 配置AOS.js(放在最后不影响在IE上的操作)
            AOS.init({
                easing: 'ease-out-back',
                duration: 1000,
            });
        }

        return {
            render: render
        }
    })

