//category: test-number: vulnerability:true cwe: cve:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const ps = require('ps');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(req, res){
        let param = req.body.name_field;
        let x = param + " executed";
        try {
          //-p 123 -o com pid
          ps(param, (err, result) => {
            //
          });
          x = param + " used"
        } catch (e) {
          x = param + " was used"
        }
        res.send(x)
});

app.listen(process.env.port || 8080);
console.log('Running on port 8080');
