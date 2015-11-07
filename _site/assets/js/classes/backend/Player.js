define(['AbstractPlayer', 'prototype'], function(AbstractPlayer, proto){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractPlayer(), {
		
	});
	return p;
});