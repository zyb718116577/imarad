define([
        'text!./home.html', '$css!./home.css'
    ],
    function (html) {
        function render() {
            $('.view-window').html(html);
            // 显示公共底部
            utilIndex.showFooter();
            // 头部轮播图
            utilIndex.swiper('mySwiper1', '.swiper-container1', '.pagination1', '.arrow-left1', '.arrow-right1');
            // 底部轮播
            utilIndex.swiper('mySwiper2', '.swiper-container2', '.pagination2', '.arrow-left2', '.arrow-right2');
            // 配置AOS.js(放在最后不影响在IE8)
            AOS.init({
                easing: 'ease-out-back',
                duration: 1000,
            });
        }

        return {
            render: render
        }
    })

