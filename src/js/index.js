import config from './config';
import Game from './objects/Game';

var app = {
    initialize: function() {
        this.bindEvents();
        window.Polymer = {
            dom: 'shadow',
            lazyRegister: true
        };
    },

    bindEvents: function() {
        if (config.isCordova) {
            document.addEventListener("deviceready", this.deviceReady, false);
        } else {
            document.addEventListener("DOMContentLoaded", this.deviceReady, false);
        }
    },

    deviceReady: function() { 
        console.log("cordova", config.device, window.cordova);
        // var onload = function() {
        //     // For native Imports, manually fire WebComponentsReady so user code
        //     // can use the same code path for native and polyfill'd imports.
        //     if (!window.HTMLImports) {
        //         alert('loaded!window.HTMLImports');
        //         document.dispatchEvent(
        //             new CustomEvent('WebComponentsReady', {bubbles: true})
        //         );
        //     }
        //     alert('onload');
        // };
        // var webComponentsSupported = (
        //     'registerElement' in document
        //     && 'import' in document.createElement('link')
        //     && 'content' in document.createElement('template')
        // );
        // if(!webComponentsSupported) {
        //     var script = document.createElement('script');
        //     script.async = true;
        //     script.src = '/lib/webcomponentsjs/webcomponents-lite.min.js';
        //     script.onload = onload;
        //     document.head.appendChild(script);
        // } else {
        //     onload();
        // }
        app.deviceSetup();
        app.gameStart();
    },

    deviceSetup: function(){
        //window.screen.lockOrientation('landscape');
    },

    gameStart: function() {
        config.init();
        window.game = new Game();
        window.config = config;
    }
};

app.initialize();
