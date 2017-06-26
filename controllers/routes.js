var path = require('path'),
    fs = require('fs'), //file system
    bodyParser = require('body-parser'),
    express = require('express'),
    session = require('express-session'),
    Mustache = require('mustache')

module.exports = function (app) {
    var server = app.drivers.express.server;
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({
        extended: true
    }));
    //Express Session
    server.use(session({
            secret: 'mysup3rs3cr3t',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 60 * 60 * 24 * 31 * 1000 //Month in Ms
            }
        }))
        // Logout req.session.destroy and redirect to login or home
    server.post('/logout', function (req, res) {
        req.session.destroy() // start over and crush session
        return res.redirect('/login')
    });


    
     server.get('/', function (req, res) {
        console.log(req.session)
        res.sendFile(path.resolve('views/index.html'))

    });
    
    // LOGIN PAGE
    server.get('/login', function (req, res) {
        console.log(req.session)
        res.sendFile(path.resolve('views/login.html'))

    });
    
    //LOGIN INFO SENT AND CHECKED
    server.post('/login', function (req, res) {
            console.log(req.session)
            console.log(req.body)
            
            app.controllers.security.authenticate(req.body.table, req.body.email, req.body.password, function (check, user) {

                if (!check) return res.redirect('/login?error=badpassword')

                console.log(user)
                req.session.token = user.token
                req.session.user = user.id
                req.session.type = req.body.table
                res.redirect('/profile')
            })
    })
    
  
    
        //LOGIN ACCESS USING TOKEN/ID INFO
    server.get('/profile', function (req, res) {
        console.log(req.session)
            //Check for Id and Token presence - if not destroy and Redir to Login
        if (!req.session.token || !req.session.user) {
            req.session.destroy() // start over and crush session
            return res.redirect('/login')
        }
        //check if valid  token compared to user Id if not destroy and Redir to Login
        if (!app.controllers.security.grant(req.session.user, req.session.token)) {
            req.session.destroy()
            return res.redirect('/login')
        }

        var user = new app.models[req.session.type](app, {
            id: req.session.user
        })
        user.read(function (item) {
            console.log(item)

            //var output = Mustache.render("{{user}} {{token}}", req.session); 
            var template = fs.readFileSync(path.resolve('views/profile-'+ req.session.type +'.mustache')).toString()
            var output = Mustache.render(template, item);
            res.send(output)
        })


    });
    
    
    
    //SIGNUP
    server.post('/signup', function (req, res) {
        var user = new app.models.user(app, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country
        });

        user.create(function (rows) {
            app.controllers.security.authenticate('user', req.body.email, req.body.password, function (check, user) {
                if (!check) return res.redirect('/login?error=badpassword')
                console.log(user)
                req.session.token = user.token
                console.log(user.token)
                req.session.user = user.id
                res.redirect('/profile')
            })
         });
    })



    server.use('/js', express.static('views/assets/js'));
    server.use('/css', express.static('views/assets/css'));
    server.use('/imgs', express.static('views/assets/imgs'));


    /*** API ***/


    /** USER **/


    //CREATE USER 
    server.post('/api/user', function (req, res) {
        var user = new app.models.user(app, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country
        });

        user.create(function (rows) {
            res.send(rows);
        });

    });

    // USER LOGIN 
    server.post('/api/user/login', function (req, res) {

        app.controllers.security.authenticate('user', req.body.email, req.body.password, function (check, user) {
            if (!check) return res.status(403).send({
                error: 'bad password'
            })

            res.send(user)
        })

    });

    //READ USER
    server.get('/api/user', function (req, res) {
        //Check if id or token are missing
        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        //extract data from token
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })
        var user = new app.models.user(app, {
            id: id
        });
        user.read(function (rows) {
            res.send(rows);
        });
    });

    //DELETE USER
    server.delete('/api/user', function (req, res) {

        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })

        var user = new app.models.user(app, {
            id: req.query.id
        });

        user.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE USER 
    server.put('/api/user', function (req, res) {

        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })

        var user = new app.models.user(app, {});

        user.update({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: req.body.birthday,
            email: req.body.email,
            //            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });
    });


    /** BRAND **/


    //CREATE BRAND
    server.post('/api/brand', function (req, res) {
        var brand = new app.models.brand(app, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            description: req.body.description,
            phone: req.body.phone
        });

        brand.create(function (rows) {
            res.send(rows);
        });

    });

    //BRAND LOGIN
    server.post('/api/brand/login', function (req, res) {

        app.controllers.security.authenticate('brand', req.body.email, req.body.password, function (check, user) {
            if (!check) return res.status(403).send({
                error: 'bad password'
            })

            res.send(user)
        })

    });

    //READ BRAND
    server.get('/api/brand', function (req, res) {
        //Check if id or token are missing
        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        //extract data from token
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })
            
        var brand = new app.models.brand(app, {
            id: id
        });
        brand.read(function (rows) {
            res.send(rows);
        });

    });

    //DELETE BRAND
    server.delete('/api/brand', function (req, res) {
        
        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })
 
        var brand = new app.models.brand(app, {
            id: req.body.id
        });

        brand.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE BRAND
    server.put('/api/brand', function (req, res) {
        
        if (!req.query.id || !req.query.token) return res.status(422).send({
            error: 'Missing "id" or "token" parameter'
        })

        var id = req.query.id;
        if (!app.controllers.security.grant(req.query.id, req.query.token))
            return res.status(403).send({
                error: 'Forbidden Access'
            })
            
            
        var brand = new app.models.brand(app, {});

        brand.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            description: req.body.description,
            phone: req.body.phone,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });

    });

    /** PRODUCT **/


    //CREATE PRODUCT
    server.post('/api/product', function (req, res) {
        var product = new app.models.product(app, {
            name: req.body.name,
            sku: req.body.sku,
            description: req.body.description,
            materials: req.body.materials,
            sizes: req.body.sizes,
            brand: req.body.brand
        });

        product.create(function (rows) {
            res.send(rows);
        });

    });

    //READ PRODUCT
    server.get('/api/product', function (req, res) {
        var id = req.query.id;

        var product = new app.models.product(app, {
            id: id
        });
        product.read(function (rows) {
            res.send(rows);
        });
    });

    //DELETE PRODUCT
    server.delete('/api/product', function (req, res) {

        var product = new app.models.product(app, {
            id: req.body.id
        });

        product.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE PRODUCT
    server.put('/api/product', function (req, res) {

        var product = new app.models.product(app, {});

        product.update({
            name: req.body.name,
            sku: req.body.sku,
            description: req.body.description,
            materials: req.body.materials,
            sizes: req.body.sizes,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });

    });


    /** INVENTORY **/


    //CREATE INVENTORY
    server.post('/api/inventory', function (req, res) {
        var inventory = new app.models.inventory(app, {
            product: req.body.product,
            store: req.body.store,
            quantity: req.body.quantity
        });

        inventory.create(function (rows) {
            res.send(rows);
        });

    });

    //READ INVENTORY
    server.get('/api/inventory', function (req, res) {
        var id = req.query.id;

        var inventory = new app.models.inventory(app, {
            id: id
        });
        inventory.read(function (rows) {
            res.send(rows);
        });
    });

    //DELETE INVENTORY
    server.delete('/api/inventory', function (req, res) {

        var inventory = new app.models.inventory(app, {
            id: req.body.id
        });

        inventory.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE INVENTORY
    server.put('/api/inventory', function (req, res) {

        var inventory = new app.models.inventory(app, {});

        inventory.update({
            product: req.body.product,
            store: req.body.store,
            quantity: req.body.quantity,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });

    });


    /**STORE**/


    //CREATE STORE
    server.post('/api/store', function (req, res) {
        var store = new app.models.store(app, {
            brand: req.body.brand,
            photo: req.body.photo,
            name: req.body.name,
            hours: req.body.hours,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            phone: req.body.phone,
        });

        store.create(function (rows) {
            res.send(rows);
        });

    });

    //READ STORE
    server.get('/api/store', function (req, res) {
        var id = req.query.id;

        var store = new app.models.store(app, {
            id: id
        });
        store.read(function (rows) {
            res.send(rows);
        });
    });

    //DELETE STORE
    server.delete('/api/store', function (req, res) {

        var store = new app.models.store(app, {
            id: req.body.id
        });

        store.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE STORE
    server.put('/api/store', function (req, res) {

        var store = new app.models.store(app, {});

        store.update({
            brand: req.body.brand,
            photo: req.body.photo,
            name: req.body.name,
            hours: req.body.hours,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            phone: req.body.phone,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });

    });


    /**ORDER**/


    //CREATE ORDER
    server.post('/api/order', function (req, res) {
        var order = new app.models.order(app, {
            user: req.body.user,
            product: req.body.product,
            store: req.body.store,
            date: req.body.date
        });

        order.create(function (rows) {
            res.send(rows);
        });

    });

    //READ ORDER
    server.get('/api/order', function (req, res) {
        var id = req.query.id;

        var order = new app.models.order(app, {
            id: id
        });
        order.read(function (rows) {
            res.send(rows);
        });
    });

    //DELETE ORDER
    server.delete('/api/order', function (req, res) {

        var order = new app.models.order(app, {
            id: req.body.id
        });

        order.delete(function (rows) {
            res.send(rows);
        });

    });

    //UPDATE ORDER
    server.put('/api/order', function (req, res) {

        var order = new app.models.order(app, {});

        order.update({
            user: req.body.user,
            product: req.body.product,
            store: req.body.store,
            date: req.body.date,
            id: req.body.id
        }, function (rows) {
            res.send(rows);
        });

    });



}