define(['AbstractGame', 'prototype'], function(AbstractGame, proto) {
    var p = Class.create();
    // inherit from Person class:
    p.prototype = Object.extend(new AbstractGame(), {
        getStatusHTML: function(){
            var cl = "bg-warning",
                status = this.getStatus();
            if(status.code == "1") cl = "bg-success";
            return '<td class="' + cl + '">' + status.msg + '</td>';
        },
        toTableHTML: function(){
            return '<tr class="realtime-stats-game realtime-stats-game-gameID-' + this.getFormatedGameID() + '" data-gameID="' + this.gameID + '">' +
                '<th scope="row">' + this.getFormatedGameID() + '</th>' +
                '<td>' + this.players[0].name + '</td>' +
                '<td>' + this.players[1].name + '</td>' +
                '<td>' + this.gameMode + '</td>' + this.getStatusHTML() +
                '<td>' + (this.getMovingPlayer() ? this.getMovingPlayer().name : "-") + '</td>' +
            '</tr>';
        }
    });
    return p;
});
