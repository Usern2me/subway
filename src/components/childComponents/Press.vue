<template>
    <div class="press-container">
        <div class="wrapper" :class="{isPress: isPress}" @touchstart="start" @touchend="end">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isPress: false,
        }
    },
    methods: {
        start() {
            this.isPress = true;
        },
        end() {
            this.isPress = false;
        }
    }
}
</script>

<style lang="scss">
.press-container{

}
.wrapper{
    width: 100%;
    height: 100%;
    transition: transform 0.2s ease-in-out;
    transform-origin: center;
}
.wrapper>*{
    width: 100%;
    height: 100%;
}
.isPress{
    transform: scale(1.2, 1.2);
}

</style>


