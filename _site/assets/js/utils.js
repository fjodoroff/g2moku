define([], function(){
	var utils = function(u){
		u.isObject = function(val) {
			if (val === null) { return false;}
			return ( (typeof val === 'function') || (typeof val === 'object') );
		};
		u.isHTML = function(obj) {
		  return isObject(obj) ? false : /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(obj);
		};
		return u;
	}(utils || {});
	return utils;
});