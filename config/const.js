'use strict';

const SITE_API = {
    TOKEN_FILE: './google/token.json',
    CREDENTIALS_FILE: require('../google/credentials.json').web,
    STATIC_API: '/api',
    SCOPES: {
        READ_ONLY: 'https://www.googleapis.com/auth/photoslibrary.readonly',
        APPEND_ONLY: 'https://www.googleapis.com/auth/photoslibrary.appendonly',
        READ_DEV_DATA: 'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
        READ_AND_APPEND: 'https://www.googleapis.com/auth/photoslibrary',
        SHARING: 'https://www.googleapis.com/auth/photoslibrary.sharing'
    },
    ALBUM: {
        PHOTOS_TO_LOAD: 150,
        SEARCH_PAGE_SIZE: 2,
        ALBUM_PAGE_SIZE: 50,
        API_END_POINT: 'https://photoslibrary.googleapis.com'
    }
};

module.exports = SITE_API;
