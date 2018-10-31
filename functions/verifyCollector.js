const Discord = require('discord.js');
const config = require('../config.json');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.collector = async (client, msgId, userId) => {
    let guild = client.guilds.first();
    if (guild) {
        let member = guild.members.get(userId);
        if (member) {
            let dm = await member.createDM();
            if (dm) {
                let msg = await dm.fetchMessage(msgId);
                if (msg) {
                    let filter = (reaction, user) => user.id === userId && (reaction.emoji.name === '🇾' || reaction.emoji.name === '🇳');
                    let collected = await msg.awaitReactions(filter, {time: false, maxUsers: 1});
                    collected = collected.first();
                    let verifiedRole = guild.roles.find(r => r.name === config.roles.verify);
                    let clientRole = guild.roles.find(r => r.name === config.roles.client);
                    await member.addRole(verifiedRole.id);
                    if (collected.emoji.name === '🇾') {
                        await member.addRole(clientRole.id);
                    }
                    await sql.run(`DELETE * FROM verify WHERE msgId = "${msgId}" AND userId = "${userId}"`)
                }
            }
        }
    }
};