<template>
    <div id="gaodemap"></div>
</template>

<script>
export default {
    name: "gaodemap",
    data() {
        return {
            handleMap: null,
        };
    },
    mounted() {
        this.initMao();
        this.addIcon();
        this.addText();
    },
    methods: {
        //初始化
        initMao() {
            //网格
            // var road = new AMap.TileLayer({
            //     getTileUrl: function (x, y, z) {
            //         return (
            //             "https://wprd01.is.autonavi.com/appmaptile?x=" +
            //             x +
            //             "&y=" +
            //             y +
            //             "&z=" +
            //             z +
            //             "&size=1&scl=1&style=8&ltype=11"
            //         );
            //     },
            //     zooms: [6, 20],
            //     zIndex: 10,
            // });
            this.handleMap = new AMap.Map("gaodemap", {
                zoom: 12,
                center: [108.948024, 34.263161],
                //网格
                // layers: [new AMap.TileLayer.Satellite(), road],
            });
        },
        addIcon() {
            var startIcon = new AMap.Icon({
                // 图标尺寸
                size: new AMap.Size(20, 20),
                // 图标的取图地址
                image: require("@/assets/logo.png"),
                //'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
                // 图标所用图片大小
                imageSize: new AMap.Size(20, 20),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(-2, -3),
            });
            // 将 icon 传入 marker
            var startMarker = new AMap.Marker({
                position: new AMap.LngLat(108.948024, 34.263161), //图标位置
                icon: startIcon, //用哪个图标
                offset: new AMap.Pixel(-1, -0), //右下偏移量
            });
            this.handleMap.add([startMarker]);
        },
        addText() {
            let list = [
                {
                    text: "AA",
                    position: [108.948024, 34.243461],
                },
                {
                    text: "BB",
                    position: [108.948124, 34.263161],
                },
            ];
            for (let i = 0; i < list.length; i++) {
                // 创建纯文本标记
                var text = new AMap.Text({
                    text: list[i].text,
                    anchor: "center", // 设置文本标记锚点
                    draggable: true,
                    cursor: "pointer",
                    angle: 0,
                    style: {
                        padding: ".75rem 1.25rem",
                        "margin-bottom": "1rem",
                        "border-radius": ".25rem",
                        "background-color": "white",
                        width: "6rem",
                        "border-width": 0,
                        "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
                        "text-align": "center",
                        "font-size": "20px",
                        color: "blue",
                    },
                    position: list[i].position,
                });
                text.setMap(this.handleMap);
            }
        },
    },
};
</script>

<style>
#gaodemap {
    height: 100vh;
    width: 100vw;
}
</style>
