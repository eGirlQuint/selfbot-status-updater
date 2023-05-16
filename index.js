const { Client, Discord } = require('discord.js-selfbot-v13');
const statuses = require('./config.json').statuses
const statusstate = require('./config.json').statustype
const statusdelayinput = require('./config.json').statusdelay
const token = require('./config.json').token
let statusIndex = 0;

const client = new Client({
    checkUpdate: false,
});

if (typeof statusdelayinput !== 'number' || isNaN(statusdelayinput)) {
    console.log('=================\nInvalid number provided in config file for: statusdelayinput\n=================');
    process.exit()
  }

  if (statusdelayinput < 600) {
    console.log(`WARNING: Statusdelay is set to ${statusdelayinput}, minumum recommended value is 600 seconds`);
  }

  if(statusstate !== 'idle' && statusstate !== 'dnd' && statusstate !== 'online') {
    console.log('=================\nPlease provide a valid status type in the config file!\nValid status types: idle, dnd, online\n=================')
    process.exit()
  }
  if(statuses.length == 0) {
    console.log('=================\nPlease define 1 or more custom statuses\n=================')
    process.exit()
  }

const statusdelay = statusdelayinput * 1000

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.username}!`);
  if(statuses.length == 1){
    console.log('=================\nOnly 1 status detected, keeping alive not updating!\n=================')
    await client.settings.setCustomStatus({ text: statuses[0], status: statusstate, expires: null });
    return
  }
  if(statuses.length > 1){
    console.log(`=================\nMultiple statuses detected, updating every ${statusdelayinput} seconds!\n=================`)
  updateStatus();
  }
  else{
    console.log('=================\nAn unexpeced error occured, please check the config file!\n=================')
    process.exit()
  }
})

async function updateStatus() {
    try {
    if (statusIndex >= statuses.length) {
      statusIndex = 0; // Reset the index if it exceeds the length of the statuses array
    }
    const status = statuses[statusIndex];
    await client.settings.setCustomStatus({ text: status, status: statusstate, expires: null });
    statusIndex++;
    console.log('Changed status: ' + status + ', ' + statusstate)
    await wait(statusdelay); // Wait for 2000 seconds
    updateStatus(); // Recursive call to update the status
} catch(error){
    console.log("Error setting status:" + error)
}
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


client.login(token).catch(() => { // If the token is invalid return a message
    console.log("=================\nERROR: The token provided is invalid\n=================")
    process.exit()
  })