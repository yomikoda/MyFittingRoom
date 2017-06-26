module.exports = function (app, data) {
    var mysql = app.drivers.mysql;

    this.table = 'orders';
    this.id = data.id || null;
    this.user = data.user;
    this.product = data.product || null;
    this.store = data.store || null;
    this.date = data.date || null;
    



    this.read = function (cb) {
        var q = "SELECT * FROM " + this.table;

        mysql.query(q, function (rows) {
            cb(rows);
            console.log(q);
        });

    }

    this.create = function (cb) {
        var me = this;

        var q = "INSERT INTO " + this.table + " (user,product,store,date) VALUES ( '" + this.user + "' , '" + this.product+ "', '" + this.store + "','" + this.date + "' )";

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
        
        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });
        
    }

    return this;

}