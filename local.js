const isRailway = require('is-railway');
//require('./tokens.json')
// a
module.exports = {
    token: function () {
        if (isRailway()) {
            return process.env.TOKEN;
        } else {
            return require('./tokens.json').token;
        }
    },
    clientId: function () {
        if (isRailway()) {
            return process.env.CLIENTID;
        } else {
            return require('./tokens.json').clientId;
        }
    },
    clientSecret: function () {
        if (isRailway()) {
            return process.env.CLIENTSECRET;
        } else {
            return require('./tokens.json').clientSecret;
        }
    },
    botUsername: function () {
        if (isRailway()) {
            return process.env.BOT_USERNAME;
        } else {
            return require('./tokens.json').botUsername;
        }
    },
    botPassword: function () {
        if (isRailway()) {
            return process.env.BOT_PASSWORD;
        } else {
            return require('./tokens.json').botPassword;
        }
    },
}