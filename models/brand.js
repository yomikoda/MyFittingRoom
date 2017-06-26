var bcrypt = require('bcrypt-nodejs');


module.exports = function (app, data) {
    var mysql = app.drivers.mysql;

    this.table = 'brands';
    this.id = data.id || null;
    this.name = data.name || null;
    this.email = data.email || null;
    this.password = data.password || null;
    this.description = data.description || null;
    this.phone = data.phone || null;
    this.lastconnection = new Date().toISOString() || null;



    this.read = function (cb) {
        var q = "SELECT id,name,email,description,phone FROM " + this.table + " WHERE id=" + this.id + " LIMIT 1";

        console.log(q)
        mysql.query(q, function (rows) {
            cb(rows[0]);
            console.log(rows);
        });
        // Don't forget to encode that ish
    }
    
    this.readall = function (cb) {
        var q = "SELECT id,name,email,description,phone FROM " + this.table + " LIMIT 1";

        mysql.query(q, function (rows) {
            cb(rows[0]);
            console.log(q);
        });
        // Don't forget to encode that ish
    }
    
    this.create = function (cb) {
        var me = this;
        me.password = bcrypt.hashSync(this.password);
        
        var q = "INSERT INTO " + this.table + " (name,email,password,description,phone,lastconnection) VALUES ( '" + this.name + "' , '" + this.email + "', '" + this.password + "','" + this.description + "','" + this.phone + "','" + this.lastconnection + "' )";

        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });
    }



    this.delete = function (cb) {
        var me = this,
            q = " DELETE from " + this.table + " where id='" + this.id + "'";

        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });

    }


    this.update = function (data, cb) {
        var set = []
        
        for(k in data){
            set.push(k + "='" + data[k] + "'")
        }

        var q = "UPDATE " + this.table + " SET " + set.join(',') + " WHERE id=" + data.id ;
        
        var me = this;
        console.log(q);
        
//        this.password = bcrypt.hashSync(data.password);
//        console.log(data.password);
//        console.log(this.password);
        mysql.query(q, function (rows) {
//            me.id = rows.insertId;
            cb(me);
        });
        
    }

    return this;

}