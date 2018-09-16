<template>
    <div id="vcarousel-container" v-if="isAlloyTouch">
        <div class="vcarousel">
            <ul class="vcarousel-scroller" id="vcarousel-scroller">
                <li v-for="(item, index) in estateData" :key="index">
                    <div class="item" :style="{height: itemHeight + 'px'}" @click="handleClick(index)">
                        <div class="text" :class="{normalSize: index!=activeIndex}">
                            <div>{{item.text}}</div>
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
                itemHeight: 50,       // 每个单位的宽度
                containerHeight: 0,
                itemCenter: 0,          // 当前item的中点
                resetDelay: 50,        // 重置到中点的延迟时间
                delayDuration: 100,     // 重置到中点动画时间
                scale: 0.5,               // 中点放大量
                isTouch: false,
                timer: null,
                isAlloyTouch: true,
                initOffset: 2,
            };
        },
        props: ['estateData', 'theme'],
        mounted() {
            this.initTouch();
        },
        methods: {
            initTouch() {
                // 必须清除掉原先的dom再使用AlloyTouch，不然会导致一些神奇的问题
                // 使用v-if指令先删除再显示即可清楚dom节点。
                this.isAlloyTouch = false;
                window.valloyInstance = null;

                this.$nextTick(() => {
                    this.isAlloyTouch = true;
                    this.$nextTick(() => {
                        const self = this;
                        this.centerPoint = parseInt(getComputedStyle(document.querySelector('.vcarousel')).height) / 2;
                        this.containerHeight = parseInt(getComputedStyle(document.getElementById('vcarousel-container')).height);
                        const vscroller = document.querySelector('#vcarousel-scroller');
                        Transform(vscroller);
                        this.vinstance = new AlloyTouch({
                            touch: '#vcarousel-container', // 反馈触摸的dom
                            vertical: true, // 不必需，默认是true代表监听竖直方向touch
                            target: vscroller, // 运动的对象
                            maxSpeed: 1,
                            friction: 3,
                            bindself: true,
                            step: this.itemHeight,
                            property: 'translateY',  // 被运动的属性
                            min: (-this.itemHeight * this.estateData.length)
                                + this.containerHeight * 0.5,
                            max: this.itemHeight * 2, // 不必需,滚动属性的最大值。刻度尺左侧距离。
                            touchStart: () => {
                                clearTimeout(this.timer);
                                console.log(654)
                                // 添加一个标记，用于区分是手动动画还是自动动画
                                this.isTouch = true;
                            },
                            change: this.touchmove,
                            animationEnd: this.scrollEnd,
                        });
                        // 用于通知alloyTouch.js内部不要重复绑定touchmove事件。
                        window.valloyInstance = this.vinstance;
                        // 初始化时，重置到指定位置；
                        this.vinstance.to(
                            this.containerHeight / 2 - this.itemHeight * (this.initOffset - 0.5));
                    });
                });
            },
            touchmove(val) {
                // 正在中间的index
                this.activeIndex = -1 * parseInt((val - this.centerPoint) / this.itemHeight);
                if (this.activeIndex > this.estateData.length - 1) {
                    this.activeIndex = this.estateData.length - 1;
                }

                // 激活的item的中间位置
                this.itemCenter = this.itemHeight * (this.activeIndex + 0.5);
                // 激活的item偏离中点的距离
                const itemOffset = this.centerPoint - val - this.itemCenter;
                // 保证scale最小值为1；
                let scale = ((0.4 - ((Math.abs(itemOffset) / this.itemHeight))) * this.scale) + 1;
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

                this.activeValue = this.estateData[this.activeIndex];
            },
            scrollEnd() {
                if (!this.isTouch) return;

                this.isTouch = false;

                this.timer = setTimeout(() => {
                    this.instance.to(this.centerPoint - this.itemCenter + 15, this.delayDuration);
                    this.$emit('selectId', this.estateData[this.activeIndex], this.activeIndex);
                }, this.resetDelay);
            },
            handleClick(index) {
                let moveDist = this.containerHeight / 2 - this.itemHeight * (index + 1) + 22;
                this.vinstance.to(moveDist);
            },
        },
        watch: {
            estateData(val) {
                this.initTouch();
            },
        },
        beforeDestroy() {
            window.valloyInstance = null;
        },
    };
</script>

<style lang="scss" scoped>

    @function tr($px) {
        @return $px/240*1rem;
    }

    @function tw($px) {
        @return $px/750*100vw;
    }

    @mixin background {
        background-color: transparent;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
    }

    #vcarousel-container {
        overflow: hidden;

        .normalSize {
            transform: scale(0.9, 0.9) !important;
            color: gray !important;
            background-color: #ffffff !important;
        }

        .wrapper {
            width: 100%;
            position: relative;
        }

        li {
            display: block;
            text-decoration: none;
            list-style: none;
        }
        .item {
            position: relative;
            font-size: tr(40);
            line-height: tr(100);
            overflow: hidden;
            white-space: normal;
            text-align: center;
            box-sizing: border-box;

            .text {
                background: #e5e5e5;
            }
        }

    }

    .vcarousel {
        margin: 0 auto;
        overflow: hidden;
        position: relative;
        height: tr(500);
        border: 1px solid black;
    }

    .vcarousel-scroller {
        position: relative;
        font-size: 0;
        white-space: nowrap;
        height: tr(500);
    }
</style>
