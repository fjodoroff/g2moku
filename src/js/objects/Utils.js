import config from '../config';

class Bounds {
    constructor(top, right, bottom, left){
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}
class DeepDiffMapper {
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
