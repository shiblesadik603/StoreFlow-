const os = require("os");

const serverName = "BackendJourney";

function getGreeting(name) {
    return `Hello from ${name}!`;
}

console.log(getGreeting(serverName));

console.log(os.platform());

console.log(os.freemem());