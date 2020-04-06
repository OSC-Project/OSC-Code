var sql = require('mysql');
var express = require('express');
var child_process = require('child_process');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
app.use(bodyParser.urlencoded({extended: true}));

var name = "";
var con = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydb',
        multipleStatements: true
});

con.connect(function(err) {
        if(err) throw err;
        console.log("Connected!");

});

app.get('/', function(req,res){
        res.sendFile(path.join(__dirname+'/demofile1.html'));
});

app.post('/', function(req, res){
        name = req.body.name_field;
	//console.log(name);
	//cmd = "SELECT name, address FROM customers WHERE name = '' union select 1,table_schema from information_schema.tables union select 1,1";

	cmd = "SELECT name, address FROM customers WHERE name = '" + name +"'";
	console.log(req.body.name_field);
	con.query(cmd, function(err, result, fields){
		if (err) throw err;
		console.log(result);
		res.send(result);
	});
});

/*
cmd = "SELECT name, address FROM customers WHERE name = '' union select 1,table_schema from information_schema.tables union select 1,1";
con.query(cmd, function(err, result, fields){
	if (err) throw err;
        console.log(result);
                //res.send(result);
});
*/

app.listen(process.env.port || 8080);
console.log('Running on port 8080');


//con.end();
