const Discord = require('discord.js');
const config = require('../config.json');
const url = require('url');
const fetch = require('node-fetch');
const sql = require('sqlite');

exports.get = async (params, action, member) => {
    if (member) {
        let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
        if (!row) return undefined;
        params['clientId'] = row.clientId;
    }

    params['username'] = config.whmcs.username;
    params['password'] = config.whmcs.password;
    params['action'] = action;

    let URL = config.whmcs.url+'?'+Object.entries(params).map(i => `${i[0]}=${i[1]}`).join('&')+'&responsetype=json';
    console.log(URL);
    let result = await fetch(URL);
    return await result.json();
};