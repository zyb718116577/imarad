define(["text!./menu1.html","$css!./menu1.css"],function(e){function t(){$(".view-window").html(e),n.init()}var n={init:function(){layui.use("layedit",function(){var e=layui.layedit,t=layui.jquery,n=e.build("LAY_demo1"),r={content:function(){alert(e.getContent(n))},text:function(){alert(e.getText(n))},selection:function(){alert(e.getSelection(n))}};t(".site-demo-layedit").on("click",function(){var e=t(this).data("type");r[e]?r[e].call(this):""}),e.build("LAY_demo2",{tool:["face","link","unlink","|","left","center","right"],height:100})}),$(".jump").on("click",function(){window.location.href="admin.html"})}};return{render:t}});