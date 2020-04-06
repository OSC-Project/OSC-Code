//category: test-number: vulnerability:true cwe: cve:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(req, res){
        let param = req.body.name_field;
        let x = param + " executed";
        try {
          var f = morgan( param + ':method :url :status :res[content-length] - :response-time ms');
          f({}, {}, function () {});
          x = param + " used"
        } catch (e) {
          x = param + " was used"
        }
        res.send(x)
});

app.listen(process.env.port || 8080);
console.log('Running on port 8080');
