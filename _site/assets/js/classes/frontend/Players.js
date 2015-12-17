define(['AbstractPlayers', 'prototype', 'Player'], function(AbstractPlayers, proto, Player){
    var p = Class.create();
    // inherit from Person class:
    p.prototype = Object.extend(new AbstractPlayers(), {
        parseFromGameModal: function (data) {
            var arr = [];
            //console.log('//parsefromgameModal each data');
            //console.log(data);
            data.each(function (e, i) {
                // console.log('//tile i');
                // console.log(i);
                // console.log('//tile e');
                // console.log(e);
                var player = new Player({
                    name: e.input,
                    tile: e.tile,
                    playingTileIndex: e.tileIndex
                });
                player.setPlayingTile(new Phaser.Tile(0, e.tileIndex));
                arr.push(player);
            });
            this.arr = arr;
            this.playing = arr;
            //this.arr = arr;
            return arr;
        }
    });
    return p;
});