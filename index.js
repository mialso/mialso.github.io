var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var unsplash = require('unsplash-js')
var nodeFetch = require('node-fetch')

var app = express();

const GIPHY_KEY = process.env.GIPHY_KEY;

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/', express.static(__dirname + '/'));

app.get('/gif', function (req, res) {
    var tag = req.query['tag'];

    getGiphy(tag, (url) => res.send(url))

});

app.get('/image', function (req, res) {
    var tag = req.query['tag'];

    getImage(tag, (url) => res.send(url))

});

var server = app.listen(process.env.PORT);

const unsplashApi = unsplash.createApi({
    accessKey: process.env.UNSPLASH_KEY,
    fetch: nodeFetch,
});

var getGiphy = function (tag, callback) {
    var uri = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&rating=pg&tag=${tag}`;

    var options = {
        uri: uri,
        method: 'GET',
        json: true
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

var getImage = function (tag, callback) {
    unsplashApi.search.getPhotos({ query: tag, page: 1, perPage: 10, orderBy: "latest" }).then(result => {
        getPhoto(result, callback, () => {
            unsplashApi.search.getCollections({ query: tag }).then(result => {
                getCollectionPhoto(result, callback, () => {
                    callback("https://assets.zoom.us/images/en-us/desktop/generic/video-not-working.PNG")
                })
            })
        })
    });
};

var getPhoto = (result, callback, fallback) => {
    switch (result.type) {
        case 'error':
            console.log('error occurred: ', result.errors[0]);
        case 'success':
            const photos = result.response;
            if (photos && Array.isArray(photos.results) && photos.results.length) {
                console.log('results', photos.results);
                callback(photos.results[0].urls.full);
            } else {
                console.log('not found: ', photos);
                fallback();
            }
    }
}

var getCollectionPhoto = (result, callback, fallback) => {
    switch (result.type) {
        case 'error':
            console.log('error occurred: ', result.errors[0]);
        case 'success':
            const photos = result.response;
            if (photos && Array.isArray(photos.results) && photos.results.length) {
                console.log('results', photos.results);
                const collection = photos.results[0]
                callback(collection.cover_photo.urls.full);
            } else {
                console.log('not found: ', photos);
                fallback();
            }
    }
}