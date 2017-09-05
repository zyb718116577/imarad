/**
 * Created by zyb on 2017/3/21.
 */
require.config({
    paths:{
        'jquery':'./lib/jquery',
        'backbone':'./lib/backbone',
        'underscore':'./lib/underscore',
        'text':'./lib/text',
        '$css':'./lib/css',
        'utilIndex':'./static/js/utilIndex',
        'routerIndex':'static/router/routerIndex',
        'swiper':'./static/plugin/idangerous.swiper2.7.6.min',
        'swipe':'./static/plugin/idangerous.swiper.progress',
        'cookie': './lib/jquery.cookie',
        'layui':'./static/layui/layui',
    },
    shim: {
        'underscore': {
            exports: '_',
        },
        'jquery': {
            exports: '$',
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        },
        'utilIndex':{
            deps: ['jquery','swipe','swiper','layui'],
            exports: 'utilIndex'
        },
        'swiper':{
            deps: ['jquery'],
            exports: 'swiper'
        },
        'swipe':{
            deps: ['swiper'],
            exports: 'swipe'
        },
        'cookie': {
            deps: ['jquery'],
            exports: 'cookie'
        },
    }
});
//静态文件版本号
var staticVersion = "1.01";

require(['jquery','backbone','routerIndex','$css','text','swipe','swiper','utilIndex','cookie','layui'],function($, Backbone, routerIndex, $css, text, swipe, swiper, utilIndex, cookie, layui){
    //开启路由
    Backbone.history.start();

});


