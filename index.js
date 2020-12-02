var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();

const GIPHY_KEY = process.env.GIPHY_KEY;

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/', express.static(__dirname + '/'));

app.get('/gif', function (req, res) {
    var tag = req.query['tag'];

    getGiphy(tag, (url) => res.send(url))

});

var server = app.listen(process.env.PORT);

var getGiphy = function (tag, callback) {
    var uri = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&rating=pg&tag=${tag}`;

    var options = {
        uri: uri,
        method: 'GET',
        json:true
    }
    request(options, function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);

        if (!body || !body.data.image_original_url) {
            return;
        }

        const url = decodeURIComponent(body.data.image_original_url)
        
        callback(url)
    });
};