'use strict'

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
///###### END LOGGER ######

const fs = require('fs');
const request = require('request-promise');


const CONST = require('../config/const');

class PhotosAPIs {

    async apiGetAlbums(authToken) {
        let albums = [];
        let nextPageToken = null;
        let error = null;
        let parameters = {pageSize: CONST.ALBUM.ALBUM_PAGE_SIZE};
        try {
            do {
                logger.verbose(`Loading albums. Received so far: ${albums.length}`);
                const result = await request.get(CONST.ALBUM.API_END_POINT + '/v1/albums', {
                    headers: {'Content-Type': 'application/json'},
                    qs: parameters,
                    json: true,
                    auth: {'bearer': authToken},
                });
                logger.debug(`Response: ${result}`);
                if (result && result.albums) {
                    logger.verbose(`Number of albums received: ${result.albums.length}`);
                    const items = result.albums.filter(x => !!x);
                    albums = albums.concat(items);
                }
                parameters.pageToken = result.nextPageToken;
            }
            while (parameters.pageToken != null);
        } catch (err) {
            error = err.error.error || {name: err.name, code: err.statusCode, message: err.message};
            logger.error(error);
        }
        logger.info('Albums loaded.');
        return {albums, error};
    }
    async mediaItems(authToken, albumId, inPageSize, pageToken) {
        let pageSize = inPageSize?inPageSize:CONST.ALBUM.ALBUM_PAGE_SIZE;
        let photos = [];
        let error = null;
        let nextPageToken = null;

        let parameters = { albumId: albumId, pageSize: pageSize, pageToken: pageToken };
        try {
            logger.info(`Submitting search with parameters: ${JSON.stringify(parameters)}`);

            const result = await request.post(CONST.ALBUM.API_END_POINT + '/v1/mediaItems:search', {
                headers: { 'Content-Type': 'application/json' },
                json: parameters,
                auth: { 'bearer': authToken },
            });
            logger.debug(`Response: ${result}`);

            const items = result && result.mediaItems ?
                result.mediaItems
                .filter(x => x)
                .filter(x => x.mimeType && x.mimeType.startsWith('image/')) : [];

            photos = photos.concat(items);
            parameters.pageToken = result.nextPageToken;
            logger.verbose(`Found ${items.length} images in this request. Total images: ${photos.length}`);
        } catch (err) {
            error = err.error.error || { name: err.name, code: err.statusCode, message: err.message };
            logger.error(error);
        }
        logger.info('Search complete.');
        return { photos, parameters, error };
    }
}

module.exports = new PhotosAPIs();
