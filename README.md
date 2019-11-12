# Google Photos Library API

Wrapper around the google photos API. The API reference can be found [here](https://developers.google.com/photos/library/reference/).

### Authentication

This package doesn't authentication itself. We suggest using the official
[google nodejs library](https://www.npmjs.com/package/googleapis). Here are their [instructions](https://www.npmjs.com/package/googleapis#oauth2-client).

Use the library to get the auth token for the scopes you will need. Read [this](https://developers.google.com/photos/library/guides/authentication-authorization) to figure out what
scopes you will need.

The scopes are available on the `Photos` object to make your life easier.

| Const                                                                                                | Scope                                                                 | Use                                                                                                    |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| READ_ONLY                                                                                       | https://www.googleapis.com/auth/photoslibrary.readonly                | Only reading information. Sharing information is returned only if the token has sharing scope as well. |
| APPEND_ONLY                                                                                     | https://www.googleapis.com/auth/photoslibrary.appendonly              | Only add photos, create albums in the user's collection. No sort of read access.                       |
| READ_DEV_DATA                                                                                  | https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata | Read access to media items and albums created by the developer. Use this with write only.              |
| READ_AND_APPEND                                                                                | https://www.googleapis.com/auth/photoslibrary                         | Access to read and write only. No sharing information can be accessed.                                 |
| SHARING | https://www.googleapis.com/auth/photoslibrary.sharing | Access to sharing information. |


Create file /config/const.js
```
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
        SEARCH_PAGE_SIZE: 2,  // Số bản ghi 1 trang
        ALBUM_PAGE_SIZE: 50,    // Kích thước trang để sử dụng cho yêu cầu liệt kê album. 50 được khuyến nghị.
        API_END_POINT: 'https://photoslibrary.googleapis.com'
    }
};
```
You can figure out your client id, secret and redirect url by going to the
[Google Cloud Console](https://console.developers.google.com/apis/credentials) and navigating to
APIs -> Credentials.
