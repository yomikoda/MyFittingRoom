var express = require('express'),
    session = require('express-session'),
    mysql = require('./mysql');

module.exports = {
    server: null,

    init: function () {
        var app = express();

        app.use(session({
            secret: 'triskele',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 60000
            }
        }))
        
        
        app.listen(3000, function () {
            console.log('listening on *3000')
        });

        this.server = app; // -> app.drivers.express.server

    }

}