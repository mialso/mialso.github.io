var express = require('express');
var app = express();

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/', express.static(__dirname + '/miro/cmdplg/'));

var server = app.listen(process.env.PORT);