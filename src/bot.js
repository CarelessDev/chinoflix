// @ts-check
// Thaksin Check

import dotenv from "dotenv";
dotenv.config();

import { Client, GuildMember, Intents } from "discord.js";
import { DiscordTogether } from "discord-together";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

const discordTogether = new DiscordTogether(client);

const commands = {
  chinoflix: {
    command: "youtube",
    description: "Start Netflix",
  },
  fuyuchess: {
    command: "chess",
    description: "Play Chess",
  },
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const member = interaction.member;
  if (!(member instanceof GuildMember)) return;

  if (!(interaction.commandName in commands)) return;

  const invite = await discordTogether.createTogetherCode(
    member.voice.channel.id,
    commands[interaction.commandName].command
  );

  await interaction.reply(`${invite.code}`);
});

client.login(process.env.DISCORD_TOKEN);

const guildIdS = process.env.GUILD_ID.split(";");

client.on("ready", () => {
  console.log(`Caffe Latte Caffe Mocha Cappuchino ${client.user.tag}`);

  for (const guildId of guildIdS) {
    console.log(`Registering Slash Command for ${guildId}`);
    const guild = client.guilds.cache.get(guildId);

    try {
      for (const command in commands) {
        guild.commands.create({
          name: command,
          description: commands[command].description,
        });
      }
    } catch (err) {
      console.log(`${guildId} is invalid : ${err}`);
    }
  }

  client.user.setActivity({
    name: "Chinoflix",
    type: "WATCHING",
  });
  setInterval(
    () =>
      client.user.setActivity({
        name: "Chinoflix",
        type: "WATCHING",
      }),
    300000
  );
});
