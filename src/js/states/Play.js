import config from '../config';

export default class Play extends Phaser.State {
    constructor(){
        super();
    }

    init(){
    }

    preload(){
        this.map = {};
        this.layer = {};
    }

    create(){
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.add.tilemap('map', 32, 32);

        this.map.addTilesetImage('tiles');
        this.currentTile = this.map.getTile(0, 0);

        //this.map.setCollisionBetween(1, 12);

        this.layer = this.map.createLayer(0);

        this.layer.resizeWorld();

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 32, 32);

        this.sprites = this.add.group();
        //game.time.events.loop(1050, this.createSprite, this)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.game.input.addMoveCallback(this.updateMarker, this);
    }

    updateMarker() {
        this.marker.x = this.layer.getTileX(this.input.activePointer.worldX) * 32;
        this.marker.y = this.layer.getTileY(this.input.activePointer.worldY) * 32;
    }

    update(){
    }

    shutdown(){
    }
}
