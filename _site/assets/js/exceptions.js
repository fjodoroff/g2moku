//if(!g2moku) var g2moku;
g2moku.exceptions = {};
g2moku.exceptions.ExceptionWithAlert = Class.create();
g2moku.exceptions.ExceptionWithAlert.prototype = {
	alertClasses: ['alert'],
	$alert: null,
	animationShow: 'bounceIn',
	animationHide: 'bounceOut',
	alertClasses: ['alert', 'alert-danger', 'alert-dismissible'],
	initialize: function(msg) {
		this.message = msg;		
	},
	insertAlert: function($parentElement){
		var $el = jQuery('<div class="' + this.alertClasses.concat([this.animationShow, 'animated']).join(' ') + '" role="alert">' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + 
			'<span aria-hidden="true">×</span>' + '</button>' + this.message + '</div>');
		this.$alert = $el;
		$parentElement.append($el);
	},
	hideAlert: function() {
		this.$alert.removeClass(this.animationShow + ' animated').addClass(this.animationHide + ' animated');
	}
};
g2moku.exceptions.GameFormException = Class.create();
// inherit from Person class:
g2moku.exceptions.GameFormException.prototype = Object.extend(new g2moku.exceptions.ExceptionWithAlert(), {
	// redefine the speak method
	initialize: function(msg, element) {
		this.message = msg;
		this.element = element;
	}	
});


function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
// g2moku.GameFormException = function(msg, element) {
	// this.message = msg;
	// this.element = element;
// };
function Timer(interval, callback) {
	this.count = 0;
	this.callback = callback;
	this.interval = interval;
	this.startTimestamp = 0;
	t = this;
	this.clear = function() {
		clearInterval(this.id);
	};
	this.initialize();
	return this;
}
Timer.prototype = {
	initialize: function() {
		this.startTimestamp = +new Date();
		this.id = setInterval(function(){
			t.count++;
			t.callback(t);
		}, this.interval);
	}
};
var PlayerBot = Class.create();
// inherit from Person class:
PlayerBot.prototype = Object.extend(new Player(), {
	// redefine the speak method
	say: function(message) {
		return this.name + ': ' + message + ', yarr!';
	}
}); 