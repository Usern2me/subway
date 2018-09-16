<template>
    <div id="carousel-container">
        <div class="carousel">
            <ul class="carousel-scroller" id="carousel-scroller">
                <li v-for="(item, index) in ruleData">
                    <div class="item" :style="{width: itemWidth + 'px'}" @click="handleClick(index)">
                        <div class="text" :class="{normalSize: index!=activeIndex}">{{item}}</div>
                        <div class="item-after" :class="{activeBar: index==activeIndex}" :style="{right: itemWidth/2 + 'px'}"></div>
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
			itemWidth: 40,       // 每个单位的宽度
			itemCenter: 0,          // 当前item的中点
			resetDelay: 100,        // 重置到中点的延迟时间
			delayDuration: 500,     // 重置到中点动画时间
			maxScale: 500,
			scale: 2.5,               // 中点放大量
			isTouch: false,
			timer: null,
			ruleData: [],
			initOffset: 30,
		};
	},
	created() {
		for (let i = 1; i <= this.maxScale; i++) {
			this.ruleData.push(i);
		}
	},
	mounted() {
		const self = this;
		this.centerPoint = parseInt(getComputedStyle(document.querySelector('.carousel')).width) / 2;
		this.containerWidth = parseInt(getComputedStyle(document.getElementById('carousel-container')).width);

		const scroller = document.querySelector('#carousel-scroller');
		Transform(scroller);

		this.instance = new AlloyTouch({
			touch: '#carousel-container', // 反馈触摸的dom
			vertical: false, // 不必需，默认是true代表监听竖直方向touch
			target: scroller, // 运动的对象
			property: 'translateX',  // 被运动的属性
			friction: 3,
			min: (-this.itemWidth * this.ruleData.length) + this.containerWidth * 0.5,
			max: this.containerWidth * 0.5, // 不必需,滚动属性的最大值。刻度尺左侧距离。
			touchStart: () => {
				clearTimeout(this.timer);
                // 添加一个标记，用于区分是手动动画还是自动动画
				this.isTouch = true;
			},
			change: this.change,
			animationEnd: this.scrollEnd,
		});
		window.alloyInstance = this.instance;

		this.instance.to(this.containerWidth / 2 - this.itemWidth * (this.initOffset - 0.5));
	},
	methods: {
		change(val) {
            // 正在中间的index
			this.activeIndex = parseInt((val - this.centerPoint) / this.itemWidth) * -1;
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
				target.style.transform = `scale(${scale}, ${scale})` + ` translate(0, ${scale * -5}px)`;
			}

			this.activeValue = this.ruleData[this.activeIndex];
		},
		scrollEnd() {
			if (!this.isTouch) return;

			this.isTouch = false;
			this.timer = setTimeout(() => {
				this.instance.to(this.centerPoint - this.itemCenter, this.delayDuration);
				this.$emit('selectId', this.ruleData[this.activeIndex], this.activeIndex);
			}, this.resetDelay);
		},
		handleClick(index) {
			this.instance.to(
			    this.itemWidth * (index + 0.5) * -1 +
                    this.containerWidth / 2, this.delayDuration);
		},
	},
	beforeDestroy() {
		window.alloyInstance = null;
	},
};
</script>

<style lang="scss" scoped>
#carousel-container{
    overflow: hidden;
    border-bottom: 2px solid rgb(160, 170, 198);
    color:rgb(193,93,19);

    .normalSize{
        transform: scale(1, 1)!important;
        color:rgb(160, 170, 198);
    }

    .wrapper{
        width: 100%;
        position: relative;
    }
    ul::after{
        content: '';
        clear: both;
    }
    li{
        display: inline-block;
        text-decoration: none;
        list-style: none;
        
    }
    .item{
        position: relative;
        font-size: .12rem;
        height: 1rem;
        text-align: center;

        box-sizing: border-box;

        .text{
            margin-top: .45rem;
        }
    }
    .item-after{
        content: '';
        position: absolute;
        bottom: 0;
        display: block;
        height: .75rem;;
        width: 2px;
        background-color: rgb(160, 170, 198);
    }
    .activeBar{
        transform: scale(1, 1.4);
        background-color:rgb(193,93,19);
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
            white-space:nowrap;
        }
</style>
