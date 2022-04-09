const { SlashCommandBuilder} = require('@discordjs/builders');
const Discord = require("discord.js");
const request = require("request");
const cfg = require("../local")
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('Get a user profile from their UUID')
        .addStringOption(option => option.setName('userid').setDescription('ID of the user').setRequired(true)),
    async execute(interaction) {
        const id = interaction.options.getString(`userid`) || null;
        request.get({
            url: `${baseURL}/v1/user/${id}`,
        }, function (error, response, body) {
            if (Bird.isJson(body)) {
                const jsonBody = JSON.parse(body)
                if (error || response.statusCode != 200) {
                    return interaction.reply(jsonBody.message)
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
                return interaction.reply({embeds: [user]})
            }
            return interaction.reply(body)
        })
    },
};