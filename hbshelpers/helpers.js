var Handlebars = require("hbs");
var markdown = require("markdown").markdown;


// the following "switch" helpers are adapted from
// https://github.com/wycats/handlebars.js/issues/927

function SWITCH(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this); // Process the body of the switch block
    delete this._switch_value_;
    return html;
}

function CASE(value, options) {
    if (value === this._switch_value_) {
        return options.fn(this);
    }
}

// end of block of code being credited

function parseMarkdown( markDownString ) {
    return new Handlebars.SafeString( markdown.toHTML( markDownString ));
}

module.exports = {
    switch: SWITCH,
    case: CASE,
    parseMarkdown: parseMarkdown
};
