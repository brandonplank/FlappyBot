const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const config = require("./config.json");
var request = require('request');

const baseURL = "https://flappybird.brandonplank.org"

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

console.log("Bot is logging in")
client.login(config.BOT_TOKEN);

const prefix = "!";
client.on("messageCreate", function(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length)
    const args = commandBody.split(' ')
    const command = args.shift().toLowerCase()

    if(command === "getid") {
        if(args.length != 1) {
            message.reply("This command takes in 1 argumant\nUSAGE !getid <userid>")
            return
        }
        request.get({url: `${baseURL}/v1/getID/${args[0]}`}, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                message.reply(jsonBody.message)
                return
            }
            message.reply(body)
        })
    }

    if(command === "user") {
        if (!isAdmin(message)) {
            message.reply("You do not have permission to use this command")
            return
        }
        if (args.length != 1) {
            message.reply("This command takes in 1 argumant\nUSAGE !user <userid>")
            return
        }
        request.get({
            url: `${baseURL}/v1/user/${args[0]}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function (error, response, body) {
            if (isJson(body)) {
                const jsonBody = JSON.parse(body)
                if (error || response.statusCode != 200) {
                    return message.reply(jsonBody.message)
                }
                const user = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(jsonBody.name)
                    .setDescription('User statistics')
                    .setThumbnail('https://flappybird.brandonplank.org/images/favicon.png')
                    .addFields(
                        {
                            name: 'Score',
                            value: `${jsonBody.score}`
                        },
                        {
                            name: 'Deaths',
                            value: `${jsonBody.deaths}`
                        },
                        {
                            name: 'Banned',
                            value: `${jsonBody.isBanned}`
                        },
                        {
                            name: 'ID',
                            value: `${jsonBody.id}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: "FlappyBot", iconURL: 'https://flappybird.brandonplank.org/images/favicon.png'});
                return message.reply({embeds: [user]})
            }
            return message.reply(body)
        })
    }

    if(command === "ban") {
        if(!isAdmin(message)) {
            return message.reply("You do not have permission to use this command")
        }
        if(args.length < 2) {
            return message.reply("This command takes in 2 argumants\nUSAGE !ban <userid> <reason>")
        }
        var reason = ""
        for(var i = 1; i < args.length; i++) {
            reason += `${args[i]} `
        }
        request.get({
            url: `${baseURL}/v1/auth/ban/${args[0]}/${encodeURIComponent(reason)}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                return message.reply(jsonBody.message)
            }
            message.reply(body)
        })
    }

    if(command === "unban") {
        if(!isAdmin(message)) {
            return message.reply("You do not have permission to use this command")
        }
        if(args.length != 1) {
            return message.reply("This command takes in 1 argumant\nUSAGE !unban <userid>")
        }
        request.get({
            url: `${baseURL}/v1/auth/unban/${args[0]}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                return message.reply(jsonBody.message)
            }
            return message.reply(body)
        })
    }

    if(command === "restorescore") {
        if(!isAdmin(message)) {
            return message.reply("You do not have permission to use this command")
        }
        if(args.length != 2) {
            return message.reply("This command takes in 2 argumants\nUSAGE !restorescore <userid> <score>")
        }
        request.get({
            url: `${baseURL}/v1/auth/restoreScore/${args[0]}/${args[1]}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                return message.reply(jsonBody.message)
            }
            return message.reply(body)
        })
    }

    if(command === "help") {
        message.reply(`
!getid <name>
!ban <userid> <reason>
!unban <userid>
!restorescore <userid> <score>
        `)
    }

});

function isAdmin(message) {
    return message.member.roles.cache.find(r => r.id === "954092482243727391")
}

function craftAuthHeader(username, password) {
    const str = `${username}:${password}`
    return `Basic ${btoa(str)}`
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}