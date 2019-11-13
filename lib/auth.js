'use strict'

const fs = require('fs');
const { google } = require('googleapis')

const CONST = require('../config/const');

class GoogleApi {
    constructor(){
        const {client_secret, client_id, redirect_uris} = CONST.CREDENTIALS_FILE;
        this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    }
    onRefreshToken(){
      console.log('OnRefreshToken');
      this.oAuth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          this.oAuth2Client.setCredentials({
              refresh_token: token
          });
          fs.writeFile(CONST.TOKEN_FILE, JSON.stringify(response), (err) => {
              if (err) return logger.error(err);
              logger.info('Token stored');
          });
          console.log("refresh_token "+tokens.refresh_token);
        }
        console.log("refresh_token "+tokens.access_token);
      });
    }
    generateUrl(scopes){
        const url = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        })
        return url;
    }

    async setCredentialsToken(code){
        const credentials = await this.oAuth2Client.getToken(code)
        this.oAuth2Client.setCredentials(credentials.tokens);
        return credentials.tokens;
    }

    getOAuth2Client(token){
        this.oAuth2Client.setCredentials({
            refresh_token: token
        });
        return this.oAuth2Client;
    }
}

module.exports = new GoogleApi();
