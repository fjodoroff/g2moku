import config from './config';

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
        document.addEventListener('G2mokuAppReady', function(){
            //app.gameStart();
        });
        document.addEventListener('MainScreenMenuChange', function(e){
            //app.gameStart();
            console.info(e);
        });
    },

    deviceReady: function() {
        console.log("cordova", config.device, window.cordova);
        var onload = function() {
            // For native Imports, manually fire WebComponentsReady so user code
            // can use the same code path for native and polyfill'd imports.
            if (!window.HTMLImports) {
                console.log('!window.HTMLImports');
                document.dispatchEvent(
                    new CustomEvent('WebComponentsReady', {bubbles: true})
                );
            } else {
                console.info('window.HTMLImports');
            }
            console.log('onload');
        };
        var webComponentsSupported = (
            'registerElement' in document
            && 'import' in document.createElement('link')
            && 'content' in document.createElement('template')
        );
        if(!webComponentsSupported) {
            var script = document.createElement('script');
            script.async = true;
            script.src = 'lib/webcomponentsjs/webcomponents-lite.min.js';
            script.onload = onload;
            document.getElementsByTagName("head")[0].appendChild(script);
            console.log('!webComponentsSupported');
        } else {
            console.info('webComponentsSupported!');
            onload();
        }
        app.deviceSetup();
    },

    deviceSetup: function(){
        //window.screen.lockOrientation('landscape');
        // if(StatusBar.isVisible) {
        //     StatusBar.hide();
        // }
        if(window.AndroidFullScreen) {
            AndroidFullScreen.isSupported(function () {
                AndroidFullScreen.immersiveMode(function () {
                    console.log('entered into fullscreen');
                }, function () {
                    console.error(new Error('AndroidFullScreen immersiveMode'));
                });
            }, function () {
                console.error(new Error('AndroidFullScreen'));
            });
        }
        if(navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
    },

    // gameStart: function() {
    //     config.init();
    //     window.game = new Game();
    //     window.config = config;
    // }
};

app.initialize();
