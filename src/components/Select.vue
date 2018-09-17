<template>
    <div class="select-container">
        <div class="banner"></div>
        <div class="selector">
            <div class="container">
                <div class="row">
                    <div class="item"
                         v-for="(item, index) in lineData1"
                         :key="index"
                         :class="(activeIndex === index+1) ? `line${index+1}_active`: `line${index+1}`"
                         @click="switchLine(item,index+1)">
                    </div>
                </div>
                <div class="row">
                    <div class="item middleItem"
                         v-for="(item, index) in lineData2"
                         :key="index"
                         :class="(activeIndex === index+4) ? `line${index+4}_active`: `line${index+4}`"
                         @click="switchLine(item,index+4)">
                    </div>
                </div>
                <div class="row">
                    <div class="item"
                         v-for="(item, index) in lineData3"
                         :key="index"
                         :class="(activeIndex === index+8) ? `line${index+8}_active`: `line${index+8}`"
                         @click="switchLine(item,index+8)">
                    </div>
                </div>
            </div>

        </div>

        <vue-alloy class="swiper" @selectId="selectId" :lineData="stationData" :theme="activeIndex"
                   ref="lineSelect"></vue-alloy>

        <p class="desc">左右滑动选择相应的地铁站点</p>

        <vue-press>
            <div class="next-btn" @click="nextPage"></div>
        </vue-press>
        <div class="desc2">备注：选取样本楼盘为地铁站1公里范围内的楼盘<br>租金为2018年1-7月平均租金<br>样本楼盘并没有完全覆盖所有地铁站<br>如查询不到您所希望查询的地铁站，敬请谅解</div>
    </div>
</template>

<script>
    import VuePress from '@/components/childComponents/Press';
    import VueAlloy from '@/components/childComponents/swiper1';

    export default {
        data() {
            return {
                lineData: [],
                stationData: [],
                activeLine: '1号线',
                activeStation: '广州东站',
                activeIndex: 1,
            };
        },
        computed: {
            lineData1() {
                return this.lineData.slice(0, 3);
            },
            lineData2() {
                return this.lineData.slice(3, 7);
            },
            lineData3() {
                return this.lineData.slice(7, 10);
            },
        },
        components: {
            VuePress, VueAlloy,
        },
        created() {
            Object.keys(window.stationData).forEach((v, i) => {
                const tObj = {
                    line: v,
                    data: window.stationData[v],
                };
                this.lineData.push(tObj);
            });
            this.switchLine(this.lineData[0], 1);
        },
        methods: {
            selectId(val) {
                this.activeStation = val;
            },
            switchLine(data, index) {
                this.activeLine = data.line;
                this.activeIndex = index;
                this.stationData = [];

                Object.keys(data.data).forEach((v, i) => {
                    this.stationData.push(v);
                });
            },
            nextPage(data) {
                this.$router.push({
                    path: 'detail',
                    query: {
                        station: this.$refs.lineSelect.activeValue,
                        line: this.activeLine,
                    },
                });
            },
        },
    };
</script>

<style lang="scss">
    @import "../assets/scss/mixin";
    @import "../assets/scss/station-btn";

    .select-container {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: white;

        .banner {
            height: tr(130);
            width: 100%;
            @include cover-bg('~@img/bg-banner.png');
        }

        .selector {
            height: tr(410);
            width: 100%;
            background-color: white;
            @include cover-bg('~@img/bg-select.png');
            background-size: 100% 70%;
            background-position: center;
            display: flex;
            padding-left: tr(20);
            box-sizing: border-box;
            .container {
                margin: 0 tr(-10);
                width: 100%;
            }
            .row {
                display: flex;
                justify-content: center;
                flex-direction: row;
                margin: tr(28) tr(20) tr(64) tr(30);
                align-items: center;
            }
            .item {
                flex: 0 0 27%;
                height: tr(75);
                font-size: tr(36);
                background-repeat: no-repeat;
                background-size: contain;
                transform: scale(0.9, 0.9);
            }
            .item:active {
                transition: all .3s ease-in-out;
                transform: scale3d(1.1,1.1,0);
            }
            .middleItem {
                flex: 0 0 27%;
            }
        }

        .swiper {
            width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
            background: rgb(235, 242, 248);
        }

        .desc {
            font-size: tr(24);
            font-family: 'YuantiR';
            color: rgb(172, 105, 72);
            text-align: center;
            background: rgb(235, 242, 248);
            padding: tr(15) 0;
        }

        .next-btn {
            width: tr(240);
            height: tr(90);
            @include contain-bg('~@img/btn-nextstep.png');
            margin: tr(40) auto 0;
            font-size: tr(40);
            text-align: center;
            line-height: tr(95);
            color: white;

        }

        .desc2 {
            font-size: tr(22);
            font-family: 'YuantiR';
            line-height: tr(22);
            color: rgb(166, 157, 166);
            text-align: center;
            margin-top: tr(40);
        }
    }

</style>
