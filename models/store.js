module.exports = function (app, data) {
    var mysql = app.drivers.mysql;

    this.table = 'stores';
    this.id = data.id || null;
    this.brand = data.brand;
    this.photo = data.photo || null;
    this.name = data.name || null;
    this.hours = data.hours || null;
    this.address = data.address || null;
    this.zipcode = data.zipcode || null;
    this.city = data.city || null;
    this.country = data.country || null;
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.phone = data.phone || null;
    



    this.read = function (cb) {
        var q = "SELECT * FROM " + this.table;

        mysql.query(q, function (rows) {
            cb(rows);
            console.log(q);
        });

    }

    this.create = function (cb) {
        var me = this;

        var q = "INSERT INTO " + this.table + " (brand,photo,name,hours,address,zipcode,city,country,latitude,longitude,phone) VALUES ( '" + this.brand + "' , '" + this.photo + "', '" + this.name + "','" + this.hours + "','" + this.address + "','" +  this.zipcode + "','" + this.city + "','" + this.country + "','" + this.latitude + "','" + this.longitude + "','" + this.phone + "' )";

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