/**
 * Created by abj on 2017/5/24. node r.js -o build.js
 */
({
    appDir: './',
    baseUrl: './',
    dir: './build',
    modules: [
        {
            name: 'app',
            include: ['app']
        },
        {
            name: 'appIndex',
            include: ['./appIndex']
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: false,
    paths: {
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
        'admin':'./static/js/admin.js?v=1.0',
        'routerIndex':'static/router/routerIndex',
        'utilIndex':'./static/js/utilIndex',
        'routerIndex':'static/router/routerIndex',
        'swiper':'./static/plugin/idangerous.swiper2.7.6.min',
        'swipe':'./static/plugin/idangerous.swiper.progress'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'utilIndex':{
            deps: ['jquery','swipe','swiper'],
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
        }
    }


})