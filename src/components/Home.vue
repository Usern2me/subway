<template>
    <div class="home-container">
        <div class="loading" v-show="isLoading">
            <div class="bar">
                <div class="process" :style="{width: progress + '%'}">
                </div>
                <p class="process-text">{{progress}}%</p>
            </div>
        </div>
        <div class="main" v-show="!isLoading">
            <div class="bg-main"></div>
            <vue-press style="z-index: 2;position: relative;">
                <div class="start" @click="start"></div>
            </vue-press>
            <div class="bottom">
                <img :src="require('@/assets/img/logo-bottom.png')" class="logo">
                <div class="bottom-text">南方经济智库出品 省住房政策研究中心支持</div>
            </div>
        </div>

        <vue-preload @percentage="percentage" @loaded="loaded"></vue-preload>
    </div>
</template>

<script>
    import VuePress from '@/components/childComponents/Press';
    import VuePreload from '@/components/childComponents/Preload';

    export default {
        data() {
            return {
                isLoading: true,
                dashedWidth: 0,
                progress: 0,
                mainWidth: 100,
                mainHeight: 100,
                mainLeft: 0,
                mainSize: 100,
            };
        },
        components: {
            VuePress,
            VuePreload,
        },
        created() {
            this.init();
        },
        mounted() {
            this.renderMain();
        },
        methods: {
            init() {
                this.animateDash();
            },
            // 利用js布局。画一个和背景图片一样大小的div，然后根据背景定位的元素根据该div来布局。
            // 设好改div的字体大小，然后子元素用em布局。
            renderMain() {
                const bgMainImg = new Image();
                let ratio = 1;
                let scale = 1;

                const parentHeight = $('.bg-main').css('height');
                const parentWidth = $('.bg-main').css('width');
                const parentRatio = parseInt(parentWidth) / parseInt(parentHeight);

                bgMainImg.onload = () => {
                    // 获取背景图的宽高
                    const width = bgMainImg.width;
                    const height = bgMainImg.height;

                    ratio = width / height;

                    if (ratio > parentRatio) {
                        // 如果图比容器宽
                        this.mainWidth = parseInt(parentWidth);
                        scale = this.mainWidth / width;
                        this.mainHeight = parseInt(height * scale);
                    } else {
                        // 如果图比容器高或相等
                        this.mainHeight = parseInt(parentHeight);
                        scale = this.mainHeight / height;
                        this.mainWidth = parseInt(scale * width);
                    }

                    this.mainSize = this.mainWidth / 5;
                };
                bgMainImg.src = require('@/assets/img/bg-main.png');
            },
            animateDash() {
                requestAnimationFrame(() => {
                    this.dashedWidth += 0.1;
                    this.animateDash();
                });
            },
            start() {
                if (window.gameBgm.paused) {
                    window.gameBgm.play();
                }
                this.$router.push('select');
            },
            percentage(data) {
                this.progress = parseInt(data * 100);
            },
            loaded() {
                this.isLoading = false;
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "../assets/scss/mixin";

    .home-container {
        width: 100%;
        height: 100%;
        left: 0;
        background-color: white;

        @mixin background {
            background-color: transparent;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: top;
        }

        .loading {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;

            .bar {
                position: relative;
                width: tw(520);
                height: tr(14);
                background-color: rgb(229, 229, 229);
                margin: tr(534) auto 0;
                border-radius: tr(7);
                // overflow: hidden;
            }
            .process {
                position: relative;
                height: tr(14);
                border-radius: tr(7);
                background-color: rgb(210, 47, 60);
            }

            .process::after {
                content: "";
                position: absolute;

                height: tr(64);
                width: tr(44);
                bottom: tr(14+14);
                right: tr(-22);
                @include background;
                background-image: url("../assets/img/icon-loading.png");
            }

            .process-text {
                text-align: center;
                font-size: tr(20);
                margin-top: tr(20);
            }
        }

        .main {
            position: absolute;
            width: 100%;
            height: 100%;
            top: tr(50);
            left: 0;

            div.bg-main {
                margin: 0 auto;
                z-index: 1;
                width: 100%;
                height: 100%;
                @include contain-bg('~@img/bg-main.png');
            }

            .start {
                @include contain-bg('~@img/btn-search.png');
                position: absolute;
                margin: 0 auto;
                bottom:.9rem;
                left: 0;
                right: 0;
                width: tw(240);
                height: tr(90);
                @media only screen
                and (device-width : 375px)
                and (device-height : 812px)
                and (-webkit-device-pixel-ratio : 3) {
                    bottom: 1.4rem;
                }
            }

            .bottom {
                width: tw(470);
                position: fixed;
                left:50%;
                transform: translateX(-50%);
                bottom:tr(40);
                font-family: 'YuantiR';
                .logo {
                    width: tw(470);
                    height: auto;
                    margin-bottom: tr(-60);
                }
                .bottom-text {
                    text-wrap: avoid;
                    text-align: center;
                    font-size: tr(20);
                    color:rgb(155,161,173);
                    width: tw(470);
                }
            }
        }
    }
</style>


