const { Client, MessageEmbed } = require('discord.js');
const { get } = require('axios');
require('dotenv').config();

const client = new Client();

const serverStatus = {};
const servers = ['Oto Mustam', 'Ombre', 'Crocabulia', 'Jahash', 'Thanatena', 'Nidas', 'Rubilax', 'Merkator', 'Furye', 'Mériana', 'Écho', 'Brumen', 'Atcham', 'Julith', 'Pandore', 'Ilyzaelle', 'Ush', 'Agride'];

client.on('ready', async () => {
    const alertChannel = await client.channels.cache.find(channel => channel.name === 'alerte-modo');

    setInterval(async () => {
        for (const server of servers) {
            try {
                if (!serverStatus[server]) serverStatus[server] = false;
                const channel = await client.channels.cache.find(channel => channel.name.includes(server));
                const response = await get(`https://panel.snowbot.eu/api/moderatorCheckerPC/checkModerator.php?gameServer=${encodeURIComponent(server)}`);
                const status = response.data === 'moderatorChecker = true';

                if (status !== serverStatus[server]) {
                    if (status) {
                        const embed = new MessageEmbed()
                            .setTitle(server)
                            .setColor('RED')
                            .setDescription(`Il y a un modérateur sur **${server}**`)
                            .setTimestamp();
                        alertChannel.send(embed);
                        console.log(`Il y a un modérateur sur ${server}`);
                        channel.setName(`🔴 ${server}`);
                    } else {
                        const embed = new MessageEmbed()
                            .setTitle(server)
                            .setColor('GREEN')
                            .setDescription(`Il n'y a plus de modérateur sur **${server}**`)
                            .setTimestamp();
                        alertChannel.send(embed);
                        console.log(`Il n'y a plus de modérateur sur ${server}`);
                        channel.setName(`🟢 ${server}`);
                    }
                }

                serverStatus[server] = status;
            } catch {}
        }
    }, 5000);
});

client.login(process.env.TOKEN);