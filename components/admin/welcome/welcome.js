define([
        'text!./welcome.html?v='+staticVersion, '$css!./welcome.css?v='+staticVersion
    ],
    function(html){
        function render(){
            $('.view-window').html(html);

            // 去掉左侧菜单的高亮显示
            $('.menulit-active').removeClass("menulit-active");
        }



        return {
            render:render
        }
    })





