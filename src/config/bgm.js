import { isWeixinBrowser } from './util';
export default {
    bgm: () => {
        if(!window.gameBgm) {
            window.gameBgm = new Audio();
            gameBgm.loop = true;
            
            if(isWeixinBrowser) {
                gameBgm.addEventListener('canplaythrough', () => {
                    gameBgm.play();
                    // gameBgm.pause();
                }, false);
                document.addEventListener('WeixinJSBridgeReady', () => {
                    gameBgm.play();
                    // gameBgm.pause();
                }, false);
            }

            
            gameBgm.src = require('@/assets/audio/bgm.mp3');
        }

        return window.gameBgm;
    },
    printer: () => {
        if(!window.printerBgm) {
            window.printerBgm = new Audio();

            printerBgm.addEventListener('canplaythrough', () => {
                printerBgm.play();
                printerBgm.pause();
            }, false);
            document.addEventListener('WeixinJSBridgeReady', () => {
                printerBgm.play();
                printerBgm.pause();
            }, false);
            printerBgm.src = require('@/assets/audio/printer.mp3');
        }

        return window.printerBgm;
    }
}