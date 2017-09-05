//配置layui文件的入口地址
layui.config({
    dir: 'static/layui/'
});

//全局配置时间插件
layui.use(['laydate'], function () {
    var laydate = layui.laydate;

    var start = {
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istoday: false,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };

    var end = {
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istoday: false,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
});

// 全局配置所用的模块
function imaradLayui(type, callBack) {
    switch (type) {
        case 'form':
            layui.use('form', function () {
                var form = layui.form();
                callBack(form)
            })
            break;
        case 'element':
            layui.use('element', function () {
                var form = layui.element();
                callBack(form)
            })
            break;
        case 'layer':
            layui.use('layer', function () {
                var form = layui.layer;
                callBack(form)
            })
            break;
        case 'laytpl':
            layui.use('laytpl', function () {
                var form = layui.laytpl;
                callBack(form)
            })
            break;
        case 'laypage':
            layui.use('laypage', function () {
                var form = layui.laypage;
                callBack(form)
            })
            break;
        default:
            return null;
            break;
    }
}
// 获取用户类型展示对应的menu
function menuInit() {
    var data = {},
        param = {
            url: 'user/get/userInfo',
            showAjaxLoading: true,
            successFn: function (res) {
                if (util.checkCode(res)) {
                    cookie.setCookie('USER_TYPE',res.data.userType,'/');
                    var USER_TYPE = util.getUserType(),
                        type_name = util.getUserType(true);
                    imaradLayui('laytpl', function (laytpl) {
                        data = res.data;
                        data.user_type = USER_TYPE;
                        if (data.userPlace) {
                            data.userPlaceExtend = data.userPlace.split('_')[3];
                        }
                        if (!data.headPicPath) {
                            data.headPicPath = '../img/ardLive1.png',
                                data.SERVER_URL = '';
                        }
                        data.type_name = type_name;
                        var htmls = $('#menuBox').html();
                        laytpl(htmls).render(data, function (html) {
                            $("#admin-navbar-side")[0].innerHTML = html;
                            activeMenu();
                        });
                    })
                }
            }
        };
    util.ajax(param);
}

$(function () {
    // 注销登录
    $('#logout').click(function () {
        imaradLayui('layer',function(layer){
            // 注销的二次询问
            layer.confirm('确定注销吗？', {icon: 3, title:'提示'}, function(index){
                util.ajax({
                    url: 'logout',
                    successFn: function (res) {
                        cookie.delCookie('USER_TYPE', '/');
                        window.location.href = './index.html';
                    }
                })
                layer.close(index);
            })
        })
    })

    leaveAsk(true);

    // 左侧菜单初始化
    menuInit();
})

// 路由切换渲染左侧菜单
// 切换左侧栏tabBar选中样式menulit-active
function activeMenu(id) {
    var id = layui.router().dir[0];
    if (id.indexOf('?') > 0) {
        id = id.split('?')[0]
    }
    $("#" + id).addClass("menulit-active")
        .parents("li").siblings("li")
        .find("a").removeClass("menulit-active");
}

/**
 * 离开创建直播等编辑页面的二次询问
 * @param flag {true: 添加hashchange事件  false:去除这些事件（比如在创建完成之后点击完成按钮）}
 */
function leaveAsk (flag) {
    if (("onhashchange" in window) && ((typeof document.documentMode === "undefined") || document.documentMode == 8) && flag) {
        // 浏览器支持onhashchange事件
        window.onhashchange = function (event) {
            // 判断是否是从创建直播（会议）以及账户安全页面跳转到其他页面
            if (event.oldURL && (event.oldURL.indexOf('createMeeting') > 1 || event.oldURL.indexOf('safetyChange') > 1)) {
                if (!confirm('确定要离开吗?您输入的数据可能不会保存')) {
                    // 手动更改浏览器hash值
                    window.location.hash = '#' + event.oldURL.split('#')[1];
                } else {
                    // 跳转到其他页面后解绑window的unbeforeunload事件
                    window.onbeforeunload = null;
                }
            }
        };
    } else {
        // 保存
        window.onhashchange = null;
        window.onbeforeunload = null;
    }
}









