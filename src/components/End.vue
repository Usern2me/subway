<template>
    <div class="end-container">
        <div class="header">
            <div class="title"></div>
        </div>
        <img :src="require('@/assets/img/icon-share.png')" class="share">

        <div class="aaa">
            <div class="result">
                <div class="afterPriter"></div>
                <div class="printer">
                    <div class="paper" :class="{paperActive: paperActive}">
                        <div class="info-box">
                            <div class="info">
                                <div class="subway">
                                    <span>{{line}} {{station}}站</span>
                                </div>
                                <div class="room">
                                    <span>{{estate}}小区</span>
                                </div>
                            </div>
                        </div>
                        <div class="text_content-box">
                            <div class="text_content">
                                <p class="average-title">租金均价</p>
                                <p class="average"><span>{{estateValue}}元/平方米</span></p>
                                <p class="size">{{size}}平方米租金均价为：</p>
                                <p class="total"><span>{{total}}元</span></p>
                                <div class="desc2">备注：选取样本楼盘为地铁站1公里范围内的楼盘;<br>租金为2018年1-7月平均租金</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrap">
            <div class="btns">
                <vue-press>
                    <div class="btn replay" @click="replay"></div>
                </vue-press>
                <vue-press>
                    <div class="btn more" @click="more"></div>
                </vue-press>
            </div>
            <div class="float"></div>

            <div class="bottom">
                <div class="item logo"></div>
                <div class="item bottom_text">南方经济智库出品 省住房政策研究中心支持</div>
            </div>
        </div>
    </div>
</template>

