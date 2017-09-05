/**
 * Created by zyb on 2017/3/21.
 * 此文件为路由配置文件，包括整个系统路由
 */
define(['backbone'],function(){

    //切换左侧栏tabBar选中样式menulit-active
    function activeMenuList(id){
        $("#"+id).addClass("menulit-active")
            .parents("li").siblings("li")
            .find("a").removeClass("menulit-active");
    }

    var Router = Backbone.Router.extend({
        //路由配置
        routes: {
            //个人信息
            "info": function () {
                require(['./components/admin/info/info.js?v='+staticVersion,
                        '/static/js/imarad.area.js',
                        '/static/json/CityJson.js',
                        '/static/json/DistrictJson.js',
                        '/static/json/ProJson.js'
                ],function(info){
                    activeMenuList("info");
                    info.render();
                })
            },
            //关注专家
            "likeProfessor": function () {
                require(['./components/admin/likeProfessor/likeProfessor.js?v='+staticVersion],function(likeProfessor){
                    activeMenuList("likeProfessor");
                    likeProfessor.render();
                })
            },
            //专家详情
            "professorDetails": function () {
                require(['./components/admin/likeProfessor/proDetails.js?v='+staticVersion],function(proDetails){
                    activeMenuList("likeProfessor");
                    proDetails.render();
                })
            },
            //关注会议
            "likeMeeting": function () {
                require(['./components/admin/likeMeeting/likeMeeting.js?v='+staticVersion],function(likeMeeting){
                    activeMenuList("likeMeeting");
                    likeMeeting.render();
                })
            },
            //创建会议
            "createMeeting": function () {
                require(['./components/admin/createMeeting/createMeeting.js?v='+staticVersion,'static/plugin/jquery.step.js'],function(createMeeting){
                    activeMenuList("createMeeting");
                    window.onbeforeunload = function(event) {
                        return "确定要离开吗?您输入的数据可能不会保存";
                    }
                    createMeeting.render();
                    leaveAsk(true);
                })
            },
            // 管理会议列表
            "meetingList":function () {
                require(['./components/admin/manageMeeting/meetingList.js?v='+staticVersion],function(meetingList){
                    activeMenuList("manageMeeting");
                    meetingList.render();
                })
            },
            //管理会议
            "manageMeeting": function () {
                require(['./components/admin/manageMeeting/manageMeeting.js?v='+staticVersion,
                        'static/js/js/chatease.js?v='+staticVersion,
                        'static/js/js/playease.js?v='+staticVersion,
                        'static/js/player.admin.js?v='+staticVersion
                ],function(manageMeeting){
                    activeMenuList("manageMeeting");
                    manageMeeting.render();
                })
            },
            //历史会议
            "historyMeeting": function () {
                require(['./components/admin/historyMeeting/historyMeeting.js?v='+staticVersion],function(historyMeeting){
                    activeMenuList("historyMeeting");
                    historyMeeting.render();
                })
            },
            //会议详情
            "meetingDetails": function () {
                require(['./components/admin/meetingDetails/meetingDetails.js?v='+staticVersion],function(meetingDetails){
                    meetingDetails.render();
                })
            },
            //账户安全
            "safety": function () {
                require(['./components/admin/safety/safety.js?v='+staticVersion],function(safety){
                    activeMenuList("safety");
                    safety.render();
                })
            },
            //账户安全(操作)
            "safetyChange": function () {
                require(['./components/admin/safety/safetyChange.js?v='+staticVersion,'static/plugin/jquery.step.js'],function(safetyChange){
                    activeMenuList("safety");
                    window.onbeforeunload = function(event) {
                        return "确定要离开吗?您输入的数据可能不会保存";
                    }
                    safetyChange.render();
                })
            },
            //欢迎页面
            "welcome": function () {
                require(['./components/admin/welcome/welcome.js?v='+staticVersion],function(welcome){
                    welcome.render();
                })
            },
            "*actions":function(){
                location.hash = "welcome";
            }
        }
    });

    var router = new Router();
    return router;

});

