layui.define(function(e){"use strict";var t={open:"{{",close:"}}"},n={exp:function(e){return new RegExp(e,"g")},query:function(e,n,i){var s=["#([\\s\\S])+?","([^{#}])*?"][e||0];return r((n||"")+t.open+s+t.close+(i||""))},escape:function(e){return String(e||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")},error:function(e,t){var n="Laytpl Error：";return"object"==typeof console&&console.error(n+e+"\n"+(t||"")),n+e}},r=n.exp,i=function(e){this.tpl=e};i.pt=i.prototype,window.errors=0,i.pt.parse=function(e,i){var s=this,o=e,u=r("^"+t.open+"#",""),a=r(t.close+"$","");e=e.replace(/\s+|\r|\t|\n/g," ").replace(r(t.open+"#"),t.open+"# ").replace(r(t.close+"}"),"} "+t.close).replace(/\\/g,"\\\\").replace(/(?="|')/g,"\\").replace(n.query(),function(e){return e=e.replace(u,"").replace(a,""),'";'+e.replace(/\\/g,"")+';view+="'}).replace(n.query(1),function(e){var n='"+(';return e.replace(/\s/g,"")===t.open+t.close?"":(e=e.replace(r(t.open+"|"+t.close),""),/^=/.test(e)&&(e=e.replace(/^=/,""),n='"+_escape_('),n+e.replace(/\\/g,"")+')+"')}),e='"use strict";var view = "'+e+'";return view;';try{return s.cache=e=new Function("d, _escape_",e),e(i,n.escape)}catch(f){return delete s.cache,n.error(f,o)}},i.pt.render=function(e,t){var r,i=this;return e?(r=i.cache?i.cache(e,n.escape):i.parse(i.tpl,e),t?void t(r):r):n.error("no data")};var s=function(e){return"string"!=typeof e?n.error("Template not found"):new i(e)};s.config=function(e){e=e||{};for(var n in e)t[n]=e[n]},s.v="1.2.0",e("laytpl",s)});