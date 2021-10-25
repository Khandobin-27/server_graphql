//This file just shows separately how to obtain a JSON file
const https = require('https');

let url = "https://jsonplaceholder.typicode.com/users";

https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            console.log(json[0].name)
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});
