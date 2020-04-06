var sql = require('mysql')
var con = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydb',
        multipleStatements: true
});
var qs = response;
var x = con.query(qs);
