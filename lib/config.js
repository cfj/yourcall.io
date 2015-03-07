var mongoose       = require('mongoose'),
    questionSchema = require('./question').questionSchema;

var dbName;

switch (process.env.NODE_ENV) {
    case 'development':
        dbName = 'questions';
        break;
    case 'test':
        dbName = 'testdb'
        break;
}

var db = mongoose.createConnection('localhost', dbName);

module.exports = {
    getModel: function () {
        return db.model('Question', questionSchema);
    }
};