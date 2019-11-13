'use strict'
const express = require('express');
const app = express();
const fs = require('fs');
const {google} = require('googleapis');
const request = require('request-promise');

//###### INIT LOGGER ######
const winston = require('winston');
const consoleTransport = new winston.transports.Console();
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports:[ consoleTransport ]
});
// Enable extensive logging if the DEBUG environment variable is set.
if (process.env.DEBUG) {
    logger.level = 'silly';
    app.use(expressWinston.logger({
        transports: [consoleTransport],
        winstonInstance: logger
    }));
    require('request-promise').debug = true;
} else {
    logger.level = 'verbose';
}
///###### END LOGGER ######

const CONST = require('./config/const');

function readFileToken() {
    let content = fs.readFileSync(CONST.TOKEN_FILE,'utf-8','r+');
    let cToken;
    if (content) cToken = JSON.parse(content);
    else cToken = 404;
    return cToken;
}
var AUTH_TOKEN = readFileToken().access_token;

//################# Google Photos APIs #################
const GooglePhotosApi = require('./lib/photos_library');

app.get(CONST.STATIC_API+'/albums/list', async (req, res) => {
    logger.info('Loading album list');
    const data = await GooglePhotosApi.apiAlbumsList(AUTH_TOKEN);
    if (data.error) {
        returnError(res, data);
    } else {
        res.status(200).send(data);
    }
});

app.get(CONST.STATIC_API+'/albums/get', async (req, res) => {
    logger.info('Loading album information');
    let albumId = req.query.albumId;
    const data = await GooglePhotosApi.apiAlbumsGet(AUTH_TOKEN, albumId);
    if (data.error) {
        returnError(res, data);
    } else {
        res.status(200).send(data);
    }
});

app.get(CONST.STATIC_API+'/mediaItems/', async (req, res) => {
    logger.info('Loading Media Items');
    let albumId = req.query.albumId;
    let pageToken = req.query.page;
    let limit = req.query.limit;

    const data = await GooglePhotosApi.mediaItems(AUTH_TOKEN, albumId, limit, pageToken);
    if (data.error) {
        returnError(res, data);
    } else {
        res.status(200).send(data);
    }
});

//################# Google Photos APIs #################

//################## Google Auth APIs ##################
const GoogleAuthApi = require('./lib/auth');
app.get('/auth/google', (req, res) => {
    let url = GoogleAuthApi.generateUrl(CONST.SCOPES.READ_AND_APPEND);
    res.redirect(url);
});
app.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if(!code){
        logger.error('No code provided');
        return 404;
    }
    GoogleAuthApi.setCredentialsToken(code)
    .then(function(response){
        fs.writeFile(CONST.TOKEN_FILE, JSON.stringify(response), (err) => {
            if (err) return logger.error(err);
            logger.info('Token stored');
        });
        res.redirect('/');
    }).catch(function(e){
        logger.error(e.message);
        return 404;
    });
});
//################## Google Auth APIs ##################

app.get('/', (req, res) => {
    logger.info('Google Photos APIs');
    res.send('Google Photos APIs');
});
app.listen(3000, () => {
    logger.info('----- LISTEN -----');
});
