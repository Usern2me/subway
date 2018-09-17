<template>
    <div id="picker">
        <div class="area_ctrl">
            <div class="area_roll">
                <div>
                    <div
                        top="0"
                        ref="province"
                         class="gear area_province"
                         data-areatype="area_province"
                         data-type="provs"
                         :data-len="(rowData && rowData.length) ? rowData.length : 0"
                         @touchstart="gearTouchStart"
                         @touchmove="gearTouchMove"
                         @touchend="gearTouchEnd">
                        <div
                            class="tooth"
                            v-for="(item,index) in rowData"
                            :key="index"
                            :class="{activeStyle : index == activeIndex}"
                        >{{item.text}}</div>
                    </div>
                    <div class="area_grid">
                        <div class="icon">
                        <i class=" left">
                            <img src="../../assets/img/icon_loupan_true.png">
                        </i>
                        <i class="right">
                            <img src="../../assets/img/icon_loupan_true.png">
                        </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            defaultData: {
                type: Array,
                default() {
                    return [];
                },
            },
            selectData: {
                type: Object,
                default: {},
            },
        },
        data() {
            return {
                rowData: {},
                selects: {},
                noData: false,
                activeIndex: 0,
            };
        },
        methods: {
            gearTouchStart(e) {
                e.preventDefault();
                let target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                clearInterval(target[`int_${target.id}`]);
                target[`old_${target.id}`] = e.targetTouches[0].screenY;
                target[`o_t_${target.id}`] = (new Date()).getTime();
                const top = target.getAttribute('top');
                if (top) {
                    target[`o_d_${target.id}`] = parseFloat(top.replace(/em/g, ''));
                } else {
                    target[`o_d_${target.id}`] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '2ms';
            },
            // 手指移动
            gearTouchMove(e) {
                e.preventDefault();
                let target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                target[`new_${target.id}`] = e.targetTouches[0].screenY;
                target[`n_t_${target.id}`] = (new Date()).getTime();
                const f = (target[`new_${target.id}`] - target[`old_${target.id}`]) * 30 / window.innerHeight;
                target[`pos_${target.id}`] = target[`o_d_${target.id}`] + f;
                target.style['-webkit-transform'] = `translate3d(0,${target[`pos_${target.id}`]}em,0)`;
                target.setAttribute('top', `${target[`pos_${target.id}`]}em`);
                if (e.targetTouches[0].screenY < 1) {
                    this.gearTouchEnd(e);
                }
            },
            gearTouchEnd(e) {
                e.preventDefault();
                let target = e.target;
                while (true) {
                    if (!target.classList.contains('gear')) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                const flag = (target[`new_${target.id}`] - target[`old_${target.id}`]) / (target[`n_t_${target.id}`] - target[`o_t_${target.id}`]);
                if (Math.abs(flag) <= 0.2) {
                    target[`spd_${target.id}`] = (
                        flag < 0 ? -0.04 : 0.04);
                } else if (Math.abs(flag) <= 0.5) {
                    target[`spd_${target.id}`] = (
                        flag < 0 ? -0.08 : 0.08);
                } else {
                    target[`spd_${target.id}`] = flag / 2;
                }
                if (!target[`pos_${target.id}`]) {
                    target[`pos_${target.id}`] = 0;
                }
                this.rollGear(target);
            },
            rollGear(target) {
                const _this = this;
                let d = 0;
                let stopGear = false;

                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '2ms';
                    stopGear = true;
                }

                clearInterval(target[`int_${target.id}`]);
                target[`int_${target.id}`] = setInterval(() => {
                    let pos = target[`pos_${target.id}`];
                    const speed = target[`spd_${target.id}`] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {
                    } else {
                        const b = Math.round(pos / 2) * 2;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    const minTop = -(target.dataset.len - 1) * 2;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        const gearVal = Math.abs(pos) / 2 || 0;
                        _this.setGear(target, gearVal);
                        // 提交数据给父组件,如果组件是初始状态,提交默认数据
                        if (!this.selects) {
                            this.$emit('getSelectData', JSON.parse(JSON.stringify(this.defaultData)));
                        } else {
                            this.$emit('getSelectData', JSON.parse(JSON.stringify(this.selects)));
                        }
                        clearInterval(target[`int_${target.id}`]);
                        this.activeIndex = gearVal;
                    }
                    target[`pos_${target.id}`] = pos;
                    target.style['-webkit-transform'] = `translate3d(0,${pos}em,0)`;
                    target.setAttribute('top', `${pos}em`);
                    d++;
                }, 30);
            },
            setGear(target, val) {
                const endVal = Math.round(val);
                const type = target.getAttribute('data-type');
                this.selects = this.rowData[endVal];
            },
            init() {
                this.rowData = this.selectData.data1 || [];
                this.selects = this.rowData[0];
            },
        },
        mounted() {
            this.init();
        },
        watch: {
            selectData: {
                handler() {
                    this.init();
                },
                deep: true,
            },
        },
    };
</script>

<style scoped lang="scss">
    @import "../../assets/scss/mixin.scss";
    #picker {
        position: absolute;
        top: 28%;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 24%;
        z-index: 1;
    }
    .area_ctrl {
        font-size: 12px;
        vertical-align: middle;
        margin: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        color:rgb(160, 170, 198);
    }

    .area_roll {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        height: tv(79);
        overflow: hidden;
        -webkit-mask: -webkit-linear-gradient(top,rgba(36, 142, 36, .2) 10%, rgba(255,255,255,1) 60%, rgba(36, 142, 36, .2));
        @media only screen
        and (device-width : 375px)
        and (device-height : 812px)
        and (-webkit-device-pixel-ratio : 3) {
            height: tv(92);
        }
    }

    .area_roll > div {
        font-size: 1.4em;
        height: 100%;
        float: left;
        background-color: transparent;
        position: relative;
        overflow: hidden;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        @media only screen
                and (device-width : 375px)
                and (device-height : 812px)
                and (-webkit-device-pixel-ratio : 3) {
                    height: .9rem;
            margin-top: tr(-18);
        }
    }

    .area_roll > div .gear {
        width: 100%;
        float: left;
        position: absolute;
        z-index: 1;
        top:3.3em;
    }

    .area_roll_mask {
        background: linear-gradient(to bottom,hotpink, darkblue);
        -webkit-mask: -webkit-gradient(linear,0% 40%, 0% 0%, from(rgba(255,255,255,0.7)), to(rgba(36, 142, 36, .3)));
        padding: 0
    }

    .area_grid {
        position: relative;
        top: 3.3em;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2em;
        margin: 0;
        box-sizing: border-box;
    }

    .tooth {
        height: 2em;
        line-height: 2em;
        text-align: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        line-clamp: 1;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow: hidden;
        z-index:1;
    }

    .activeStyle {
        color: rgb(193,93,19);
        transform: scale(1.4, 1.4);
        opacity: 1;
    }

    .icon {
        display: inline-flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        vertical-align:middle;
        line-height: .3rem;
        img {
            height: .12rem;
            width: .12rem;
        }
    }
    .left {
        flex: 0 0 3%;
    }
    .right {
        flex: 0 0 3%;
        img {
            transform:rotate(180deg);
        }
    }

</style>
