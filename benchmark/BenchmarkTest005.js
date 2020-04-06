//category: test-number: vulnerability:true cwe:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const shell = require('shelljs');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(req, res){
        let param = req.body.name_field;
        let x = param + " executed";
        try {
          shell.exec(param);
        } catch (e) {
          x = param + " was used"
        }
        res.send(x)
});

app.listen(process.env.port || 8080);
console.log('Running on port 8080');


//not done, need to figure out if that's how this example is actually used
