const { SlashCommandBuilder} = require('@discordjs/builders');
const Discord = require("discord.js");
const request = require("request");
const cfg = require("../local")

module.exports = {
    data: new SlashCommandBuilder().setName('restorescore').setDescription('Restores a users score based on their ID')
        .addStringOption(option => option.setName('userid').setDescription('ID of the user').setRequired(true))
        .addIntegerOption(option => option.setName('score').setDescription('Integer for new score').setRequired(true)),
    async execute(interaction) {
        if(!Bird.isAdmin(interaction)) {
            interaction.reply("You do not have the correct permissions for this command")
        }
        const id = interaction.options.getString(`userid`) || null;
        const score = interaction.options.getInteger(`score`) || null;
        request.get({
            url: `${baseURL}/v1/auth/restoreScore/${id}/${score}`,
            headers: {"Authorization": Bird.craftAuthHeader(cfg.botUsername(), cfg.botPassword())}
        }, function(error, response, body){
        })
        interaction.reply("Waiting for API..")
    },
};