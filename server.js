var express = require('express');
var app = express();
var fs = require('fs');
//var multer = require('multer');
//var upload = multer({ dest: '/uploads' });

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' })); // for parsing application/x-www-form-urlencoded




app.get('/file', function (req, res) {
    fs.readFile(req.query.file, function (err, data) {
        res.send(data);
    });
});

app.post('/file', function (req, res) {
    //console.log({ 'body': req.body.file });
    // var data = req.body.file.replace(/^data:image\/\w+;base64,/, ""); // PNG
    var data = req.body.file.replace(/^data:application\/\w+;base64,/, ""); //PDF
    var file = new Buffer(data, 'base64');
    //var file = req.body.file;
    fs.writeFile(req.body.filename, file, (err) => {
        if (err) res.status(400).end();
        res.status(200).end();
    });

});


app.use('/', express.static(__dirname));


app.listen(8080);