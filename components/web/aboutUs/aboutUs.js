define([
        'text!./aboutUs.html', '$css!./aboutUs.css'
    ],
    function(html){
        function render(){
            $('.view-window').html(html);
            utilIndex.showFooter();
            // 头部轮播图
            utilIndex.swiper('mySwiper5','.swiper-container5','.pagination5','.arrow-left5','.arrow-right5');

            // 点击切换关于安锐达和联系我们
            $('.about-menu-list').find('li').each(function (index) {
                $(this).click(function () {
                    $(this).addClass('about-menu-list-active').siblings().removeClass('about-menu-list-active');
                    if(index === 0){
                        $('.about-ard-box-box').show();
                        $('.contact-us-box').hide()
                    }else{
                        $('.about-ard-box-box').hide();
                        $('.contact-us-box').show();
                    }
                })
            })




            $(function () {
                initMap();
            })
            //创建和初始化地图函数：
            function initMap(){
                createMap();//创建地图
                setMapEvent();//设置地图事件
                addMapControl();//向地图添加控件
                addMapOverlay();//向地图添加覆盖物
            }
            function createMap(){
                map = new BMap.Map("dituContent");
                map.centerAndZoom(new BMap.Point(106.511449,29.619385),14);
                map.setMapStyle({style:'grayscale'});

            }
            function setMapEvent(){
                map.enableKeyboard();
                map.enableDragging();
            }
            function addClickHandler(target,window){
                target.addEventListener("click",function(){
                    target.openInfoWindow(window);
                });
            }
            function addMapOverlay(){
                var markers = [
                    {content:"中国重庆市两江新区青枫北路双子座B座24楼",title:"",imageOffset: {width:-46,height:-21},position:{lat:29.620248,lng:106.506616}}
                ];
                for(var index = 0; index < markers.length; index++ ){
                    var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
                    var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
                        imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
                    })});
                    var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
                    var opts = {
                        width: 200,
                        title: markers[index].title,
                        enableMessage: false
                    };
                    var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
                    marker.setLabel(label);
                    addClickHandler(marker,infoWindow);
                    map.addOverlay(marker);
                    map.panBy(800, 400);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                };
            }
            //向地图添加控件
            function addMapControl(){
                var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
                scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
                map.addControl(scaleControl);
                var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:3});
                map.addControl(navControl);
            }
            var map;

        }
        return {
            render:render
        }
    })



