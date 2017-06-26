var mysql = require('mysql');

module.exports = {
    
    connection : function(){
        return mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		port     : '/Applications/MAMP/tmp/mysql/mysql.sock',
		database : 'testdress'
	    })
    },
    
    query : function(q, cb){ // q ( argument = requete SQL ' select * from - cb = callback function ==> query(SQL,f(rows){  ---   });
        var _c = this.connection();
        
            _c.connect();
            _c.query(q, function(err, rows, fields) {
                if (err) return console.error(err);
                cb(rows);
            });
            _c.end();
    }
}


