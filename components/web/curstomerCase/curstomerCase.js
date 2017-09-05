define([
        'text!./curstomerCase.html', '$css!./curstomerCase.css'
    ],
    function(html){
        function render(){
            $('.view-window').html(html);
            utilIndex.showFooter();
            // 头部轮播图
            utilIndex.swiper('mySwiper3','.swiper-container3','.pagination3','.arrow-left3','.arrow-right3');
            // 点击切换样式
            $('.menu-list').find('li').each(function (index) {
                $(this).click(function () {
                    $(this).addClass('menu-list-active').siblings().removeClass('menu-list-active');
                    if(index === 0){
                        $('.industry-case-img').show();
                        $('.teaching-case-img').hide();
                    }else{
                        $('.industry-case-img').hide();
                        $('.teaching-case-img').show();
                    }
                });
            })
        }
        return {
            render:render
        }
    })


