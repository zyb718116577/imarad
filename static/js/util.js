/*
 * 工具类函数以及基础配置
 * */
function Util() {

    var _this = this;

    // 常量
    _this.constants = {
        HTTP_BASE_URL: "imarad/",
        LAYUI_BASE_URL: "",
        IMARAD_ZERO: 0,
        IMARAD_ONE: 1,
        IMARAD_TWO: 2,
        IMARAD_THREE: 3,
        IMARAD_LOSE_ONE: -1,
        IMARAD_IMAGE_PATTEN: /jpg$|jpeg$|gif$|png$/i, //图片的正则
        IMARAD_PHONE_PATTEN: /^1(3|4|5|7|8)\d{9}$/,   //手机号正则
        USER_TYPE_AUDIENCE: 1,
        USER_TYPE_EXPERT: 2,
        USER_TYPE_MEETING: 3,
        LOGIN_URL: './components/otherWeb/login/login.html',
        MY_SERVER_URL: '/imarad/image/',
        MY_FILE_URL: '/imarad/file/',
        WEB_MEETTING_URL: 'components/otherWeb/conferenceLive/conferenceLive.html?id=',
        WEB_EXPERT_URL: 'components/otherWeb/ardLive/ardLive.html?id='
    };

    // 直播会议的权限控制
    _this.authorityType = {
        AUTHORITY_TYPE_FREE: 1,
        AUTHORITY_TYPE_PASSWORD: 2,
        AUTHORITY_TYPE_F_CODE: 3,
        AUTHORITY_TYPE_WHITE_LIST: 4
    }

    // 用户类型数组(后期如果要添加用户类型直接在这加就可以)
    _this.userArray = [
        {
            user_number: '1',
            type_name: '观众'
        },
        {
            user_number: '2',
            type_name: '直播'
        },
        {
            user_number: '3',
            type_name: '会议'
        }
    ]

    // 返回专家职称
    _this.userTitle = function (title) {
        var titleList = ['主治医师', '主任医师', '副主任医师', '住院医师'];
        if (!titleList[title - 1]) {
            return '暂无职称';
        }
        return titleList[title - 1];
    }
    // 从本地cookie获取用户类型(不传flag返回用户类型码，传了则返回用户类型名称)
    _this.getUserType = function (flag) {
        var USER_TYPE = cookie.getCookie('USER_TYPE');
        if (!USER_TYPE) {
            imaradLayui('layer', function () {
                layer.msg('请先登录!', {icon: 2});
                setTimeout(function () {
                    window.location.href = _this.constants.LOGIN_URL;
                }, 2000)
                return null;
            })
        } else {
            for (var n in _this.userArray) {
                if (USER_TYPE == _this.userArray[n].user_number) {
                    if (flag) {
                        return _this.userArray[n].type_name
                    } else {
                        return _this.userArray[n].user_number
                    }
                }
            }
        }
    }

    /*
     *param对象解析
     * method:请求方法（post/get） url:请求地址 async:时候异步 withCredentials:请求数据时候是否带上cookie凭证
     * showAjaxLoading: 是否显示等待动画 contentType: 请求头部 successFn:请求成功处理函数
     * errorFn: 请求失败处理函数 button: 是否置灰提交按钮
     */
    _this.ajax = function (param) {
        if (!param) {
            return "请传入正确的参数!";
        }
        var _that = jQuery;
        _this.loading(function (layer) {
            var loading;
            _that.ajax({
                type: param.method || "POST",
                url: _this.constants.HTTP_BASE_URL + param.url,
                data: param.postData || null,
                dataType: "json",
                cache: false,
                async: param.async || true,
                timeout: 30000,
                beforeSend: function () {
                    if (param.beforeLoading) {
                        var html = _this.localLoading(true);
                        _that(param.beforeLoadingContainer).html(html);
                    }
                    if (param.button) {
                        param.button.attr("disabled", true)
                    }
                    if (param.showAjaxLoading) {
                        loading = layer.load(2, {shade: [0.2, '#000']})
                    }
                },
                contentType: param.contentType || "application/x-www-form-urlencoded;charset=utf-8",
                success: function (data) {
                    if (data.data) {
                        data.data.SERVER_URL = _this.constants.MY_SERVER_URL;
                    }

                    if (data) {
                        param.successFn(data)
                    }
                    if (param.button) {
                        _that(param.button).attr("disabled", false)
                    }
                    if (param.showAjaxLoading) {
                        layer.close(loading)
                    }
                    if (data.code == 10000) {
                        layer.msg(data.msg, {icon: 2})
                        setTimeout(function () {
                            window.location.href = _this.constants.LOGIN_URL
                        }, 2000)
                    }
                },
                error: function (error) {
                    var res = $.parseJSON(error.responseText);
                    if (error.statusText == 'timeout') {
                        layer.msg('服务器连接超时!', {icon: 2})
                    } else {
                        layer.msg(res.msg, {icon: 2})
                    }
                    if (param.errorFn) {
                        param.errorFn(error)
                    }
                    if (param.button) {
                        _that(param.button).attr("disabled", false)
                    }
                    if (param.showAjaxLoading) {
                        layer.close(loading)
                    }

                    if (param.beforeLoading) {
                        if (res != null) {
                            var html = _this.localLoading(false, res.msg);
                        } else {
                            var html = _this.localLoading(false);
                        }
                        _that(param.beforeLoadingContainer).html(html);
                    }
                    if (res.code == 10000) {
                        setTimeout(function () {
                            window.location.href = _this.constants.LOGIN_URL
                        }, 2000)
                    }
                }
            });
        })

    }

    _this.downloadFile = function (name) {
        var param = {
            method: 'GET',
            url: 'ability/get/file',
            postData: {
                fileName: name
            },
            success: function (res) {
                console.log(res)
            }
        }
        _this.ajax(param)
    }

    // 全局loading动画
    _this.loading = function (fn) {
        layui.use('layer', function () {
            var layer = layui.layer;
            fn(layer);
        })
    }

    // 无数据
    _this.noData = function () {
        return '<div style="text-align: center;height: 400px"><img style="height: 100%" src="./img/nodata.png"></div>';
    }

    // 局部loading动画
    _this.localLoading = function (flag, message) {
        var msg = message || '数据加载失败!';
        if (flag == true) {
            var html = '<div class="no-data"><img src="./img/load.gif"><p style="font-size: 15px;color:#000;">数据拼命加载中...</p></div>';
        } else if (flag == 'noRepeat') {
            var html = '<div class="no-data"><p>' + msg + '</p></div>';
        } else {
            var html = '<div class="no-data"><p>' + msg + '<span onclick="javascript:location.reload()" style="color: #00a0e9;cursor: pointer">点击重试</span></p></div>';
        }
        return html;
    }

    // 禁止页面后退
    _this.forbidBack = function () {
        if (history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        }
    }


    // 时间戳转换为年龄
    _this.birthToAge = function (strBirthday) {
        var strBirthday1 = _this.stampToTime(strBirthday, "yyyy-MM-dd");
        var returnAge = 0;
        var strBirthdayArr = strBirthday1.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];

        var d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();

        if (nowYear != birthYear) {
            var ageDiff = nowYear * 1 - birthYear * 1; //年之差
            if (ageDiff > 0) {
                if (nowMonth == birthMonth) {
                    var dayDiff = nowDay - birthDay;//日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                } else {
                    var monthDiff = nowMonth - birthMonth;//月之差
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                }
            } else {
                returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天}
            }
        }
        return returnAge;//返回周岁年龄
    }

    //图片回显(obj:绑定该事件的节点  preview回显的元素id  bgFlag:是否背景图)
    _this.imgChange = function (obj, preview, bgFlag) {
        var pic = document.getElementById(preview),
            file = $(obj)[0];
        var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();
        if (ext != 'png' && ext != 'jpg' && ext != 'jpeg' && ext != 'bmp' && ext != 'raw' && ext != 'psd') {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.msg('请选择图片文件', {
                    icon: 2,
                    time: 2000
                });
            })
            return;
        }
        var isIE = navigator.userAgent.match(/MSIE/) != null,
            isIE6 = navigator.userAgent.match(/MSIE 6.0/) != null;
        if (isIE) {
            file.select();
            var reallocalpath = document.selection.createRange().text;
            if (isIE6) {
                pic.src = reallocalpath;
            } else {
                pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
                if (!bgFlag) {
                    pic.style.display = "inline";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                }
            }
        } else {
            var file = file.files[0];
            var size = (file.size / 1024 / 1024).toFixed(2);
            if (size > 20) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('请上传小于20M的图片文件！', {
                        icon: 2,
                        time: 2000
                    });
                })
                return;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                var pic = document.getElementById(preview);
                if (!bgFlag) {
                    $(pic).show();
                    pic.src = this.result;
                } else {
                    $(pic).css({
                        "background-image": "url(" + this.result + ")"
                    });
                }
            }
        }
    }

    // 隐藏、显示元素（flag:true显示  false:隐藏）
    _this.hideOrShowElement = function (flag) {
        for (var n in arguments) {
            flag ? $(arguments[n]).show() : $(arguments[n]).hide();
        }
    }

    // 表单校验规则
    _this.verify = function () {
        layui.use('form', function () {
            var form = layui.form();
            form.verify({
                // 用户名
                username: function (value, item) {
                    if (new RegExp("((?=[\x21-\x7e]+)[^A-Za-z0-9])").test(value)) {
                        return '用户名不能有特殊字符!';
                    }
                    if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                        return '用户名首尾不能出现下划线\'_\'!';
                    }
                    if (/^\d+\d+\d$/.test(value)) {
                        return '用户名不能全为数字!';
                    }
                    if (!/^[\S]{1,20}$/.test(value)) {
                        return '用户名长度为1到20位,且不能出现空格!'
                    }
                },
                chinaname: function (value) {
                    if (!new RegExp("^[a-zA-Z_\u4e00-\u9fa5\\s·]+$").test(value)) {
                        return '姓名不能有特殊字符!';
                    }
                    if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                        return '姓名首尾不能出现下划线\'_\'!';
                    }
                    if (/^\d+\d+\d$/.test(value)) {
                        return '姓名不能全为数字!';
                    }
                    if (!/^[\S]{1,10}$/.test(value)) {
                        return '姓名长度为1到10位,且不能出现空格!'
                    }
                },
                // 主题
                theme: function (value) {
                    if (/^\d+\d+\d$/.test(value)) {
                        return '主题名不能全为数字!';
                    }
                    if (!/^[\S]{6,30}$/.test(value)) {
                        return '主题名长度为6到30位,且不能出现空格!'
                    }
                },
                // 6~100字符
                commonlength: [/^[\S]{6,100}$/, '必须6到100位，且不能出现空格!'],
                // 手机号
                myPhone: [_this.constants.IMARAD_PHONE_PATTEN, '请输入正确的手机号码!'],
                // 密码
                pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格!'],
                // 验证码
                code: [/^\d{6}$/, '验证码为6位数字!'],
                // 所选时间不能在当前时间之前
                shouldLate: function (value) {
                    var stamp = _this.timeToStamp(value),
                        now = new Date().getTime();
                    if (stamp < now) {
                        return '所选时间不能早于当前时间，请重新选择。'
                    }
                },
                // shouldEarly
                shouldEarly: function (value) {
                    var stamp = _this.timeToStamp(value),
                        now = new Date().getTime();
                    if (stamp > now) {
                        return '所选时间不能晚于当前时间，请重新选择。'
                    }
                },
                // 结束时间不能早于开始时间(这个规则加在结束时间上 且开始时间的class为shouldEarly，且他们为同级元素)
                unableEarlyBegin: function (value, item) {
                    var begin = _this.timeToStamp($(arguments[1]).siblings('.shouldEarly').val()),
                        end = _this.timeToStamp(value);
                    if (end <= begin) {
                        return '结束时间必须晚于开始时间!'
                    }
                },
                // 直播密码
                livePassword: [/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6}$/, '直播密码为数字字母组合，长度6位!']
            });
        })
    }

    // 获取地址栏参数
    _this.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        if (document.URL.indexOf("?") == -1) {
            return null;
        }
        var str = window.location.hash.split("?")[1].match(reg);
        if (str != null)return str[2];
        return null;
    }


    // 上传图片
    _this.upload = function (param, callBack) {
        // 初始化Web Uploader
        var uploader = WebUploader.create({
            auto: false,

            swf: 'static/dist/Uploader.swf',

            server: 'imarad/ability/upload/file',

            pick: param.filePicker,
            // 是否可重复上传某一张图片
            duplicate: true,

            compress: false,

            thumb: {
                width: 1000,
                height: 500,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 70,

                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,

                // 是否允许裁剪。
                crop: false,

                // 否则强制转换成指定的类型。
                type: 'image/jpeg'
            }
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {

            var size = (file.size / 1024).toFixed(2),
                ext = file.ext.toLocaleLowerCase();

            if (!util.constants.IMARAD_IMAGE_PATTEN.test(ext)) {
                layer.msg('请上传图片文件', {icon: 2});
                uploader.removeFile(file, true);
                return;
            }
            if (size && size > param.size) {
                layer.msg('图片不得大于' + param.showSize + param.sizeName, {icon: 2});
                uploader.removeFile(file, true);
                return;
            }

            // 上传
            uploader.upload();

            // 创建缩略图
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $(param.backshowImg).parent().html('<span>不能预览</span>');
                    return;
                }
                $(param.backshowImg).parent().show();
                $(param.backshowImg).show().attr('src', src);
            });
        });
        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, res) {
            if (_this.checkCode(res) && res.data) {
                callBack(res);
                /*imaradLayui('layer', function (layer) {
                 layer.tips('上传成功!', param.filePicker);
                 })*/
                layer.msg('上传成功！', {icon: 1})
            }
        });
        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function () {
            layer.msg('上传文件出错！请重试', {icon: 2})
        });

    }

    /**
     * 上传文件（excel）
     * @param param 配置
     * @param callBack 上传成功后的回调函数
     * @param delFn 上传出错后删除之前上传成功的旧数据
     */
    _this.uploadFile = function (param, callBack, delFn) {
        // 初始化Web Uploader
        var uploader = WebUploader.create({
            auto: false,

            swf: 'static/dist/Uploader.swf',

            server: _this.constants.HTTP_BASE_URL + param.server,

            pick: param.filePicker,
            // 是否可重复上传某一张图片
            duplicate: true,

            compress: false
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            // 拿到是否有上传成功的标志
            var repeat = $(param.filePicker).attr('repeat');
            if (repeat == 'repeat') {
                imaradLayui('layer', function (layer) {

                    layer.confirm('系统检测到你已经有过导入操作，此操作会覆盖您之前的导入文件!是否继续？', {icon: 3, title: '覆盖警告'}, function (index) {
                        // 待回显区域loading等待
                        $(param.element).html(_this.localLoading(true));
                        var ext = file.ext.toLocaleLowerCase();
                        if (!/xl(s[xmb]|t[xm]|am|s)$/.test(ext)) {
                            layer.close(index);
                            layer.msg('请上传excel文件', {icon: 2})
                            $(param.element).html(_this.localLoading('noRepeat', '请上传excel文件'));
                            uploader.removeFile(file, true);
                            return;
                        }
                        // 执行上传
                        uploader.upload();
                        layer.close(index);
                    });
                })
            } else {
                // 待回显区域loading等待
                $(param.element).html(_this.localLoading(true));
                var ext = file.ext.toLocaleLowerCase();
                if (!/xl(s[xmb]|t[xm]|am|s)$/.test(ext)) {
                    $(param.element).html(_this.localLoading('noRepeat', '请上传excel文件'));
                    uploader.removeFile(file, true);
                    return;
                }
                // 执行上传
                uploader.upload();
            }
        });
        // 文件上传成功
        uploader.on('uploadSuccess', function (file, res) {
            if (_this.checkCode(res) && res.data) {
                callBack(res);
                // 上传成功则给一个标志位
                $(param.filePicker).attr('repeat', 'repeat');
            }
        });
        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (err, res) {

        });

        // 文件上传到服务器后拿到数据。
        uploader.on('uploadAccept', function (err, res) {
            if (res.code != 0) {
                delFn();
                layer.msg(res.msg, {icon: 2});
                $(param.element).html(_this.localLoading('noRepeat', res.msg));
            }
        });

    }

    // 根据后台返回数据的code做相应处理
    _this.checkCode = function (responseData, alertFlag) {
        var success = true;
        if (responseData && responseData.code == _this.constants.IMARAD_ZERO && alertFlag) {
            layer.msg(responseData.msg, {icon: 1});
        }
        if (responseData && responseData.code != _this.constants.IMARAD_ZERO) {
            success = false;
            layer.msg(responseData.msg, {icon: 2});
        }
        return success;
    }

    // 删除日程
    _this.deleteEvent = function (element, msg) {
        imaradLayui('layer', function (layer) {
            var scheduleLength = $('.schedule').size();
            if (scheduleLength == 1) {
                layer.msg('至少保留一条日程!', {icon: 2});
                return;
            }
            layer.confirm(msg, {icon: 3, title: '提示'}, function (index) {
                $(element).parents('.layui-form').remove();
                layer.close(index);
            });
        })
    }

    // 判断对象是否为空对象
    _this.isEmptyObject = function (obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    //时间戳转换成时间 format:"yyyy-MM-dd hh:mm:ss"
    _this.stampToTime = function (ns, format) {
        return new Date(parseInt(ns)).Format(format);
    }

    //时间转为时间戳
    _this.timeToStamp = function (string) {
        var date = string;
        if (date.indexOf('.') > 0) {
            date = date.split('.')[0]
        }
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        var newDate = date.getTime();
        return newDate;
    }

    // 时间格式化（yyyy-mm-dd hh:mm:ss --> yyyy-mm-dd）
    _this.timeFomat = function (time) {
        var stamp = _this.timeToStamp(time),
            newTime = _this.stampToTime(stamp, 'yyyy-MM-dd');
        return newTime;
    }

    // 时间格式化（yyyy-mm-dd hh:mm:ss --> yyyy-mm-dd hh:mm）
    _this.timeFomatMinute = function (time) {
        var stamp = _this.timeToStamp(time),
            newTime = _this.stampToTime(stamp, 'yyyy-MM-dd hh:mm');
        return newTime;
    }
    // 计算时间过去了多久
    _this.pastHowLong = function (time) {
        var dateTimeStamp = _this.timeToStamp(time),
            minute = 1000 * 60,
            hour = minute * 60,
            day = hour * 24,
            month = day * 30,
            year = month * 12,
            now = new Date().getTime(),
            diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            return;
        }
        var monthC = diffValue / month,
            yearC = diffValue / year,
            weekC = diffValue / (7 * day),
            dayC = diffValue / day,
            hourC = diffValue / hour,
            minC = diffValue / minute,
            result;
        if (yearC >= 1) {
            result = "" + parseInt(yearC) + "年前";
        }
        else if (monthC >= 1) {
            result = "" + parseInt(monthC) + "月前";
        }
        else if (weekC >= 1) {
            result = "" + parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = "" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "" + parseInt(hourC) + "小时前";
        }
        else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        }
        else {
            result = "刚刚";
        }
        return result;
    }

    // 格式化地址
    _this.placeFormat = function (place) {
        if (place && place.indexOf('_') > 0) {
            if (place.split('_')[3]){
                return place.split('_')[3];
            } else {
                return '未知';
            }
        }
        return place;
    }

}
// 创建工具函数实例
var util = new Util();


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}






