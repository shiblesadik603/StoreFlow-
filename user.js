

function fetchUserData(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (typeof id === "number" && id > 0) {
                resolve({
                    id: id,
                    name: "User" + id,
                });
            } else {
                reject(new Error("Invalid id"));
            }
        }, 1000);
    });
}

module.exports = fetchUserData;