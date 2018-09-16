<template>
    <div class="detail-container">
        <div class="banner"></div>

        <div class="detail">
            <div class="box">
                <div class="type">
                    <div class="type-item-box">
                        <div class="type-item distIn"
                             :class="{disabled: !isDistIn}"
                             @click="switchType('distIn')">
                            <vue-press>
                                <div class="icon" :class="activeType==='distOut'?'distIn':''"></div>
                            </vue-press>
                            <p :class="activeType==='distIn'?'active':''">0m～500m(含)</p>
                        </div>
                        <div class="type-item distOut"
                             :class="{disabled: !isDistOut}"
                             @click="switchType('distOut')">
                            <vue-press>
                                <div class="icon" :class="activeType==='distIn'?'distOut':''"></div>
                            </vue-press>
                            <p :class="activeType==='distOut'?'active':''">500m～1km(含)</p>
                        </div>
                    </div>
                </div>
                <div class="pickers"
                     v-if="isPickerShow">
                    <vue-pickers
                            :defaultData="defaultData"
                            :selectData="estateData"
                            @getSelectData="getSelectData">
                    </vue-pickers>
                </div>
                <div class="pickers"
                     v-show="!isPickerShow">
                    <vue-pickers
                            :defaultData="defaultData"
                            :selectData="estateData"
                            @getSelectData="getSelectData">
                    </vue-pickers>
                </div>
            </div>
            <div class="desc">
                <p>上下滑动选择楼盘</p>
            </div>
        </div>

        <div class="swipers">
            <vue-alloy class="swiper" @selectId="selectId" :lineData="stationData" ref="sizeSelect"></vue-alloy>
        </div>
        <p class="desc1">左右滑动选择相应的面积/单位：平方米</p>

        <div class="btns">
            <div class="btn pre" @click="goPrevious"></div>
            <div class="btn confirm" @click="confirm"></div>
        </div>

    </div>
</template>

