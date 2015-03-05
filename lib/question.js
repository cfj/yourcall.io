var mongoose = require('mongoose'),
    random   = require('mongoose-random');

var questionSchema = new mongoose.Schema({
    title: String,
    url: String,
    creator: { type: String, default: 'Anonymous'},
    option_1: String,
    option_1_votes: { type: Number, default: 0},
    option_2: String,
    option_2_votes: { type: Number, default: 0},
    date: { type: Date, default: Date.now },
    nsfw: { type: Boolean, default: false},
    reported: { type: Boolean, default: false},
    isPrivate: { type: Boolean, default: false}
});

questionSchema.plugin(random(), { path: '_r' });

module.exports.questionSchema = questionSchema;