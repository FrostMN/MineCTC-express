let secrets = require('../utilities/secrets');

var mongoose = require('mongoose');
var bycrypt = require('bcrypt-nodejs');


// TODO unique constraint on:
// TODO username
// TODO email
// TODO mc_name
// TODO mc_uuid

var userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String
    },

    twitter : {
        id: String,
        token: String,
        displayName: String,
        username: String
    },

    editDate: {
        type: Date,
        default: Date.now()
    },

    info: {
        first_name: String,
        last_name: String,
        mc_name: String,
        mc_uuid: String,
        admin: { type: Boolean, default: false },
        email: String,
        emailSent: { type: Date, default: Date.now() },
        verify_string: { type: String, default: secrets.generateToken() },
        verified: { type: Boolean, default: false },
        rules: { type: Boolean, default: false },
        banned: { type: Boolean, default: false }
    }
});

userSchema.methods.generateHash = function (password) {
    // Generate Salted Hash
    return bycrypt.hashSync(password, bycrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function (password) {

    return bycrypt.compareSync(password, this.local.password);
};


User = mongoose.model('User', userSchema);

module.exports = User;

