var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('node-oauth2-server');

var app = express();

app.use(bodyParser()); // REQUIRED


var memorystore = require('./model.js');

app.oauth = oauthserver({
    model: memorystore,
    grants: ['password', 'refresh_token'],
    debug: true
});


app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function(req, res) {
    res.send('Secret area');
});

app.use(app.oauth.errorHandler());

app.listen(3000);