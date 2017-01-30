import config from './config';
import Utils from './objects/Utils';

export default class G2mokuApp {

    /**
     * Constructor
     */
    constructor() {
        this.initialize();
        //debugInfo("");
    }

    /**
     * Initialize method
     */
    initialize() {
        this.bindEvents();
        window.Polymer = {
            dom: 'shadow',
            lazyRegister: true
        };
    }

    /**
     * Binding events
     */
    bindEvents() {
        if (config.isCordova) {//if cordova loaded
            document.addEventListener("deviceready", this.deviceReady, false);
        } else {
            document.addEventListener("DOMContentLoaded", this.deviceReady, false);
        }
        document.addEventListener('G2mokuAppReady', function(){
            //app.gameStart();
        });
        document.addEventListener('MainScreenMenuChange', function(e){
            //app.gameStart();
            debugInfo(e);
        });
    }

    /**
     * Called after device is ready
     */
    deviceReady() {
        console.log("cordova", config.device, window.cordova);
        var onload = function() {
            // For native Imports, manually fire WebComponentsReady so user code
            // can use the same code path for native and polyfill'd imports.
            if (!window.HTMLImports) {
                debugInfo('!window.HTMLImports');
                document.dispatchEvent(
                    new CustomEvent('WebComponentsReady', {bubbles: true})
                );
            } else {
                debugInfo('window.HTMLImports');
            }
            debugInfo('onload');
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
            debugInfo('!webComponentsSupported');
        } else {
            debugInfo('webComponentsSupported!');
            onload();
        }
        app.deviceSetup();
    }

    /**
     * Setting up device
     */
    deviceSetup(){
        //window.screen.lockOrientation('landscape');
        // if(StatusBar.isVisible) {
        //     StatusBar.hide();
        // }
        if(window.AndroidFullScreen) { //can call after device setup
            AndroidFullScreen.isSupported(function () {
                AndroidFullScreen.immersiveMode(function () {
                    debugInfo('entered into fullscreen');
                }, function () {
                    console.error(new Error('AndroidFullScreen immersiveMode'));
                });
            }, function () {
                console.error(new Error('AndroidFullScreen'));
            });
        }
        if(navigator.splashscreen) { //can call after device setup
            navigator.splashscreen.hide();
        }
    }

    // gameStart: function() {
    //     config.init();
    //     window.game = new Game();
    //     window.config = config;
    // }
}

window.g2mokuApp = new G2mokuApp();
