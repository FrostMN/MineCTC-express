var request = require('request');
// var moment = require('moment');

/* Makes requests to mojangs api service using request.
A callback checks for errors and then calls a method to
process the JSON and return a page to the client.
If today is specified, fetch today's image,
otherwise, fetch a random image. */

var playerNameToUuidUrl = 'https://api.mojang.com/profiles/minecraft';

function playerExists(playerName, callback) {

    var options = {
        uri :playerNameToUuidUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: [playerName],
    };

    //Use request module to request picture from Mojang service.
    //Must handle result in callback.
    request( options, function(error, mojang_response, body){

        if (!error && mojang_response.statusCode === 200){

            // console.log(body[0]);

            if (body.length > 0 ) {
                var json = body[0];
                callback(true, json)
            } else {
                callback(false)
            }
        } else {
            //Log error info to console and return error with message.
            console.log("Error in JSON request: " + error);
            console.log(mojang_response);
            console.log(body);
            callback(Error("Error fetching data from the MOJANG service"));
        }
    });
}

// playerExists("asouer", function (exists, json) {
//     if (exists) {
//         console.log("player exists");
//         console.log(json.id)
//     } else {
//         console.log(" no player exists")
//     }
// });


module.exports = mojang = {
    playerExists: playerExists
};