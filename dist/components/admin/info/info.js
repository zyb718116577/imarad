define(["text!./info.html","$css!./info.css"],function(e){function t(){$(".view-window").html(e),layui.use("form",function(){var e=layui.form();e.render(),e.on("submit(formDemo)",function(e){return layer.msg(JSON.stringify(e.field)),!1})})}return{render:t}});