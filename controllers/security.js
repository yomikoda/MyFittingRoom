var bcrypt = require('bcrypt-nodejs')
var CryptoJs = require('crypto-js')

//PASS TO DRIVER
//// ENCRYPT
//var supersecret = 'sup3rs3cr3t'
//var ciphertext = CryptoJs.AES.encrypt('SALUT WEBSTART',supersecret);
//var token = ciphertext.toString()
//
//console.log('token:',token)
////DECRYPT
//var bytes = CryptoJs.AES.decrypt(token, supersecret);
//var plaintext = bytes.toString(CryptoJs.enc.Utf8);
//
//console.log('decrypted token', plaintext);


module.exports = function (app) {
    return {
        authenticate: function (table, email, password, cb) {
            var q = "SELECT id,email, password FROM " + table + "s WHERE email='" + email + "' LIMIT 1";
            console.log(q);
            app.drivers.mysql.query(q, function (rows) {
                if(!rows.length) return cb(false, null)
                
                var response = rows[0]; 
                var check = bcrypt.compareSync(password, response.password);
                
               // IF CHECK TRUE FALSE -> RETURN FALSE AND NULL AND NO USER ,  IF TRUE WE KEEP GOING AND RETURN USER - if check = false
                if (!check) return cb(check, null)
                

                var user = new app.models[table](app, {
                    id: response.id
                });
                
                user.read(function (item) {
                    item.token = app.drivers.cryptojs.encrypt({
                        id: item.id,
                        email: item.email // YOU USUALLY GO WITH PRIMARY KEYS
                    })
                    cb(check, item)
                })

            })

        },

        grant: function (id, token) {
            var data = app.drivers.cryptojs.decrypt(token);
            return data.id == id
                
        }
    }
}