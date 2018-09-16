<template>
    <div id="carousel-container" v-if="isAlloyTouch">
        <div class="carousel">
            <ul class="carousel-scroller" id="carousel-scroller">
                <li v-for="(item, index) in lineData" :key="index">
                    <div class="item" :style="{width: itemWidth + 'px'}" @click="handleClick(index)">
                        <div class="splash" v-show="index==activeIndex"></div>
                        <div class="text"
                             :class="index==activeIndex?`activeText station${theme}`:`normalSize station_false`">
                            <div class="content">{{item}}</div>
                        </div>
                        <div class="item-after" :style="{right: itemWidth/2 + 'px'}">
                            <div class="dotdot"
                                 :class="index == activeIndex?`dot${theme}`:`dot`"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                instance: null,
                activeIndex: 0,     // 处于变大状态的index
                activeValue: '',
                centerPoint: 0,     // 刻度尺的中点
                itemWidth: 100,       // 每个单位的宽度
                containerWidth: 0,
                itemCenter: 0,          // 当前item的中点
                resetDelay: 300,        // 重置到中点的延迟时间
                delayDuration: 300,     // 重置到中点动画时间
                scale: 0.5,               // 中点放大量
                isTouch: false,
                timer: null,
                isAlloyTouch: true,
                initOffset: 11,
            };
        },
        props: ['lineData', 'theme'],
        mounted() {
            this.initTouch();
        },
        methods: {
            initTouch() {
                // 必须清除掉原先的dom再使用AlloyTouch，不然会导致一些神奇的问题
                // 使用v-if指令先删除再显示即可清楚dom节点。
                this.isAlloyTouch = false;
                window.alloyInstance = null;

                // 初始广州东站，其他默认第3个
                if (this.initOffset === 11) {
                    this.initOffset = this.lineData.length > this.initOffset ?
                        this.initOffset : this.lineData.length;
                } else {
                    this.initOffset = this.lineData.length > 3 ? 3 : this.lineData.length;
                }

                this.$nextTick(() => {
                    this.isAlloyTouch = true;
                    this.$nextTick(() => {
                        const self = this;
                        this.centerPoint = parseInt(getComputedStyle(document.querySelector('.carousel')).width) / 2;
                        this.containerWidth = parseInt(getComputedStyle(document.getElementById('carousel-container')).width);

                        const scroller = document.querySelector('#carousel-scroller');
                        Transform(scroller);
                        this.instance = new AlloyTouch({
                            touch: '#carousel-container', // 反馈触摸的dom
                            vertical: false, // 不必需，默认是true代表监听竖直方向touch
                            target: scroller, // 运动的对象
                            maxSpeed: 1,
                            friction: 3,
                            property: 'translateX',  // 被运动的属性
                            min: (-this.itemWidth * this.lineData.length) + this.containerWidth * 0.5,
                            max: this.containerWidth * 0.5, // 不必需,滚动属性的最大值。刻度尺左侧距离。
                            touchStart: () => {
                                clearTimeout(this.timer);
                                // 添加一个标记，用于区分是手动动画还是自动动画
                                this.isTouch = true;
                            },
                            change: this.touchmove,
                            animationEnd: this.scrollEnd,
                        });
                        // 用于通知alloyTouch.js内部不要重复绑定touchmove事件。
                        window.alloyInstance = this.instance;
                        // 初始化时，重置到指定位置；
                        this.instance.to(
                            this.containerWidth / 2 - this.itemWidth * (this.initOffset - 0.5));
                    });
                });
            },
            touchmove(val) {
                // 正在中间的index
                this.activeIndex = parseInt((val - this.centerPoint) / this.itemWidth) * -1;
                if (this.activeIndex > this.lineData.length - 1) {
                    this.activeIndex = this.lineData.length - 1;
                }

                // 激活的item的中间位置
                this.itemCenter = this.itemWidth * (this.activeIndex + 0.5);
                // 激活的item偏离中点的距离
                const itemOffset = this.centerPoint - val - this.itemCenter;
                // 保证scale最小值为1；
                let scale = ((0.5 - ((Math.abs(itemOffset) / this.itemWidth))) * this.scale) + 1;

                if (scale < 1) {
                    scale = 1;
                }

                let target;

                if (!isNaN((this.activeIndex + 1))) {
                    target = document.querySelector(`li:nth-child(${this.activeIndex + 1}) .text`);
                }

                if (target) {
                    target.style.transform = `scale(${scale}, ${scale})`;
                }

                this.activeValue = this.lineData[this.activeIndex];
            },
            scrollEnd() {
                if (!this.isTouch) return;

                this.isTouch = false;

                this.timer = setTimeout(() => {
                    this.instance.to(this.centerPoint - this.itemCenter, this.delayDuration);
                    this.$emit('selectId', this.lineData[this.activeIndex], this.activeIndex);
                }, this.resetDelay);
            },
            handleClick(index) {
                this.instance.to(this.itemWidth * (index + 0.5) * -1 + this.containerWidth / 2, this.delayDuration);
            },
        },
        watch: {
            lineData(val) {
                this.initTouch();
            },
        },
        beforeDestroy() {
            window.alloyInstance = null;
        },
    };
</script>

<style lang="scss" scoped>
@import "../../assets/scss/station-btn";
@import "../../assets/scss/mixin";

    @function tr($px) {
        @return $px/240*1rem;
    }

    @function tw($px) {
        @return $px/750*100vw;
    }

    #carousel-container {
        overflow: hidden;

        .normalSize {
            transform: scale(1, 1) !important;
        }

        .wrapper {
            width: 100%;
            position: relative;
        }
        ul::after {
            content: '';
            clear: both;
        }
        li {
            display: inline-block;
            text-decoration: none;
            list-style: none;

        }
        .item {
            position: relative;
            font-size: tr(22);
            color: #98a1ba;
            line-height: tr(26);
            overflow: hidden;
            white-space: normal;
            text-align: center;
            box-sizing: border-box;

            .text {
                bottom: 0;
                display: table;
                height: tr(170);
                width: tr(64);
                margin: tr(94) auto 0;
                transform-origin: 50% 100%;
                border-radius: tr(32);
                padding: 0 tr(20);
                box-sizing: border-box;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;

                .content {
                    display: table-cell;
                    vertical-align: middle;
                }
            }
            .activeText {
                color: white;
                text-stroke: .6px rgb(195,107,65);
                -webkit-text-stroke: .6px rgb(195,107,65);
            }
        }
        .splash {
            position: relative;
            margin: tr(10) auto tr(-30);
            width: tr(90);
            height: tr(20);
            top: 0;
            left: 0;
        }
        .item-after {
            margin-top: tr(26);
            position: relative;
            width: 100%;
            left: 0;
            bottom: 0;
            display: block;
            height: tr(45);
            @include cover-bg('~@img/dotdot.png');
            background-size: 140% ,cover;
            background-position: center;
            background-repeat: no-repeat;

            .dotdot {
                width: tr(40);
                height: tr(40);
                position: absolute;
                margin-left: tr(-18);
                margin-top: tr(-19);
                left: 50%;
                top: 50%;
                background-size: cover;
            }

            .activeDot {
                width: tr(48);
                height: tr(48);
                position: absolute;
                left: 50%;
                top: 50%;
            }

        }

    }

    .carousel {
        margin: 0 auto;
        overflow: hidden;
        position: relative;
    }

    .carousel-scroller {
        position: relative;
        font-size: 0;
        white-space: nowrap;
    }
</style>
