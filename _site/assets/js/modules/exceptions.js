define(['GameTile', 'prototype'], function(GameTile, proto) {
    var exceptions = (function(exps) {
		exps.ExceptionWithAlert = Class.create();
		exps.ExceptionWithAlert.prototype = {
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
		exps.GameFormException = Class.create();
		exps.GameFormException.prototype = Object.extend(new exps.ExceptionWithAlert(), {
			initialize: function(msg, element) {
				this.message = msg;
				this.element = element;
			}	
		});
		return exps;
	}(exceptions || {}));	
	return exceptions;
});