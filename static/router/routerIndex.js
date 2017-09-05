/**
 * Created by zyb on 2017/3/21.
 * 此文件为路由配置文件，包括整个系统路由
 */
define(['backbone'], function () {
    //点击时切换公共头部的样式（公共页面）
    function activeMenuList(info){
        $("."+info).addClass("nav-active").parents("li").siblings("li").find("a").removeClass("nav-active");
    }
    var Router = Backbone.Router.extend({
        //路由配置
        routes: {
            //主页
            "home": function () {
                require(['./components/web/home/home.js?v=' + staticVersion], function (home) {
                    activeMenuList("home")
                    home.render();
                })
            },
            "liveService": function () {
                require(['./components/web/liveService/liveService.js?v=' + staticVersion], function (liveService) {
                    activeMenuList("liveService")
                    liveService.render();
                })
            },
            "curstomerCase": function () {
                require(['./components/web/curstomerCase/curstomerCase.js?v=' + staticVersion], function (curstomerCase) {
                    activeMenuList("curstomerCase")
                    curstomerCase.render();
                })
            },
            "onlineClassroom": function () {
                require(['./components/web/onlineClassroom/onlineClassroom.js?v=' + staticVersion], function (onlineClassroom) {
                    activeMenuList("onlineClassroom")
                    onlineClassroom.render();
                })
            },
            "aboutUs": function () {
                require(['./components/web/aboutUs/aboutUs.js?v=' + staticVersion,'./static/plugin/baidu.js'], function (aboutUs) {
                    activeMenuList("aboutUs")
                    aboutUs.render();
                })
            },
            "soSpecialist": function () {
                require(['./components/web/soSpecialist/soSpecialist.js?v=' + staticVersion], function (soSpecialist) {
                    soSpecialist.render();
                })
            },
            "*actions": function () {
                location.hash = "home";
            }
        }


    });

    var router = new Router();
    return router;

});


