let crypto = require('crypto');

function generateToken(size = 16) {
    return crypto.randomBytes(size).toString('hex');
}

let secrets = {
    generateToken: generateToken
};

module.exports = secrets;
