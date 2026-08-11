const fetchUserData = require("./user");

async function main() {
    try {
        const user = await fetchUserData(5);
        console.log(user);
    } catch (error) {
        console.log(error.message);
    }

    try {
        const user = await fetchUserData(-1);
        console.log(user);
    } catch (error) {
        console.log(error.message);
    }
}

main();