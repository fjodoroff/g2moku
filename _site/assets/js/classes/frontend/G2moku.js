define(['AbstractG2moku', 'prototype'], function(AbstractG2moku, proto){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractG2moku(), {
		
	});
	return p;
});