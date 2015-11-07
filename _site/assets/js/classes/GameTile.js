define(['prototype', 'utils'], function(proto, utils){
    return Class.create({
		selected: false,
		$player: null,
		index: 0,
		key: null,
		//classes: ,
		imgPath: '',
		$element: null,
		initialize: function(key, o) {
			this.key = key;
			this.classes = ['btn', 'btn-default', 'square-btn', 'btn-player-tile'];
			if(utils.isObject(o)) {
				this.index = o.index;
				if(o.imgPath) this.imgPath = o.imgPath;
			} else {
				this.imgPath = o;
			}
		},
		setPlayer: function($player){
			if(!this.selected) {
				this.selected = true;
				this.$player = $player;
			}
		},
		removeClass: function(cl){
			this.cl = '';
		},
		setClass: function(cl){
			this.cl = cl;
		},
		unsetPlayer: function(){
			this.$player = null;		
			this.selected = false;		
		},
		getHTML: function(){
			var btnHTML = '<button type="button" ' + ( this.index ? 'data-tile-index="' + this.index + '"' : '' ) + ' class="' + this.classes.join(' ') + " " + this.cl +'"><img src="' + this.imgPath + '"></button>'; 
			return btnHTML;
		}
	})
});