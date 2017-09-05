/**
 * Created by zyb on 2017/3/21.
 */
require.config({
    paths:{
        'jquery':'./lib/jquery',
        'layui':'static/layui/layui',
        'backbone':'./lib/backbone',
        'underscore':'./lib/underscore',
        'text':'./lib/text',
        '$css':'./lib/css',
        'util':'./static/js/util',
        'config':'./static/js/imarad.admin.config',
        'router':'static/router/router',
        'cookie':'./lib/jquery.cookie',
        'echarts':'./static/plugin/echarts.common.min'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'backbone': {
            deps: ['jquery'],
            exports: 'backbone'
        },
        'util':{
            deps: ['jquery','cookie'],
            exports: 'util'
        },
        'config':{
            deps: ['jquery','cookie','layui','util'],
            exports: 'config'
        },
        'cookie':{
            deps: ['jquery'],
            exports: 'cookie'
        },
        'admin':{
            deps: ['jquery','cookie'],
            exports: 'admin'
        }
    }
});
//静态文件版本号
var staticVersion = "1.01";

require(['jquery','layui','backbone','router','config','util','$css','text','cookie'],
    function($, layui, Backbone, router,config, util, $css, text,cookie){
    //开启路由
    Backbone.history.start();
});


