var mongoose = require('mongoose');

var ruleSchema = mongoose.Schema({
    editDate: {
        type: Date,
        default: Date.now()
    },

    data: {
        body: {
            type: String
        }
    }
});

Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
