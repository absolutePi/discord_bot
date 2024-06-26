//run by typing "node ." in the terminal
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Read forbidden strings from text.txt
let forbiddenStrings = [];
const readForbiddenStrings = () => {
  fs.readFile('text.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Could not read text.txt: ${err}`);
      return;
    }
    forbiddenStrings = data.split(/\r?\n/).filter(line => line.trim() !== '');
  });
};
readForbiddenStrings();

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const found = forbiddenStrings.find(str => message.content.includes(str));

  if (found) {
    // Remove the string from forbiddenStrings and update text.txt
    forbiddenStrings = forbiddenStrings.filter(str => str !== found);
    fs.writeFile('text.txt', forbiddenStrings.join('\n'), (err) => {
      if (err) {
        console.error(`Could not write to text.txt: ${err}`);
        return;
      }
      console.log(`Deleted string from text.txt: ${found}`);
    });
    message.reply(`The string "${found}" was found and deleted from text.txt.`)
      .catch(console.error);
  } else {
    message.reply('No such string found in text.txt.')
      .catch(console.error);
  }
});

client.login(token);
