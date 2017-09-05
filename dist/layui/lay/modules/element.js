layui.define("jquery",function(e){"use strict";var t=layui.jquery,n=(layui.hint(),layui.device()),r="element",i="layui-this",s="layui-show",o=function(){this.config={}};o.prototype.set=function(e){var n=this;return t.extend(!0,n.config,e),n},o.prototype.on=function(e,t){return layui.onevent(r,e,t)},o.prototype.tabAdd=function(e,n){var r=".layui-tab-title",i=t(".layui-tab[lay-filter="+e+"]"),s=i.children(r),o=i.children(".layui-tab-content");return s.append('<li lay-id="'+(n.id||"")+'">'+(n.title||"unnaming")+"</li>"),o.append('<div class="layui-tab-item">'+(n.content||"")+"</div>"),d.hideTabMore(!0),d.tabAuto(),this},o.prototype.tabDelete=function(e,n){var r=".layui-tab-title",i=t(".layui-tab[lay-filter="+e+"]"),s=i.children(r),o=s.find('>li[lay-id="'+n+'"]');return d.tabDelete(null,o),this},o.prototype.tabChange=function(e,n){var r=".layui-tab-title",i=t(".layui-tab[lay-filter="+e+"]"),s=i.children(r),o=s.find('>li[lay-id="'+n+'"]');return d.tabClick(null,null,o),this},o.prototype.progress=function(e,n){var r="layui-progress",i=t("."+r+"[lay-filter="+e+"]"),s=i.find("."+r+"-bar"),o=s.find("."+r+"-text");return s.css("width",n),o.text(n),this};var u=".layui-nav",a="layui-nav-item",f="layui-nav-bar",l="layui-nav-tree",c="layui-nav-child",h="layui-nav-more",p="layui-anim layui-anim-upbit",d={tabClick:function(e,n,o){var u=o||t(this),n=n||u.parent().children("li").index(u),a=u.parents(".layui-tab").eq(0),f=a.children(".layui-tab-content").children(".layui-tab-item"),l=a.attr("lay-filter");u.addClass(i).siblings().removeClass(i),f.eq(n).addClass(s).siblings().removeClass(s),layui.event.call(this,r,"tab("+l+")",{elem:a,index:n})},tabDelete:function(e,n){var r=n||t(this).parent(),s=r.index(),o=r.parents(".layui-tab").eq(0),u=o.children(".layui-tab-content").children(".layui-tab-item");r.hasClass(i)&&(r.next()[0]?d.tabClick.call(r.next()[0],null,s+1):r.prev()[0]&&d.tabClick.call(r.prev()[0],null,s-1)),r.remove(),u.eq(s).remove(),setTimeout(function(){d.tabAuto()},50)},tabAuto:function(){var e="layui-tab-more",r="layui-tab-bar",i="layui-tab-close",s=this;t(".layui-tab").each(function(){var o=t(this),u=o.children(".layui-tab-title"),a=(o.children(".layui-tab-content").children(".layui-tab-item"),'lay-stope="tabmore"'),f=t('<span class="layui-unselect layui-tab-bar" '+a+"><i "+a+' class="layui-icon">&#xe61a;</i></span>');if(s===window&&8!=n.ie&&d.hideTabMore(!0),o.attr("lay-allowClose")&&u.find("li").each(function(){var e=t(this);if(!e.find("."+i)[0]){var n=t('<i class="layui-icon layui-unselect '+i+'">&#x1006;</i>');n.on("click",d.tabDelete),e.append(n)}}),u.prop("scrollWidth")>u.outerWidth()+1){if(u.find("."+r)[0])return;u.append(f),o.attr("overflow",""),f.on("click",function(t){u[this.title?"removeClass":"addClass"](e),this.title=this.title?"":"收缩"})}else u.find("."+r).remove(),o.removeAttr("overflow")})},hideTabMore:function(e){var n=t(".layui-tab-title");e!==!0&&"tabmore"===t(e.target).attr("lay-stope")||(n.removeClass("layui-tab-more"),n.find(".layui-tab-bar").attr("title",""))},clickThis:function(){var e=t(this),n=e.parents(u),s=n.attr("lay-filter");e.find("."+c)[0]||(n.find("."+i).removeClass(i),e.addClass(i),layui.event.call(this,r,"nav("+s+")",e))},clickChild:function(){var e=t(this),n=e.parents(u),s=n.attr("lay-filter");n.find("."+i).removeClass(i),e.addClass(i),layui.event.call(this,r,"nav("+s+")",e)},showChild:function(){var e=t(this),n=e.parents(u),r=e.parent(),i=e.siblings("."+c);n.hasClass(l)&&(i.removeClass(p),r["none"===i.css("display")?"addClass":"removeClass"](a+"ed"))},collapse:function(){var e=t(this),n=e.find(".layui-colla-icon"),i=e.siblings(".layui-colla-content"),o=e.parents(".layui-collapse").eq(0),u=o.attr("lay-filter"),a="none"===i.css("display");if("string"==typeof o.attr("lay-accordion")){var f=o.children(".layui-colla-item").children("."+s);f.siblings(".layui-colla-title").children(".layui-colla-icon").html("&#xe602;"),f.removeClass(s)}i[a?"addClass":"removeClass"](s),n.html(a?"&#xe61a;":"&#xe602;"),layui.event.call(this,r,"collapse("+u+")",{title:e,content:i,show:a})}};o.prototype.init=function(e){var r={tab:function(){d.tabAuto.call({})},nav:function(){var e,r,i,o=200,v=function(u,a){var f=t(this),d=f.find("."+c);a.hasClass(l)?u.css({top:f.position().top,height:f.children("a").height(),opacity:1}):(d.addClass(p),u.css({left:f.position().left+parseFloat(f.css("marginLeft")),top:f.position().top+f.height()-5}),e=setTimeout(function(){u.css({width:f.width(),opacity:1})},n.ie&&n.ie<10?0:o),clearTimeout(i),"block"===d.css("display")&&clearTimeout(r),r=setTimeout(function(){d.addClass(s),f.find("."+h).addClass(h+"d")},300))};t(u).each(function(){var n=t(this),u=t('<span class="'+f+'"></span>'),p=n.find("."+a);n.find("."+f)[0]||(n.append(u),p.on("mouseenter",function(){v.call(this,u,n)}).on("mouseleave",function(){n.hasClass(l)||(clearTimeout(r),r=setTimeout(function(){n.find("."+c).removeClass(s),n.find("."+h).removeClass(h+"d")},300))}),n.on("mouseleave",function(){clearTimeout(e),i=setTimeout(function(){n.hasClass(l)?u.css({height:0,top:u.position().top+u.height()/2,opacity:0}):u.css({width:0,left:u.position().left+u.width()/2,opacity:0})},o)})),p.each(function(){var e=t(this),n=e.find("."+c);if(n[0]&&!e.find("."+h)[0]){var r=e.children("a");r.append('<span class="'+h+'"></span>')}e.off("click",d.clickThis).on("click",d.clickThis),e.children("a").off("click",d.showChild).on("click",d.showChild),n.children("dd").off("click",d.clickChild).on("click",d.clickChild)})})},breadcrumb:function(){var e=".layui-breadcrumb";t(e).each(function(){var e=t(this),n=e.attr("lay-separator")||">",r=e.find("a");r.find(".layui-box")[0]||(r.each(function(e){e!==r.length-1&&t(this).append('<span class="layui-box">'+n+"</span>")}),e.css("visibility","visible"))})},progress:function(){var e="layui-progress";t("."+e).each(function(){var n=t(this),r=n.find(".layui-progress-bar"),i=r.attr("lay-percent");r.css("width",i),n.attr("lay-showPercent")&&setTimeout(function(){var t=Math.round(r.width()/n.width()*100);t>100&&(t=100),r.html('<span class="'+e+'-text">'+t+"%</span>")},350)})},collapse:function(){var e="layui-collapse";t("."+e).each(function(){var e=t(this).find(".layui-colla-item");e.each(function(){var e=t(this),n=e.find(".layui-colla-title"),r=e.find(".layui-colla-content"),i="none"===r.css("display");n.find(".layui-colla-icon").remove(),n.append('<i class="layui-icon layui-colla-icon">'+(i?"&#xe602;":"&#xe61a;")+"</i>"),n.off("click",d.collapse).on("click",d.collapse)})})}};return layui.each(r,function(e,t){t()})};var v=new o,m=t(document);v.init();var g=".layui-tab-title li";m.on("click",g,d.tabClick),m.on("click",d.hideTabMore),t(window).on("resize",d.tabAuto),e(r,function(e){return v.set(e)})});