<script>
    import VuePress from '@/components/childComponents/Press'
    import config from '@/config/config';
    import sdk from '@/config/sdk'

    export default {
        data() {
            return {
                line: '1号线',
                station: '广州东站',
                style: '1房户',
                type: '电梯楼',
                average: '0',
                size: 30,
                total: 978,
                paperActive: false,
                estate: '',
                estateValue: '',
            }
        },
        components: {
            VuePress
        },
        created() {
            let query = this.$route.query;
            this.line = query.line;
            this.station = query.station;
            this.size = query.size;
            this.type = query.type
            this.estate = query.estate;
            this.estateValue = query.estateValue;
            this.total = (this.size * this.estateValue).toFixed(2);

            setTimeout(() => {
                this.paperActive = true;
            }, 1000)

            this.resetTitle();
            sdk.resetWxShare({
                title: '我想租的' + this.station + this.estate + '租金价为：' + this.estateValue + '元/平方米，你也来查查！'
            });
        },
        methods: {
            replay() {
                this.$router.push('select');
            },
            more() {
                window.location.href = 'https://static.nfapp.southcn.com/nfh/shareNFNum/index.html?nfhId=4842'
            },
            resetTitle() {
                document.title = '我想租的' + this.station + this.estate + '租金价为：' + this.average + '元/平方米，你也来查查！'
            }
        },
        watch: {
            paperActive(val) {
                if (val) {
                    // window.printerBgm.play();
                }
            }
        },
        beforeDestroy() {
            document.title = '广州租房小利器来了！'
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/mixin";

    .end-container {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        text-align: center;
        @include cover-bg('~@img/bg-end.png');
        background-size: auto 80%;
        background-position: center;
        color: rgb(192, 104, 62);

        .header {
            display: flex;
            justify-content: center;
            height: tw(150);
            margin-top: tw(20);
            .title {
                @include cover-bg('~@img/title-result.png');
                background-size: 60% auto;
                background-position: center;
                flex: 0 0 100%;
            }
        }
        .share {
            position: absolute;
            height: tw(100);
            width: auto;
            top: tw(20);
            right: tw(50);
        }
        .aaa {
            height: 63%;
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column;
            justify-content: center;
        }
        .result {
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .printer {
            flex: 1 1 95%;
            height: auto;
            width: 90%;
            margin: tw(-18) auto 0;
            overflow: hidden;
        }
        .afterPriter {
            flex: 1 1 5%;
            @include contain-bg('~@img/printer.png');
            background-position: bottom;
            position: relative;
            width: 90%;
            height: tw(58);
            left: 50%;
            top: tr(10);
            transform: translateX(-50%);
        }

        div.paperActive {
            transform: translate(0px, 0px);
        }

        .paper {
            @include cover-bg('~@img/paper.png');
            background-size: 100% 100%;
            background-position: center;
            width: 90%;
            height: tr(718);
            margin-left: tw(32);
            margin-top: tr(-3);
            position: relative;
            transform: translate(0, tr(-760));
            transition: transform .5s ease-in-out;

            .info-box {
                width:50%;
                height: 36%;
                margin-left: 9%;
            }
            .info {
                width: 100%;
                position: relative;
                top: 35%;
                text-align: center;
                font-size: tw(32);
                @media only screen
                and (device-width : 375px)
                and (device-height : 812px)
                and (-webkit-device-pixel-ratio : 3) {
                    top:.42rem;
                }
                span {
                    background: linear-gradient(to bottom, transparent, transparent 40%, rgb(239, 237, 177) 40%, rgb(239, 237, 177))
                }
            }
            .room {
                font-size: tw(30);
                span {
                    background: linear-gradient(to bottom, transparent, transparent 40%, rgb(239, 237, 177) 40%, rgb(239, 237, 177))
                }
            }

            .text_content-box {
                width: 100%;
                height: 68%;
                display: flex;
                justify-content: center;
                align-items: center;
                @media only screen
                and (device-width : 375px)
                and (device-height : 812px)
                and (-webkit-device-pixel-ratio : 3) {
                    height: 97%;
                }
            }
            .text_content {
                flex: 0 0 100%;
                height: 80%;
                .average-title {
                    font-size: tw(36);
                    line-height: tw(36);
                    text-align: center;
                }
                .average {
                    font-size: tw(60);
                    line-height: tw(60);
                    padding-top: tw(20);
                    span {
                        background: linear-gradient(to bottom, transparent, transparent 40%, rgb(239, 237, 177) 40%, rgb(239, 237, 177))
                    }
                }
                .size {
                    font-size: tw(36);
                    line-height: tw(36);
                    margin-top: tw(40);
                }
                .total {
                    font-size: tr(54);
                    line-height: tr(54);
                    margin-top: tr(22);
                    span {
                        background: linear-gradient(to bottom, transparent, transparent 40%, rgb(239, 237, 177) 40%, rgb(239, 237, 177))
                    }
                }

                .desc2 {
                    margin-top: tw(54);
                    font-size: tw(24);
                    font-family: 'YuantiR';
                    line-height: tw(26);
                    color: rgb(152, 152, 152);
                }
            }
        }

        .wrap {
            flex: 1;
            display: flex;
            align-items: center;
            width: 100%;
            height: 15%;
            justify-content: center;
        }

        .btns {
            width: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            margin-top: tr(20);
            @media only screen
            and (device-width : 375px)
            and (device-height : 812px)
            and (-webkit-device-pixel-ratio : 3) {
                margin-top: tr(70);
            }
            .btn {
                flex: 1 1 100%;
                height: tw(88);
                width: tw(223);
                margin: tw(20) tw(30);
                transform: scale(1.1, 1.1);
            }

            .replay {
                @include contain-bg('~@img/btn-searchmore.png');
            }
            .more {
                @include contain-bg('~@img/btn-more.png');
            }
        }
        .bottom {
            //flex: 1 1 50%;
            font-size: tr(22);
            color: rgb(152, 152, 152);
            position: fixed;
            bottom: tw(20);
            margin: 0 auto;
            left: 0;
            right: 0;
            .item {
                display: flex;
                justify-content: center;
            }
            .logo {
                flex-basis: 100%;
                height: tw(60);
                @include contain-bg('~@/assets/img/logo-bottom.png');
                background-position: center;
            }
            .bottom_text {
                flex: 0 0 100%;
                font-size: tr(20);
                font-family: 'YuantiR';
                font-size: tr(22);
            }
        }
    }

</style>
