const Discord = require('discord.js');
let auth = require('./local').token()
const { Client, Collection, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const deploy = require('./deploy-commands.js');
var request = require('request');
const cfg = require("./local")
const axios = require('axios')

global.client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS]
});

client.commands = new Collection();
const fs = require('node:fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
    console.log("Registered Command: ", command.data.name);
}

global.baseURL = "https://flappybird.brandonplank.org";

console.log("Bot is logging in")
client.login(auth);

const prefix = "!";
client.on("messageCreate", function(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length)
    const args = commandBody.split(' ')
    const command = args.shift().toLowerCase()

    if(command === "restorescore") {
        if(!isAdmin(message)) {
            return message.reply("You do not have permission to use this command")
        }
        if(args.length != 2) {
            return message.reply("This command takes in 2 argumants\nUSAGE !restorescore <userid> <score>")
        }
        request.get({
            url: `${baseURL}/v1/auth/restoreScore/${args[0]}/${args[1]}`,
            headers: {"Authorization": craftAuthHeader(username, password)}
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    const iAction = client.interactions.get(interaction.customId);
    if (!iAction) return;
    try {
        await iAction.execute(interaction);
    } catch (error) {
        console.error(error);
        await iAction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

global.editInteraction = async (interaction, response) => {
    // Set the data as embed if reponse is an embed object else as content
    const data = typeof response === 'object' ? { embeds: [ response ] } : { content: response };
    // Get the channel object by channel id:
    const channel = await client.channels.resolve(interaction.channel_id);
    // Edit the original interaction response:
    return axios
        .patch(`https://discord.com/api/v8/webhooks/${cfg.clientId()}/${interaction.token}/messages/@original`, data)
        .then((answer) => {
            try {
                channel.messages.fetch(answer.data.id)
            } catch (e) {
            }
        })
};

global.Bird = {
    isJson: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    isAdmin: function (message) {
        return message.member.roles.cache.find(r => r.id === "954092482243727391")
    },
    craftAuthHeader: function (username, password) {
        const str = `${username}:${password}`
        return `Basic ${btoa(str)}`
    }
}