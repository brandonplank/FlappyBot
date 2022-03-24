const Discord = require("discord.js");
const config = require("./config.json");
var request = require('request');

const baseURL = "https://flappybird.brandonplank.org/v1"

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
        request.get({url: `${baseURL}/getID/${args[0]}`}, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                message.reply(jsonBody.message)
                return
            }
            message.reply(body)
        })
    }

    if(command === "ban") {
        if(!isAdmin(message)) {
            message.reply("You do not have permission to use this command")
            return
        }
        if(args.length < 2) {
            message.reply("This command takes in 2 argumants\nUSAGE !ban <userid> <reason>")
            return
        }
        var reason = ""
        for(var i = 1; i < args.length; i++) {
            reason += `${args[i]} `
        }
        request.get({
            url: `${baseURL}/auth/ban/${args[0]}/${encodeURIComponent(reason)}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                message.reply(jsonBody.message)
                return
            }
            message.reply(body)
        })
    }

    if(command === "unban") {
        if(!isAdmin(message)) {
            message.reply("You do not have permission to use this command")
            return
        }
        if(args.length != 1) {
            message.reply("This command takes in 1 argumant\nUSAGE !unban <userid>")
            return
        }
        request.get({
            url: `${baseURL}/auth/unban/${args[0]}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                message.reply(jsonBody.message)
                return
            }
            message.reply(body)
        })
    }

    if(command === "restorescore") {
        if(!isAdmin(message)) {
            message.reply("You do not have permission to use this command")
            return
        }
        if(args.length != 2) {
            message.reply("This command takes in 2 argumants\nUSAGE !restorescore <userid> <score>")
            return
        }
        request.get({
            url: `${baseURL}/auth/restoreScore/${args[0]}/${args[1]}`,
            headers: {"Authorization": craftAuthHeader(config.BOT_USERNAME, config.BOT_PASSWORD)}
        }, function(error, response, body){
            if(isJson(body)) {
                const jsonBody = JSON.parse(body)
                message.reply(jsonBody.message)
                return
            }
            message.reply(body)
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