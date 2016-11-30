define(['prototype', 'utils', 'Player'], function(proto, utils, Player) {
    //require('prototype'); // Ensure Prototype is present

    return Class.create({
        arr: [],
        playing: [],
        getPlayers: function () {
            var a = [];
            this.arr.each(function (e, i) {
                a.push(e.getJSON());
            });
            return a;
        },
        getPlaying: function () {
            var a = [];
            this.playing.each(function(e, i) {
                a.push(e.getJSON());
            });
            return a;
        },
        clear: function () {
            this.currentPlaying.$box.remove();
            this.playing.each(function (e, i) {
                e.$box.remove();
            });
            this.playing = [];
            this.currentPlaying = false;
        },
        currentPlaying: false,
        willPlay: function (player) {
            var newArr = [player];
            for (var i = 0; i < this.playing.length; i++) {
                newArr.push(this.playing[i]);
            }
            this.playing = newArr;
        },
        getLast: function () {
            return this.playing.length > 0 ? this.playing[this.playing.length - 1] : false;
        },
        next: function (gameStarted) {
            //if(this.playing.length == 0) this.playing = this.arr;
            //this.playing[this.playing.length - 1].startTimer();
            var ans = this.playing.length > 0 ? this.playing.pop() : false;
            this.currentPlaying = ans;
            //console.log(ans);
            return ans;
        },
        initialize: function (o) {

        }
    });
});
