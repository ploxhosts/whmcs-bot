const Discord = require('discord.js');
const config = require('../config.json');
const sql = require('sqlite');
sql.open('./bot.sqite');

const verifyCollector = require('../functions/verifyCollector.js');

module.exports = async (client, member) => {
    let row = await sql.get(`SELECT * FROM verify WHERE userId = "${member.id}"`);
    if (row) return;
    try {
        let dm = await member.createDM();
        await dm.send(Embed(config.welcome.message, 'main'));
        await dm.send(Embed(config.welcome.how_to_verify, 'main'));
        let verifyMessage = await dm.send(Embed(config.welcome.are_you_client, 'main'));
        await verifyMessage.react('🇾');
        await verifyMessage.react('🇳');
        await collector(verifyMessage);
    } catch (err) {
        return;
    }

    async function collector(verifyMessage) {
        await sql.run(`INSERT INTO verify VALUES (?, ?)`, [verifyMessage.id, member.id]);
        await verifyCollector.collector(client, verifyMessage.id, member.id);
    }
};

function Embed(description, color) {
    return new Discord.RichEmbed()
        .setColor(config.embed.colors[color])
        .setDescription(description)
        .setTimestamp()
        .setFooter(config.embed.footer)
}