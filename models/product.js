module.exports = function (app, data) {
    var mysql = app.drivers.mysql;

    this.table = 'products';
    this.id = data.id || null;
    this.brand = data.brand;
    this.photo = data.photo || null;
    this.name = data.name || null;
    this.sku = data.sku || null;
    this.description = data.description || null;
    this.materials = data.materials || null;
    this.sizes = data.sizes || null;
    



    this.read = function (cb) {
        var q = "SELECT * FROM " + this.table;

        mysql.query(q, function (rows) {
            cb(rows);
            console.log(q);
        });

    }

    this.create = function (cb) {
        var me = this;

        
        var q = "INSERT INTO " + this.table + " (brand,name,sku,description,materials,sizes) VALUES ( '"+ this.brand + "','" + this.name + "', '" + this.sku + "','" + this.description + "','" + this.materials + "','" + this.sizes + "' )";

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