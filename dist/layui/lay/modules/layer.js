!function(e,t){"use strict";var n,r,i=e.layui&&layui.define,s={getPath:function(){var e=document.scripts,t=e[e.length-1],n=t.src;if(!t.getAttribute("merge"))return n.substring(0,n.lastIndexOf("/")+1)}(),config:{},end:{},minIndex:0,minLeft:[],btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],type:["dialog","page","iframe","loading","tips"]},o={v:"3.0.3",ie:function(){var t=navigator.userAgent.toLowerCase();return!!(e.ActiveXObject||"ActiveXObject"in e)&&((t.match(/msie\s(\d+)/)||[])[1]||"11")}(),index:e.layer&&e.layer.v?1e5:0,path:s.getPath,config:function(e,t){return e=e||{},o.cache=s.config=n.extend({},s.config,e),o.path=s.config.path||o.path,"string"==typeof e.extend&&(e.extend=[e.extend]),s.config.path&&o.ready(),e.extend?(i?layui.addcss("modules/layer/"+e.extend):o.link("skin/"+e.extend),this):this},link:function(t,r,i){if(o.path){var s=n("head")[0],u=document.createElement("link");"string"==typeof r&&(i=r);var a=(i||t).replace(/\.|\//g,""),f="layuicss-"+a,l=0;u.rel="stylesheet",u.href=o.path+t,u.id=f,n("#"+f)[0]||s.appendChild(u),"function"==typeof r&&!function c(){return++l>80?e.console&&console.error("layer.css: Invalid"):void (1989===parseInt(n("#"+f).css("width"))?r():setTimeout(c,100))}()}},ready:function(e){var t="skinlayercss",n="303";return i?layui.addcss("modules/layer/default/layer.css?v="+o.v+n,e,t):o.link("skin/default/layer.css?v="+o.v+n,e,t),this},alert:function(e,t,r){var i="function"==typeof t;return i&&(r=t),o.open(n.extend({content:e,yes:r},i?{}:t))},confirm:function(e,t,r,i){var u="function"==typeof t;return u&&(i=r,r=t),o.open(n.extend({content:e,btn:s.btn,yes:r,btn2:i},u?{}:t))},msg:function(e,r,i){var u="function"==typeof r,f=s.config.skin,l=(f?f+" "+f+"-msg":"")||"layui-layer-msg",c=a.anim.length-1;return u&&(i=r),o.open(n.extend({content:e,time:3e3,shade:!1,skin:l,title:!1,closeBtn:!1,btn:!1,resize:!1,end:i},u&&!s.config.skin?{skin:l+" layui-layer-hui",anim:c}:function(){return r=r||{},(r.icon===-1||r.icon===t&&!s.config.skin)&&(r.skin=l+" "+(r.skin||"layui-layer-hui")),r}()))},load:function(e,t){return o.open(n.extend({type:3,icon:e||0,resize:!1,shade:.01},t))},tips:function(e,t,r){return o.open(n.extend({type:4,content:[e,t],closeBtn:!1,time:3e3,shade:!1,resize:!1,fixed:!1,maxWidth:210},r))}},u=function(e){var t=this;t.index=++o.index,t.config=n.extend({},t.config,s.config,e),document.body?t.creat():setTimeout(function(){t.creat()},30)};u.pt=u.prototype;var a=["layui-layer",".layui-layer-title",".layui-layer-main",".layui-layer-dialog","layui-layer-iframe","layui-layer-content","layui-layer-btn","layui-layer-close"];a.anim=["layer-anim","layer-anim-01","layer-anim-02","layer-anim-03","layer-anim-04","layer-anim-05","layer-anim-06"],u.pt.config={type:0,shade:.3,fixed:!0,move:a[1],title:"&#x4FE1;&#x606F;",offset:"auto",area:"auto",closeBtn:1,time:0,zIndex:19891014,maxWidth:360,anim:0,isOutAnim:!0,icon:-1,moveType:1,resize:!0,scrollbar:!0,tips:2},u.pt.vessel=function(e,t){var r=this,i=r.index,o=r.config,u=o.zIndex+i,f="object"==typeof o.title,l=o.maxmin&&(1===o.type||2===o.type),c=o.title?'<div class="layui-layer-title" style="'+(f?o.title[1]:"")+'">'+(f?o.title[0]:o.title)+"</div>":"";return o.zIndex=u,t([o.shade?'<div class="layui-layer-shade" id="layui-layer-shade'+i+'" times="'+i+'" style="'+("z-index:"+(u-1)+"; background-color:"+(o.shade[1]||"#000")+"; opacity:"+(o.shade[0]||o.shade)+"; filter:alpha(opacity="+(100*o.shade[0]||100*o.shade)+");")+'"></div>':"",'<div class="'+a[0]+(" layui-layer-"+s.type[o.type])+(0!=o.type&&2!=o.type||o.shade?"":" layui-layer-border")+" "+(o.skin||"")+'" id="'+a[0]+i+'" type="'+s.type[o.type]+'" times="'+i+'" showtime="'+o.time+'" conType="'+(e?"object":"string")+'" style="z-index: '+u+"; width:"+o.area[0]+";height:"+o.area[1]+(o.fixed?"":";position:absolute;")+'">'+(e&&2!=o.type?"":c)+'<div id="'+(o.id||"")+'" class="layui-layer-content'+(0==o.type&&o.icon!==-1?" layui-layer-padding":"")+(3==o.type?" layui-layer-loading"+o.icon:"")+'">'+(0==o.type&&o.icon!==-1?'<i class="layui-layer-ico layui-layer-ico'+o.icon+'"></i>':"")+(1==o.type&&e?"":o.content||"")+'</div><span class="layui-layer-setwin">'+function(){var e=l?'<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>':"";return o.closeBtn&&(e+='<a class="layui-layer-ico '+a[7]+" "+a[7]+(o.title?o.closeBtn:4==o.type?"1":"2")+'" href="javascript:;"></a>'),e}()+"</span>"+(o.btn?function(){var e="";"string"==typeof o.btn&&(o.btn=[o.btn]);for(var t=0,n=o.btn.length;t<n;t++)e+='<a class="'+a[6]+t+'">'+o.btn[t]+"</a>";return'<div class="'+a[6]+" layui-layer-btn-"+(o.btnAlign||"")+'">'+e+"</div>"}():"")+(o.resize?'<span class="layui-layer-resize"></span>':"")+"</div>"],c,n('<div class="layui-layer-move"></div>')),r},u.pt.creat=function(){var e=this,t=e.config,i=e.index,u=t.content,f="object"==typeof u,l=n("body");if(!t.id||!n("#"+t.id)[0]){switch("string"==typeof t.area&&(t.area="auto"===t.area?["",""]:[t.area,""]),t.shift&&(t.anim=t.shift),6==o.ie&&(t.fixed=!1),t.type){case 0:t.btn="btn"in t?t.btn:s.btn[0],o.closeAll("dialog");break;case 2:var u=t.content=f?t.content:[t.content||"http://layer.layui.com","auto"];t.content='<iframe scrolling="'+(t.content[1]||"auto")+'" allowtransparency="true" id="'+a[4]+i+'" name="'+a[4]+i+'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="'+t.content[0]+'"></iframe>';break;case 3:delete t.title,delete t.closeBtn,t.icon===-1&&0===t.icon,o.closeAll("loading");break;case 4:f||(t.content=[t.content,"body"]),t.follow=t.content[1],t.content=t.content[0]+'<i class="layui-layer-TipsG"></i>',delete t.title,t.tips="object"==typeof t.tips?t.tips:[t.tips,!0],t.tipsMore||o.closeAll("tips")}e.vessel(f,function(r,o,h){l.append(r[0]),f?function(){2==t.type||4==t.type?function(){n("body").append(r[1])}():function(){u.parents("."+a[0])[0]||(u.data("display",u.css("display")).show().addClass("layui-layer-wrap").wrap(r[1]),n("#"+a[0]+i).find("."+a[5]).before(o))}()}():l.append(r[1]),n(".layui-layer-move")[0]||l.append(s.moveElem=h),e.layero=n("#"+a[0]+i),t.scrollbar||a.html.css("overflow","hidden").attr("layer-full",i)}).auto(i),2==t.type&&6==o.ie&&e.layero.find("iframe").attr("src",u[0]),4==t.type?e.tips():e.offset(),t.fixed&&r.on("resize",function(){e.offset(),(/^\d+%$/.test(t.area[0])||/^\d+%$/.test(t.area[1]))&&e.auto(i),4==t.type&&e.tips()}),t.time<=0||setTimeout(function(){o.close(e.index)},t.time),e.move().callback(),a.anim[t.anim]&&e.layero.addClass(a.anim[t.anim]),t.isOutAnim&&e.layero.data("isOutAnim",!0)}},u.pt.auto=function(e){function t(e){e=u.find(e),e.height(f[1]-l-c-2*(0|parseFloat(e.css("padding-top"))))}var i=this,s=i.config,u=n("#"+a[0]+e);""===s.area[0]&&s.maxWidth>0&&(o.ie&&o.ie<8&&s.btn&&u.width(u.innerWidth()),u.outerWidth()>s.maxWidth&&u.width(s.maxWidth));var f=[u.innerWidth(),u.innerHeight()],l=u.find(a[1]).outerHeight()||0,c=u.find("."+a[6]).outerHeight()||0;switch(s.type){case 2:t("iframe");break;default:""===s.area[1]?s.fixed&&f[1]>=r.height()&&(f[1]=r.height(),t("."+a[5])):t("."+a[5])}return i},u.pt.offset=function(){var e=this,t=e.config,n=e.layero,i=[n.outerWidth(),n.outerHeight()],s="object"==typeof t.offset;e.offsetTop=(r.height()-i[1])/2,e.offsetLeft=(r.width()-i[0])/2,s?(e.offsetTop=t.offset[0],e.offsetLeft=t.offset[1]||e.offsetLeft):"auto"!==t.offset&&("t"===t.offset?e.offsetTop=0:"r"===t.offset?e.offsetLeft=r.width()-i[0]:"b"===t.offset?e.offsetTop=r.height()-i[1]:"l"===t.offset?e.offsetLeft=0:"lt"===t.offset?(e.offsetTop=0,e.offsetLeft=0):"lb"===t.offset?(e.offsetTop=r.height()-i[1],e.offsetLeft=0):"rt"===t.offset?(e.offsetTop=0,e.offsetLeft=r.width()-i[0]):"rb"===t.offset?(e.offsetTop=r.height()-i[1],e.offsetLeft=r.width()-i[0]):e.offsetTop=t.offset),t.fixed||(e.offsetTop=/%$/.test(e.offsetTop)?r.height()*parseFloat(e.offsetTop)/100:parseFloat(e.offsetTop),e.offsetLeft=/%$/.test(e.offsetLeft)?r.width()*parseFloat(e.offsetLeft)/100:parseFloat(e.offsetLeft),e.offsetTop+=r.scrollTop(),e.offsetLeft+=r.scrollLeft()),n.attr("minLeft")&&(e.offsetTop=r.height()-(n.find(a[1]).outerHeight()||0),e.offsetLeft=n.css("left")),n.css({top:e.offsetTop,left:e.offsetLeft})},u.pt.tips=function(){var e=this,t=e.config,i=e.layero,s=[i.outerWidth(),i.outerHeight()],o=n(t.follow);o[0]||(o=n("body"));var u={width:o.outerWidth(),height:o.outerHeight(),top:o.offset().top,left:o.offset().left},f=i.find(".layui-layer-TipsG"),l=t.tips[0];t.tips[1]||f.remove(),u.autoLeft=function(){u.left+s[0]-r.width()>0?(u.tipLeft=u.left+u.width-s[0],f.css({right:12,left:"auto"})):u.tipLeft=u.left},u.where=[function(){u.autoLeft(),u.tipTop=u.top-s[1]-10,f.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color",t.tips[1])},function(){u.tipLeft=u.left+u.width+10,u.tipTop=u.top,f.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color",t.tips[1])},function(){u.autoLeft(),u.tipTop=u.top+u.height+10,f.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color",t.tips[1])},function(){u.tipLeft=u.left-s[0]-10,u.tipTop=u.top,f.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color",t.tips[1])}],u.where[l-1](),1===l?u.top-(r.scrollTop()+s[1]+16)<0&&u.where[2]():2===l?r.width()-(u.left+u.width+s[0]+16)>0||u.where[3]():3===l?u.top-r.scrollTop()+u.height+s[1]+16-r.height()>0&&u.where[0]():4===l&&s[0]+16-u.left>0&&u.where[1](),i.find("."+a[5]).css({"background-color":t.tips[1],"padding-right":t.closeBtn?"30px":""}),i.css({left:u.tipLeft-(t.fixed?r.scrollLeft():0),top:u.tipTop-(t.fixed?r.scrollTop():0)})},u.pt.move=function(){var e=this,t=e.config,i=n(document),u=e.layero,a=u.find(t.move),f=u.find(".layui-layer-resize"),l={};return t.move&&a.css("cursor","move"),a.on("mousedown",function(e){e.preventDefault(),t.move&&(l.moveStart=!0,l.offset=[e.clientX-parseFloat(u.css("left")),e.clientY-parseFloat(u.css("top"))],s.moveElem.css("cursor","move").show())}),f.on("mousedown",function(e){e.preventDefault(),l.resizeStart=!0,l.offset=[e.clientX,e.clientY],l.area=[u.outerWidth(),u.outerHeight()],s.moveElem.css("cursor","se-resize").show()}),i.on("mousemove",function(n){if(l.moveStart){var i=n.clientX-l.offset[0],s=n.clientY-l.offset[1],a="fixed"===u.css("position");if(n.preventDefault(),l.stX=a?0:r.scrollLeft(),l.stY=a?0:r.scrollTop(),!t.moveOut){var f=r.width()-u.outerWidth()+l.stX,h=r.height()-u.outerHeight()+l.stY;i<l.stX&&(i=l.stX),i>f&&(i=f),s<l.stY&&(s=l.stY),s>h&&(s=h)}u.css({left:i,top:s})}if(t.resize&&l.resizeStart){var i=n.clientX-l.offset[0],s=n.clientY-l.offset[1];n.preventDefault(),o.style(e.index,{width:l.area[0]+i,height:l.area[1]+s}),l.isResize=!0,t.resizing&&t.resizing(u)}}).on("mouseup",function(e){l.moveStart&&(delete l.moveStart,s.moveElem.hide(),t.moveEnd&&t.moveEnd(u)),l.resizeStart&&(delete l.resizeStart,s.moveElem.hide())}),e},u.pt.callback=function(){function e(){var e=i.cancel&&i.cancel(t.index,r);e===!1||o.close(t.index)}var t=this,r=t.layero,i=t.config;t.openLayer(),i.success&&(2==i.type?r.find("iframe").on("load",function(){i.success(r,t.index)}):i.success(r,t.index)),6==o.ie&&t.IE6(r),r.find("."+a[6]).children("a").on("click",function(){var e=n(this).index();if(0===e)i.yes?i.yes(t.index,r):i.btn1?i.btn1(t.index,r):o.close(t.index);else{var s=i["btn"+(e+1)]&&i["btn"+(e+1)](t.index,r);s===!1||o.close(t.index)}}),r.find("."+a[7]).on("click",e),i.shadeClose&&n("#layui-layer-shade"+t.index).on("click",function(){o.close(t.index)}),r.find(".layui-layer-min").on("click",function(){var e=i.min&&i.min(r);e===!1||o.min(t.index,i)}),r.find(".layui-layer-max").on("click",function(){n(this).hasClass("layui-layer-maxmin")?(o.restore(t.index),i.restore&&i.restore(r)):(o.full(t.index,i),setTimeout(function(){i.full&&i.full(r)},100))}),i.end&&(s.end[t.index]=i.end)},s.reselect=function(){n.each(n("select"),function(e,t){var r=n(this);r.parents("."+a[0])[0]||1==r.attr("layer")&&n("."+a[0]).length<1&&r.removeAttr("layer").show(),r=null})},u.pt.IE6=function(e){n("select").each(function(e,t){var r=n(this);r.parents("."+a[0])[0]||"none"===r.css("display")||r.attr({layer:"1"}).hide(),r=null})},u.pt.openLayer=function(){var e=this;o.zIndex=e.config.zIndex,o.setTop=function(e){var t=function(){o.zIndex++,e.css("z-index",o.zIndex+1)};return o.zIndex=parseInt(e[0].style.zIndex),e.on("mousedown",t),o.zIndex}},s.record=function(e){var t=[e.width(),e.height(),e.position().top,e.position().left+parseFloat(e.css("margin-left"))];e.find(".layui-layer-max").addClass("layui-layer-maxmin"),e.attr({area:t})},s.rescollbar=function(e){a.html.attr("layer-full")==e&&(a.html[0].style.removeProperty?a.html[0].style.removeProperty("overflow"):a.html[0].style.removeAttribute("overflow"),a.html.removeAttr("layer-full"))},e.layer=o,o.getChildFrame=function(e,t){return t=t||n("."+a[4]).attr("times"),n("#"+a[0]+t).find("iframe").contents().find(e)},o.getFrameIndex=function(e){return n("#"+e).parents("."+a[4]).attr("times")},o.iframeAuto=function(e){if(e){var t=o.getChildFrame("html",e).outerHeight(),r=n("#"+a[0]+e),i=r.find(a[1]).outerHeight()||0,s=r.find("."+a[6]).outerHeight()||0;r.css({height:t+i+s}),r.find("iframe").css({height:t})}},o.iframeSrc=function(e,t){n("#"+a[0]+e).find("iframe").attr("src",t)},o.style=function(e,t,r){var i=n("#"+a[0]+e),o=i.find(".layui-layer-content"),u=i.attr("type"),f=i.find(a[1]).outerHeight()||0,l=i.find("."+a[6]).outerHeight()||0;i.attr("minLeft"),u!==s.type[3]&&u!==s.type[4]&&(r||(parseFloat(t.width)<=260&&(t.width=260),parseFloat(t.height)-f-l<=64&&(t.height=64+f+l)),i.css(t),l=i.find("."+a[6]).outerHeight(),u===s.type[2]?i.find("iframe").css({height:parseFloat(t.height)-f-l}):o.css({height:parseFloat(t.height)-f-l-parseFloat(o.css("padding-top"))-parseFloat(o.css("padding-bottom"))}))},o.min=function(e,t){var i=n("#"+a[0]+e),u=i.find(a[1]).outerHeight()||0,f=i.attr("minLeft")||181*s.minIndex+"px",l=i.css("position");s.record(i),s.minLeft[0]&&(f=s.minLeft[0],s.minLeft.shift()),i.attr("position",l),o.style(e,{width:180,height:u,left:f,top:r.height()-u,position:"fixed",overflow:"hidden"},!0),i.find(".layui-layer-min").hide(),"page"===i.attr("type")&&i.find(a[4]).hide(),s.rescollbar(e),i.attr("minLeft")||s.minIndex++,i.attr("minLeft",f)},o.restore=function(e){var t=n("#"+a[0]+e),r=t.attr("area").split(",");t.attr("type"),o.style(e,{width:parseFloat(r[0]),height:parseFloat(r[1]),top:parseFloat(r[2]),left:parseFloat(r[3]),position:t.attr("position"),overflow:"visible"},!0),t.find(".layui-layer-max").removeClass("layui-layer-maxmin"),t.find(".layui-layer-min").show(),"page"===t.attr("type")&&t.find(a[4]).show(),s.rescollbar(e)},o.full=function(e){var t,i=n("#"+a[0]+e);s.record(i),a.html.attr("layer-full")||a.html.css("overflow","hidden").attr("layer-full",e),clearTimeout(t),t=setTimeout(function(){var t="fixed"===i.css("position");o.style(e,{top:t?0:r.scrollTop(),left:t?0:r.scrollLeft(),width:r.width(),height:r.height()},!0),i.find(".layui-layer-min").hide()},100)},o.title=function(e,t){var r=n("#"+a[0]+(t||o.index)).find(a[1]);r.html(e)},o.close=function(e){var t=n("#"+a[0]+e),r=t.attr("type"),i="layer-anim-close";if(t[0]){var u="layui-layer-wrap",f=function(){if(r===s.type[1]&&"object"===t.attr("conType")){t.children(":not(."+a[5]+")").remove();for(var i=t.find("."+u),o=0;o<2;o++)i.unwrap();i.css("display",i.data("display")).removeClass(u)}else{if(r===s.type[2])try{var f=n("#"+a[4]+e)[0];f.contentWindow.document.write(""),f.contentWindow.close(),t.find("."+a[5])[0].removeChild(f)}catch(l){}t[0].innerHTML="",t.remove()}"function"==typeof s.end[e]&&s.end[e](),delete s.end[e]};t.data("isOutAnim")&&t.addClass(i),n("#layui-layer-moves, #layui-layer-shade"+e).remove(),6==o.ie&&s.reselect(),s.rescollbar(e),t.attr("minLeft")&&(s.minIndex--,s.minLeft.push(t.attr("minLeft"))),o.ie&&o.ie<10||!t.data("isOutAnim")?f():setTimeout(function(){f()},200)}},o.closeAll=function(e){n.each(n("."+a[0]),function(){var t=n(this),r=e?t.attr("type")===e:1;r&&o.close(t.attr("times")),r=null})};var f=o.cache||{},l=function(e){return f.skin?" "+f.skin+" "+f.skin+"-"+e:""};o.prompt=function(e,t){var i="";if(e=e||{},"function"==typeof e&&(t=e),e.area){var s=e.area;i='style="width: '+s[0]+"; height: "+s[1]+';"',delete e.area}var u,a=2==e.formType?'<textarea class="layui-layer-input"'+i+">"+(e.value||"")+"</textarea>":function(){return'<input type="'+(1==e.formType?"password":"text")+'" class="layui-layer-input" value="'+(e.value||"")+'">'}(),f=e.success;return delete e.success,o.open(n.extend({type:1,btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],content:a,skin:"layui-layer-prompt"+l("prompt"),maxWidth:r.width(),success:function(e){u=e.find(".layui-layer-input"),u.focus(),"function"==typeof f&&f(e)},resize:!1,yes:function(n){var r=u.val();""===r?u.focus():r.length>(e.maxlength||500)?o.tips("&#x6700;&#x591A;&#x8F93;&#x5165;"+(e.maxlength||500)+"&#x4E2A;&#x5B57;&#x6570;",u,{tips:1}):t&&t(r,n,u)}},e))},o.tab=function(e){e=e||{};var t=e.tab||{},r=e.success;return delete e.success,o.open(n.extend({type:1,skin:"layui-layer-tab"+l("tab"),resize:!1,title:function(){var e=t.length,n=1,r="";if(e>0)for(r='<span class="layui-layer-tabnow">'+t[0].title+"</span>";n<e;n++)r+="<span>"+t[n].title+"</span>";return r}(),content:'<ul class="layui-layer-tabmain">'+function(){var e=t.length,n=1,r="";if(e>0)for(r='<li class="layui-layer-tabli xubox_tab_layer">'+(t[0].content||"no content")+"</li>";n<e;n++)r+='<li class="layui-layer-tabli">'+(t[n].content||"no  content")+"</li>";return r}()+"</ul>",success:function(t){var i=t.find(".layui-layer-title").children(),s=t.find(".layui-layer-tabmain").children();i.on("mousedown",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0;var r=n(this),i=r.index();r.addClass("layui-layer-tabnow").siblings().removeClass("layui-layer-tabnow"),s.eq(i).show().siblings().hide(),"function"==typeof e.change&&e.change(i)}),"function"==typeof r&&r(t)}},e))},o.photos=function(t,r,i){function s(e,t,n){var r=new Image;return r.src=e,r.complete?t(r):(r.onload=function(){r.onload=null,t(r)},void (r.onerror=function(e){r.onerror=null,n(e)}))}var u={};if(t=t||{},t.photos){var a=t.photos.constructor===Object,f=a?t.photos:{},h=f.data||[],p=f.start||0;u.imgIndex=(0|p)+1,t.img=t.img||"img";var d=t.success;if(delete t.success,a){if(0===h.length)return o.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;")}else{var v=n(t.photos),m=function(){h=[],v.find(t.img).each(function(e){var t=n(this);t.attr("layer-index",e),h.push({alt:t.attr("alt"),pid:t.attr("layer-pid"),src:t.attr("layer-src")||t.attr("src"),thumb:t.attr("src")})})};if(m(),0===h.length)return;if(r||v.on("click",t.img,function(){var e=n(this),r=e.attr("layer-index");o.photos(n.extend(t,{photos:{start:r,data:h,tab:t.tab},full:t.full}),!0),m()}),!r)return}u.imgprev=function(e){u.imgIndex--,u.imgIndex<1&&(u.imgIndex=h.length),u.tabimg(e)},u.imgnext=function(e,t){u.imgIndex++,u.imgIndex>h.length&&(u.imgIndex=1,t)||u.tabimg(e)},u.keyup=function(e){if(!u.end){var t=e.keyCode;e.preventDefault(),37===t?u.imgprev(!0):39===t?u.imgnext(!0):27===t&&o.close(u.index)}},u.tabimg=function(e){if(!(h.length<=1))return f.start=u.imgIndex-1,o.close(u.index),o.photos(t,!0,e)},u.event=function(){u.bigimg.hover(function(){u.imgsee.show()},function(){u.imgsee.hide()}),u.bigimg.find(".layui-layer-imgprev").on("click",function(e){e.preventDefault(),u.imgprev()}),u.bigimg.find(".layui-layer-imgnext").on("click",function(e){e.preventDefault(),u.imgnext()}),n(document).on("keyup",u.keyup)},u.loadi=o.load(1,{shade:!("shade"in t)&&.9,scrollbar:!1}),s(h[p].src,function(r){o.close(u.loadi),u.index=o.open(n.extend({type:1,id:"layui-layer-photos",area:function(){var i=[r.width,r.height],s=[n(e).width()-100,n(e).height()-100];if(!t.full&&(i[0]>s[0]||i[1]>s[1])){var o=[i[0]/s[0],i[1]/s[1]];o[0]>o[1]?(i[0]=i[0]/o[0],i[1]=i[1]/o[0]):o[0]<o[1]&&(i[0]=i[0]/o[1],i[1]=i[1]/o[1])}return[i[0]+"px",i[1]+"px"]}(),title:!1,shade:.9,shadeClose:!0,closeBtn:!1,move:".layui-layer-phimg img",moveType:1,scrollbar:!1,moveOut:!0,isOutAnim:!1,skin:"layui-layer-photos"+l("photos"),content:'<div class="layui-layer-phimg"><img src="'+h[p].src+'" alt="'+(h[p].alt||"")+'" layer-pid="'+h[p].pid+'"><div class="layui-layer-imgsee">'+(h.length>1?'<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>':"")+'<div class="layui-layer-imgbar" style="display:'+(i?"block":"")+'"><span class="layui-layer-imgtit"><a href="javascript:;">'+(h[p].alt||"")+"</a><em>"+u.imgIndex+"/"+h.length+"</em></span></div></div></div>",success:function(e,n){u.bigimg=e.find(".layui-layer-phimg"),u.imgsee=e.find(".layui-layer-imguide,.layui-layer-imgbar"),u.event(e),t.tab&&t.tab(h[p],e),"function"==typeof d&&d(e)},end:function(){u.end=!0,n(document).off("keyup",u.keyup)}},t))},function(){o.close(u.loadi),o.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;",{time:3e4,btn:["&#x4E0B;&#x4E00;&#x5F20;","&#x4E0D;&#x770B;&#x4E86;"],yes:function(){h.length>1&&u.imgnext(!0,!0)}})})}},s.run=function(t){n=t,r=n(e),a.html=n("html"),o.open=function(e){var t=new u(e);return t.index}},e.layui&&layui.define?(o.ready(),layui.define("jquery",function(t){o.path=layui.cache.dir,s.run(layui.jquery),e.layer=o,t("layer",o)})):"function"==typeof define&&define.amd?define(["jquery"],function(){return s.run(e.jQuery),o}):function(){s.run(e.jQuery),o.ready()}()}(window);