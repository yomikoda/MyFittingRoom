var express = require('./express'),
    bodyParser = require('body-parser'),
    multer = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },

  filename: function (req, file, cb) {
    cb(null, '123'+file.originalname)
  }
})

var upload = multer({storage: storage})
//
//var app = express();
//
//// we add to express the body-parser add-on allowing us to read req.body
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//
//app.use('/uploads', express.static(__dirname + '/uploads'));
//
//app.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }]), function(req, res){
//
//	console.log(req.files)
//
//	res.send(req.files.image[0].path)
//
//})
//
//app.listen(1337);