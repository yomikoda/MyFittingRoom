var bcrypt = require('bcrypt-nodejs');


module.exports = function (app, data) {
    var mysql = app.drivers.mysql;

    this.table = 'users';
    this.id = data.id || null;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.birthday = data.birthday; // CHECK WHY NOT WORKING ( SQL )
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.address = data.address;
    this.zipcode = data.zipcode;
    this.city = data.city;
    this.country = data.country;
    this.lastconnection = new Date().toISOString();


    this.read = function (cb) {
        var q = "SELECT id,firstname,lastname,birthday,email,phone,address,zipcode,city,country FROM " + this.table + " WHERE id=" + this.id + " LIMIT 1";

        mysql.query(q, function (rows) {
            cb(rows[0]);
        });
    }

    this.create = function (cb) {
        var me = this;
        me.password = bcrypt.hashSync(this.password);

        var q = "INSERT INTO " + this.table + " (firstname,lastname,birthday,email,password,phone,address,zipcode,city,country,lastconnection) VALUES ( '" + this.firstname + "','" + this.lastname + "' , '" + this.birthday + "', '" + this.email + "', '" + this.password + "','" + this.phone + "','" + this.address + "','" + this.zipcode + "','" + this.city + "','" + this.country + "' ,'" + this.lastconnection + "')";

        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });
    }



    this.delete = function (cb) {
        var me = this,
            q = " DELETE from " + this.table + " where id='" + this.id + "'";
        console.log(q);
        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });

    }

    this.update = function (data, cb) {
        var set = []

        for (k in data) {
            set.push(k + "='" + data[k] + "'")
        }

        var q = "UPDATE " + this.table + " SET " + set.join(',') + " WHERE id=" + data.id;

        var me = this;

        mysql.query(q, function (rows) {
            me.id = rows.insertId;
            cb(me);
        });

    }

    return this;

}