
var __cov_aPXmlxhOeWFUUonw3YgF9w = (Function('return this'))();
if (!__cov_aPXmlxhOeWFUUonw3YgF9w.__coverage__) { __cov_aPXmlxhOeWFUUonw3YgF9w.__coverage__ = {}; }
__cov_aPXmlxhOeWFUUonw3YgF9w = __cov_aPXmlxhOeWFUUonw3YgF9w.__coverage__;
if (!(__cov_aPXmlxhOeWFUUonw3YgF9w['app\\main.js'])) {
   __cov_aPXmlxhOeWFUUonw3YgF9w['app\\main.js'] = {"path":"app\\main.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0},"b":{"1":[0,0]},"f":{"1":0},"fnMap":{"1":{"name":"(anonymous_1)","line":49,"loc":{"start":{"line":49,"column":17},"end":{"line":49,"column":27}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":1,"column":33}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":27}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":40}},"4":{"start":{"line":5,"column":0},"end":{"line":5,"column":44}},"5":{"start":{"line":8,"column":0},"end":{"line":8,"column":39}},"6":{"start":{"line":19,"column":0},"end":{"line":19,"column":33}},"7":{"start":{"line":20,"column":0},"end":{"line":20,"column":50}},"8":{"start":{"line":23,"column":0},"end":{"line":23,"column":30}},"9":{"start":{"line":24,"column":0},"end":{"line":24,"column":48}},"10":{"start":{"line":25,"column":0},"end":{"line":25,"column":22}},"11":{"start":{"line":27,"column":0},"end":{"line":27,"column":78}},"12":{"start":{"line":30,"column":0},"end":{"line":30,"column":32}},"13":{"start":{"line":31,"column":0},"end":{"line":31,"column":59}},"14":{"start":{"line":32,"column":0},"end":{"line":32,"column":27}},"15":{"start":{"line":33,"column":0},"end":{"line":33,"column":33}},"16":{"start":{"line":44,"column":0},"end":{"line":44,"column":29}},"17":{"start":{"line":49,"column":0},"end":{"line":51,"column":3}},"18":{"start":{"line":50,"column":1},"end":{"line":50,"column":55}}},"branchMap":{"1":{"line":20,"type":"binary-expr","locations":[{"start":{"line":20,"column":25},"end":{"line":20,"column":41}},{"start":{"line":20,"column":45},"end":{"line":20,"column":49}}]}}};
}
__cov_aPXmlxhOeWFUUonw3YgF9w = __cov_aPXmlxhOeWFUUonw3YgF9w['app\\main.js'];
__cov_aPXmlxhOeWFUUonw3YgF9w.s['1']++;var express=require('express');__cov_aPXmlxhOeWFUUonw3YgF9w.s['2']++;var path=require('path');__cov_aPXmlxhOeWFUUonw3YgF9w.s['3']++;var bodyParser=require('body-parser');__cov_aPXmlxhOeWFUUonw3YgF9w.s['4']++;var cookieParser=require('cookie-parser');__cov_aPXmlxhOeWFUUonw3YgF9w.s['5']++;var favicon=require('serve-favicon');__cov_aPXmlxhOeWFUUonw3YgF9w.s['6']++;var app=global.app=express();__cov_aPXmlxhOeWFUUonw3YgF9w.s['7']++;var port=global.port=(__cov_aPXmlxhOeWFUUonw3YgF9w.b['1'][0]++,process.env.PORT)||(__cov_aPXmlxhOeWFUUonw3YgF9w.b['1'][1]++,1337);__cov_aPXmlxhOeWFUUonw3YgF9w.s['8']++;app.set('view engine','ejs');__cov_aPXmlxhOeWFUUonw3YgF9w.s['9']++;app.set('views',path.join(__dirname,'views'));__cov_aPXmlxhOeWFUUonw3YgF9w.s['10']++;app.set('PORT',port);__cov_aPXmlxhOeWFUUonw3YgF9w.s['11']++;app.use('/coverage',express.static(__dirname+'/../test/coverage/reports'));__cov_aPXmlxhOeWFUUonw3YgF9w.s['12']++;app.use(cookieParser('secret'));__cov_aPXmlxhOeWFUUonw3YgF9w.s['13']++;app.use(express.static(path.join(__dirname,'/../_site')));__cov_aPXmlxhOeWFUUonw3YgF9w.s['14']++;app.use(bodyParser.json());__cov_aPXmlxhOeWFUUonw3YgF9w.s['15']++;app.use(bodyParser.urlencoded());__cov_aPXmlxhOeWFUUonw3YgF9w.s['16']++;app.use(require('./routes'));__cov_aPXmlxhOeWFUUonw3YgF9w.s['17']++;app.listen(port,function(){__cov_aPXmlxhOeWFUUonw3YgF9w.f['1']++;__cov_aPXmlxhOeWFUUonw3YgF9w.s['18']++;console.log('Server running on port '+port+'...');});