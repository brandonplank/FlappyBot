const { SlashCommandBuilder} = require('@discordjs/builders');
const Discord = require("discord.js");
const request = require("request");

module.exports = {
    data: new SlashCommandBuilder().setName('getid').setDescription('Gets a users ID from their name')
        .addStringOption(option => option.setName('name').setDescription('Name of the user').setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString(`name`) || null;
        request.get({url: `${global.baseURL}/v1/getID/${name}`}, function(error, response, body){
            if(Bird.isJson(body)) {
                const jsonBody = JSON.parse(body)
                interaction.reply(jsonBody.message)
            }
            interaction.reply(body)
        })
    },
};