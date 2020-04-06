//category: test-number: vulnerability:true cwe: cve:none
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
var sql = require('mysql');

var con = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydb',
        multipleStatements: true
});
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', function(req, res){
        let param = req.body.name_field;
        let x = param + " executed";
        try {
          x = con.query(param);
        } catch (e) {
          x = param + " was used"
        }
        res.send(x)
});

app.listen(process.env.port || 8080);
console.log('Running on port 8080');
