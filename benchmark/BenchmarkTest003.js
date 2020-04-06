//category: test-number: vulnerability:true cwe:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
var child_process = require('child_process');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(req, res){
        let param = req.body.name_field;
        let x = param + " executed";
        try {
          child_process.exec(
            'ls ' + param,
            function (err, data) {
              console.log('err: ', err)
              console.log('data: ', data);
            });
        } catch (e) {
          x = param + " was used"
        }
        res.send(x)
});

app.listen(process.env.port || 8080);
console.log('Running on port 8080');
