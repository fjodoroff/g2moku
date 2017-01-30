import config from '../config';

/**
 * Log to console if not in production.
 * @param {...*} var_args
 * @param {string} [type=log] console type
 */
window.debugLog = function debugLog(var_args, type = 'log') {
    if (window.ENV !== 'prod') {
        Array.prototype.reverse.apply(arguments);
        console[type].apply(console, arguments);
    }
};

window.debugInfo = function debugLog(var_args) {
    let args = arguments;
    if(args.length == 1) args = args[0];
    return window.debugLog(args, 'info');
};

export class Bounds {
    constructor(top, right, bottom, left){
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}
export class DeepDiffMapper {
    constructor(){
        this.VALUE_CREATED = 'created';
        this.VALUE_UPDATED = 'updated';
        this.VALUE_DELETED = 'deleted'; 
        this.VALUE_UNCHANGED = 'unchanged';
    }
    map(obj1, obj2) {
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
            throw 'Invalid argument. Function given, object expected.';
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
            return {type: this.compareValues(obj1, obj2), data: obj1 || obj2};
        }

        var diff = {};
        for (var key in obj1) {
            if (this.isFunction(obj1[key])) {
                continue;
            }

            var value2 = undefined;
            if ('undefined' != typeof(obj2[key])) {
                value2 = obj2[key];
            }

            diff[key] = this.map(obj1[key], value2);
        }
        for (var key in obj2) {
            if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
                continue;
            }

            diff[key] = this.map(undefined, obj2[key]);
        }

        return diff;

    }
    compareValues(value1, value2) {
        if (value1 === value2) {
            return this.VALUE_UNCHANGED;
        }
        if ('undefined' == typeof(value1)) {
            return this.VALUE_CREATED;
        }
        if ('undefined' == typeof(value2)) {
            return this.VALUE_DELETED;
        }

        return this.VALUE_UPDATED;
    }
    isFunction(obj) {
        return {}.toString.apply(obj) === '[object Function]';
    }
    isArray(obj) {
        return {}.toString.apply(obj) === '[object Array]';
    }
    isObject(obj) {
        return {}.toString.apply(obj) === '[object Object]';
    }
    isValue(obj) {
        return !this.isObject(obj) && !this.isArray(obj);
    }
}

export default {
    isIOS() {
        return (/(iPhone|iPad|iPod)/gi).test(navigator.platform);
    },
    isAndroid() {
        return (/Android/gi).test(navigator.userAgent);
    },
    isSafari() {
        var userAgent = navigator.userAgent;
        return (/Safari/gi).test(userAgent) &&
            !(/Chrome/gi).test(userAgent);
    },
    isIE() {
        var userAgent = navigator.userAgent;
        return (/Trident/gi).test(userAgent);
    },
    isEdge() {
        return /Edge/i.test(navigator.userAgent);
    },
    isFF() {
        var userAgent = navigator.userAgent;
        return (/Firefox/gi).test(userAgent);
    },
    isTouchScreen() {
        return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    },

    /**
     * Returns the static base URL of the running app.
     * file://app/game/12345 -> file://app/game/123456/
     */
    getStaticBaseURL() {
        var url = location.href.replace(location.hash, '');
        return url.substring(0, url.lastIndexOf('/') + 1);
    },

    /**
     * Reports an error to Google Analytics.
     * Normally, this is done in the window.onerror handler, but this helper method can be used in the
     * catch() of a promise to log rejections.
     * @param {Error|string} error The error to report.
     */
    reportError(error) {
        // Google Analytics has a max size of 500 bytes for the event location field.
        // If we have an error with a stack trace, the trailing 500 bytes are likely to be the most
        // relevant, so grab those.
        var location = (error && typeof error.stack === 'string') ?
            error.stack.slice(-500) : 'Unknown Location';
        Analytics.trackError(location, error);
    },

    isObject(val) {
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
    },

    isHTML(obj) {
        return this.isObject(obj) ? false : /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(obj);
    },

    isArray(obj) {
        return {}.toString.apply(obj) === '[object Array]';
    },

    getFormatedGameID(gameID){
        if(gameID.lastIndexOf('.') != -1) {
            const ans = gameID.substring(0, gameID.lastIndexOf('.'));
            return gameID ? (ans || ans == '') : false;
        } else return false;
    },
    adjustX(displayObject){
        displayObject.x += -displayObject.width/2;
    },

    adjustY(displayObject){
        displayObject.y += -displayObject.height/2;
    },

    adjustXY(displayObject){
        this.adjustX(displayObject);
        this.adjustY(displayObject);
    },

    moveCentered(displayObject, x, y){
        displayObject.reset(x, y);
        this.adjustCenter(displayObject);

        return displayObject;
    },

    screenBounds(){
        let scr = config.screen;

        return new Bounds(0,
                          scr.width,
                          scr.height,
                          0);
    },

    gameBounds(){
        let scr = config.screen;
        let left = scr.offsetX;
        let top = scr.offsetY;

        return new Bounds(top,
                          left+scr.gameWidth,
                          top+scr.gameHeight,
                          left);
    },

    gamePaddedBounds(padding = config.screen.padding){
        let bounds = this.gameBounds();

        return new Bounds(bounds.top + padding,
                          bounds.right - padding,
                          bounds.bottom - padding,
                          bounds.left + padding);
    },

    dialogBoxBounds(){
        let scr = config.screen;
        return new Bounds((2/3)*scr.height,
                          scr.width,
                          scr.height,
                          0);
    },

    screenMiddle(){
        return new Phaser.Point(
            config.screen.offsetX + config.screen.gameWidth/2,
            config.screen.offsetY + config.screen.gameHeight/2
        );
    },

    scaleTo(displayObj, percentage, byWidth = false){
        let x, y, scaleFactor;

        if(byWidth){
            x = displayObj.width;
            y = config.screen.gameWidth;
        } else {
            x = displayObj.height;
            y = config.screen.gameHeight;
        }

        scaleFactor = (percentage * y)/x;
        displayObj.scale.setTo(scaleFactor);

        return scaleFactor;
    },

    scaleMultipleTo(displayObjs, percentage){
        displayObjs.forEach((displayObj)=>{
            this.scaleTo(displayObj, percentage);
        }, this);
    },

    // performs a relative move taking into account adjusted game dimensions
    moveX(displayObj, percentage){
        displayObj.x = percentage * config.screen.gameWidth + config.screen.offsetX;
    },

    // performs a relative move taking into account adjusted game dimensions
    moveY(displayObj, percentage){
        displayObj.y = percentage * config.screen.gameHeight + config.screen.offsetY;
    },

    effectiveWidth(displayObj, scale){
        scale = scale || displayObj.scale.x;
        return displayObj.width/scale;
    },

    effectiveHeight(displayObj, scale){
        scale = scale || displayObj.scale.y;
        return displayObj.height/scale;
    },

    //todo: bad method,
    makeRange(length){
        let out = [];
        let i = -1;

        for(; ++i < length;){
            out.push(i);
        }

        return out;
    }
};
