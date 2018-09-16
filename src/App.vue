<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import bgm from '@/config/bgm';
    import './config/rem';

    export default {
        created() {
            bgm.bgm();
            bgm.printer();
        },
    };

</script>

<style>
*{
    margin: 0;
    padding: 0;
}
@font-face {
    font-family: 'Yuanti';
    src: url('assets/font/YuanTi.ttf');
}
@font-face {
    font-family: 'YuantiR';
    src: url('assets/font/YuanTi_REG.ttf');
}
html, body{
    width: 100%;
    height: 100%;
    /* font-family: "Yuanti SC", "Microsoft Yahei", Tahoma, Arial, Roboto, "Droid Sans", "Helvetica Neue", "Droid Sans Fallback", "Heiti SC", "Hiragino Sans GB", Simsun, sans-serif; */
    font-family: 'Yuanti';
}
#app{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}

</style>
