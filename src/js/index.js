import config from './config';
import Utils from './objects/Utils';
import Elements from './helpers/Elements';
import Router from './helpers/Router';

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
        let event = config.isCordova ? 'deviceready' : 'DOMContentLoaded';

        document.addEventListener(event, () => {
            this.deviceReady(() => {
                this.deviceSetup();
            });
            this.Router = new Router();
            this.Elements = new Elements();
            this.Elements.init();
            console.log('template', this.Elements);
            this.Router.init(this.Elements.Template);
            // Wait for critical.html to load if we don't have native HTML imports.
            // Can't use Polymer.RenderStatus.whenReady() b/c potentially, we have
            // to wait for the polyfills to load (above) and the critical.html to
            // load so Polymer is defined. Instead, wait for HTMLImportsLoaded if
            // we're in a polyfilled browser (but go right away if Imports are native).
            if (Utils.supportsHTMLImports) {
                this.afterCriticalImports();
            } else {
                document.addEventListener('HTMLImportsLoaded', this.afterCriticalImports);
            }
        }, false);

        document.addEventListener('MainScreenReady', function(e){
            debugInfo(e);
            //app.gameStart();
            //console.log(e);
            e.target.addEventListener('transitionend', function(){
                if(navigator.splashscreen) { //can call after device setup
                    navigator.splashscreen.hide();
                }
            });
        });
        document.addEventListener('MainScreenMenuChange', function(e){
            //app.gameStart();
            debugInfo(e);
        });
    }

    /**
     * Called after device is ready
     */
    deviceReady(callback = null) {
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
        'registerElement' in document &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template'));

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
        console.log(this);
    }

    afterCriticalImports() {
        Polymer.Base.importHref('/html/elements.html', function() {
            g2mokuApp.Elements.onElementsBundleLoaded();

            //removeSplashScreen();

            var fp = g2mokuApp.Util.getFPIfSupported();
            if (fp) {
                debugLog('first paint:', fp, 'ms');
                // g2mokuApp.Analytics.trackPerf(
                //     'load', 'firstpaint', fp, null, g2mokuApp.Analytics.FP_TIMEOUT_);
            }
        }, null, true);
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
    }

    // gameStart: function() {
    //     config.init();
    //     window.game = new Game();
    //     window.config = config;
    // }
}
var g2mokuApp = new G2mokuApp();
window.g2moku = window.g2moku || {};
window.g2moku.app = g2mokuApp;