<script>
    import VuePress from '@/components/childComponents/Press';
    import VueAlloy from '@/components/childComponents/Swiper2';
    import verticalSwiper from '@/components/childComponents/verticalSwiper';
    import vuePickers from '@/components/childComponents/picker';
    import config from '@/config/config';

    export default {
        data() {
            return {
                line: '',
                station: '',
                stationData: [],
                activeType: 'distIn',
                estate: null,
                estateValue: null,
                activeSize: 0,
                isDistIn: true,
                isDistOut: true,
                isShow: true,
                isPickerShow: true,
                defaultData: [{
                    text: '',
                    value: '',
                }],
                estateData: {
                    data1: [],
                },
                distIn: [],
                distOut: [],
                nowDistIn: [{
                    text: null,
                    value: null,
                }],
                nowDistOut: [{
                    text: null,
                    value: null,
                }],
            };
        },
        components: {
            VuePress, VueAlloy, verticalSwiper, vuePickers,
        },
        created() {
            this.station = this.$route.query.station;
            this.line = this.$route.query.line;
            this.formatEstateData();
            this.setState();
        },
        watch: {
            isPickerShow(val) {
                // 重置默认值为两种情况下的值
                if (val) {
                    this.defaultData = this.nowDistIn;
                } else {
                    this.defaultData = this.nowDistOut;
                }
            }
        },
        methods: {
            formatEstateData() {
                const data = window.stationData[this.line][this.station];
                const keysIn = Object.keys(data.distIn);
                const keysOut = Object.keys(data.distOut);
                // 判断初始值
                if (keysIn.length === 0) {
                    this.defaultData.text = keysOut[0];
                    this.defaultData.value = data.distOut[`${this.defaultData.text}`];
                } else {
                    this.defaultData.text = keysIn[0];
                    this.defaultData.value = data.distIn[`${this.defaultData.text}`];
                }
                // 初始两种情况下nowdist的值
                this.nowDistIn.text = keysIn[0];
                this.nowDistIn.value = data.distIn[`${this.nowDistIn.text}`];
                this.nowDistOut.text = keysOut[0];
                this.nowDistOut.value = data.distOut[`${this.nowDistOut.text}`];

                // 格式化数据成picker需要的格式
                keysIn.forEach((v) => {
                    this.distIn.push({text: v, value: data.distIn[v]});
                });
                keysOut.forEach((v) => {
                    this.distOut.push({text: v, value: data.distOut[v]});
                });
            },
            setState() {
                const data = window.stationData[this.line][this.station];
                this.isDistIn = Object.keys(data.distIn).length !== 0;
                this.isDistOut = Object.keys(data.distOut).length !== 0;
                // 本来默认500米内，如果没有换成500米外
                if (!this.isDistIn) {
                    this.activeType = 'distOut';
                }
                // 初始化select值
                if (this.isDistIn) {
                    this.$set(this.estateData, 'data1', this.distIn);
                } else {
                    this.$set(this.estateData, 'data1', this.distOut);
                }
            },
            confirm() {
                window.printerBgm.play();
                if (this.isPickerShow) {
                    this.estate = this.nowDistIn.text;
                    this.estateValue = this.nowDistIn.value;
                } else {
                    this.estate = this.nowDistOut.text;
                    this.estateValue = this.nowDistOut.value;
                }

                this.$router.push({
                    path: 'end',
                    query: {
                        size: this.$refs.sizeSelect.activeValue,
                        type: this.activeType,
                        estate: this.estate,
                        estateValue: this.estateValue,
                        line: this.line,
                        station: this.station,
                    },
                });
            },
            goPrevious() {
                this.$router.push('select');
            },
            selectId(id) {
                this.activeSize = id;
            },
            switchType(data) {
                this.activeType = data;
                this.isPickerShow = !this.isPickerShow;
                this.changeData(data);
            },
            // 点击换楼盘数据
            changeData(type) {
                if (type === 'distIn') {
                    this.$set(this.estateData, 'data1', this.distIn);
                } else {
                    this.$set(this.estateData, 'data1', this.distOut);
                }
            },
            // picker的值
            getSelectData(data) {
                this.estate = data.text;
                this.estateValue = data.value;
                // 记录当前dist的值
                if (this.isPickerShow) {
                    this.nowDistIn.text = data.text;
                    this.nowDistIn.value = data.value;
                } else {
                    this.nowDistOut.text = data.text;
                    this.nowDistOut.value = data.value;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "../assets/scss/mixin";

    @mixin background {
        background-color: transparent;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
    }

    .disabled {
        opacity: .5;
        pointer-events: none;
    }

    .detail-container {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: white;
        .banner {
            height: tw(140);
            width: 100%;
            @include contain-bg('~@img/bg-banner2.png');
        }
        .detail {
            height: 50%;
        }
        .box {
            @include contain-bg('~@img/distance.png');
            background-position: center;
        }
        .type {
            height: tr(250);
            width: 90%;
            position: relative;
            top: tr(-30);
            left: 0;
            right: 0;
            margin: 0 auto;
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            box-sizing: border-box;
            color: rgb(160, 170, 198);
            @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
                align-items: center;
            }

            .type-item-box {
                height: 83%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .type-item {
                display: inline-flex;
                align-items: baseline;
                justify-content: flex-start;
                width: tr(250);
                .icon {
                    @include contain-bg('~@img/icon_distance_true.png');
                    height: tr(27);
                    width: tr(27);
                    margin-right: tr(5);
                }
                .distIn {
                    visibility: hidden;
                }
                .distOut {
                    visibility: hidden;
                }
                .active {
                    color: rgb(193, 93, 19);
                }
            }
            p {
                font-size: tr(30);
                text-align: center;
                margin-top: tr(12);
            }
        }
        .swipers {
            margin-top: tw(-40);
        }
        .swiper {
            width: tw(590);
            height: tr(200);
            display: block;
            margin: 0 auto;
        }
        .desc {
            font-size: tr(22);
            font-family: 'YuantiR';
            text-align: center;
            height: tr(65);
            position: relative;
            top: -4em;
            color: rgb(193, 93, 19);
            background-color: rgb(236, 243, 248);
            @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
                top: -6.5em;
            }
        }
        .desc1 {
            font-size: tr(22);
            font-family: 'YuantiR';
            text-align: center;
            color: rgb(193, 93, 19);
            margin-top: tw(28);
        }
        .btns {
            height: tr(132);
            width: 100%;
            padding: tr(46);
            box-sizing: border-box;
            display: flex;
            justify-content: space-around;
            margin-top: tr(20);
            z-index: 1000;
            .btn {
                height: tr(88);
                width: tw(234);
            }
            .pre {
                @include contain-bg('~@img/btn-forward.png');
            }
            .confirm {
                @include contain-bg('~@img/btn-search.png');
            }
        }
        .pickers {
            height: 1.34rem;
            margin-top: .137em;
        }
    }

</style>
