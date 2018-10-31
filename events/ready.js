const Discord = require(`discord.js`);
const config = require("../config.json");
const sql = require('sqlite');
sql.open('./bot.sqlite');

const verifyCollector = require('../functions/verifyCollector.js');

module.exports = async(client, msg) => {
    client.user.setPresence({ status: 'online', game: { name: `${config.prefix}help | ${client.user.username}` } });
    let row = await sql.all(`SELECT * FROM verify`);
    row.map(i => {
        verifyCollector.collector(client, i.msgId, i.userId);
    });
    console.log(`Ready!`);
};
