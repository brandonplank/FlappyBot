const { SlashCommandBuilder} = require('@discordjs/builders');
const Discord = require("discord.js");
const request = require("request");
const cfg = require("../local")

module.exports = {
    data: new SlashCommandBuilder().setName('unban').setDescription('Unbans a user based on their ID')
        .addStringOption(option => option.setName('userid').setDescription('ID of the user').setRequired(true)),
    async execute(interaction) {
        if(!Bird.isAdmin(interaction)) {
            interaction.reply("You do not have the correct permissions for this command")
        }
        const id = interaction.options.getString(`userid`) || null;
        request.get({
            url: `${baseURL}/v1/auth/unban/${id}`,
            headers: {"Authorization": Bird.craftAuthHeader(cfg.botUsername(), cfg.botPassword())}
        }, function(error, response, body){
        })
        interaction.reply("Waiting for API..")
    },
};