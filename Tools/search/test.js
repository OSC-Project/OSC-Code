//var x = require('./node_modules/prototype/lib/String');
// var x = require('prototype');
// try {
//   x.evalScripts(console.log("Hello"));
// } catch (e) {}
// input = console.log('World');//could be from a web page
// try {
//   x.evalJSON(input);
// } catch (e) {}
//
// //var y = require('./node_modules/jade');
// var y = require('jade');
// try {
//   y.toConstant(console.log('Hello From Jade Also'));
// } catch (e) {}


var z = require('backbone');
try {
  z.addMethod.prototype.payload = 'console.log("Hello")';
  z.addMethod(this, 1, /*'eval'*/'eval', 'payload');
} catch (e) {
  console.log(e);
}
