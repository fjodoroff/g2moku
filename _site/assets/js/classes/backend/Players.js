define(['AbstractPlayers', 'prototype', 'Player'], function(AbstractPlayers, proto, Player){
    var p = Class.create();
    // inherit from Person class:
    p.prototype = Object.extend(new AbstractPlayers(), {
        createPlayers: function(data, callback){
            var arr = [];
            //console.log('//parsefromgameModal each data');
            //console.log(data);
            var pls = this;
            data.each(function(e, i){
                // console.log('//tile i');
                // console.log(i);
                // console.log('//tile e');
                // console.log(e);
                var player = new Player({
                    name: e.name,
                    tile: e.tile,
                    playingTile: e.playingTile
                });
                player.create(function(player){
                    arr.push(player);
                    if(i == data.length - 1){
                        pls.arr = arr;
                        pls.playing = arr;
                        callback(arr);
                    }//last
                });
                //player.setPlayingTile(new Phaser.Tile(g.layer, e.tileIndex));
                //arr.push(player);
            });
            //this.arr = arr;
            return arr;
        }
    });
    return p;
});