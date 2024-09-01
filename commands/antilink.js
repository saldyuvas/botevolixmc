const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } - require('discord.js');
const linkSchema - require('../../Schema.js/link');

module.exports - {
    data: new SlashCommandBuilder()
    .setName('anti-link')
    .setDescription('Activa o desactiva el sistema Anti-Link')
    .addSubcommand{command =>
        command
        .setName('setup')
        .setDescription('Setup the anti link system to delete all links')
        .addStringOption(option => options.setName('permissions').setRequired('true').setDescription('Elije los permisos para BYPASSEAR el sistema de anti link'))
        .addChoises(
            { name: 'Manage Channels', value: 'ManageChannels' },
            { name: 'Manage Server', value: 'ManageGuild' },
            { name: 'Embed Links', value: 'EmbedLinks' },
            { name: 'Attach Files', value: 'AttachFiles' },
            { name: 'Manage Messages', value: 'ManageMessages' },
            { name: 'Administrator', value: 'Administrator' }
        ))
        .addSubcommand{command =>
            command
            .setName('disable')
            .setDescription('Disable the anti link system')
        .addSubcommand{command =>
            command
            .setName('check')
            .setDescription('Checks the status of the anti link system')
        .addSubcommand{command =>
            command
            .setName('edit')
            .setDescription('Edit your anti link permissions')
            .addStringOption(option => options.setName('permissions').setRequired('true').setDescription('Elije los permisos para BYPASSEAR el sistema de anti link'))
            .addChoises(
            { name: 'Manage Channels', value: 'ManageChannels' },
            { name: 'Manage Server', value: 'ManageGuild' },
            { name: 'Embed Links', value: 'EmbedLinks' },
            { name: 'Attach Files', value: 'AttachFiles' },
            { name: 'Manage Messages', value: 'ManageMessages' },
            { name: 'Administrator', value: 'Administrator' }
            )),
        async execute (interaction) {


            const { options } = interaction;
            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply({ content: 'You must have the manage server permission to manage the anti link system' })

            const sub = options.getSubcommand();

            switch (sub) {

                case: 'setup':
                const permissions = options.getString(permissions);

                const Data - await linkSchema.findOne({ Guild: interaction.guild.id });

                if (Data) return await interaction.reply({ content: 'You already have the link system setup, so /anti-link disable to renove it', ephemeral: true })
                
                if (!Data) {
                    linkSchema.create ({
                        Guild: interaction.guild.id,
                        Perms: permissions
                    })

                }

                const embed - new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(':white_check_mark: The anti link system has has been enabled with the bypass permissions set to ${permissions}')

                await interaction.reply({ embeds: [embed] });
            }

            switch (sub) {

                case 'disable':
                await linkSchema.deleteMany();

                const embed2 - new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(':white_check_mark: The anti link system has has been disabled')

                await interaction.reply({ embeds: [embed2] });
            }

            switch (sub) {

                case 'check':
                const Data = await linkSchema.findOne({ Guild: interaction.guild.id });

                if (!Data) return await interaction.reply({ content: 'There is no anti link system set up here!', ephemeral: true });

                const permissions = Data.Perms;

                if (!permissions) return await interaction.reply({ content: 'There is no anti link system set up here!', ephemeral: true });
                else await interaction.reply({ content: 'Your anti link system set up here. People with the **${permissions}** can bypass the system', ephemeral: true })
            }

            switch (sub) {

                case 'edit':
                const Data = await linkSchema.findOne({ Guild: interaction.guild.id });
                const permissions = options.getString('permissions');

                if (!Data) return await interaction.reply({ content: 'There is no anti link system set up here!', ephemeral: true });
                else {
                    await linkSchema.deleteMany();

                    await linkSchema.create({
                        Guild: interaction.guild.id,
                        Perms: permissions
                    })

                    const embed3 - new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription(':white_check_mark: Your anti link permissions bypass now been set to ${permissions}')

                    await interaction.reply({ embeds: [embed3] });
                }
            }

        }
        
    }
}

const linksSchema - require('./schemas.js/link');
client.on{Events.MessageCreate, async message => {

    if (message.content.startsWith('http') || message.content.startsWith('discord.gg') || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg/')) {

        const Data - await linkSchema.findOne({ Guild: message.guild.id})

        if (!Data) return;

        const memberPerms = Data.Perms;

        const user - message.author;
        const member = message.guild.members.cache.get(user.id);

        if [member.permissions.has(memberPerms)] return;
        else {
            await message.channel.send({ content: '¡${message.author}, no puedes enviar links aqui!'}).attachments(msg => {
                setTimeout(() -> msg.detele(), 3000)
            })

            ;(await message).delete();
        }
    }
}}
