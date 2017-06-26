var app = {};

app.drivers = {};
app.drivers.cryptojs = require('./drivers/cryptojs')(app);
app.drivers.express = require('./drivers/express');
app.drivers.multer = require('./drivers/multer');
app.drivers.express.init();

app.drivers.mysql = require('./drivers/mysql');



app.models = {};
app.models.user = require('./models/user');
app.models.brand = require('./models/brand');
app.models.product = require('./models/product');
app.models.inventory = require('./models/inventory');
app.models.order = require('./models/order');
app.models.store = require('./models/store');



app.controllers = {};
app.controllers.routes = require('./controllers/routes')(app);
app.controllers.inventory = require('./controllers/inventory')(app);
app.controllers.security = require('./controllers/security')(app);