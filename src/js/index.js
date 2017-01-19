import config from './config';
import Game from './objects/Game';

var app = {
    initialize: function() {
        this.bindEvents();
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
