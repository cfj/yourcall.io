var mongoose       = require('mongoose'),
    request        = require('supertest'),
    express        = require('express'),
    handler        = require('../lib/handlers'),
    questionSchema = require('../lib//question').questionSchema;

var app = require('../lib/server');

var db = mongoose.createConnection('localhost', 'testdb');
var Question = db.model('Question', questionSchema);

describe('Questions', function () {
    var currentQuestion;

    beforeEach(function (done) {
        Question.create({
            title: 'Test question title',
            url: 'urlId',
            creator: 'creator',
            option_1: 'req.body.option_1',
            option_2: 'req.body.option_2',
            isPrivate: 'req.body.isPrivate'
        }, function (err, question) {
            done();
        });
    });
/*
    afterEach(function (done) {
        Question.remove({}, function () {
            done();
        });
    });
*/
    it('responds with json', function (done) {
        request(app)
            .get('/api/questions/uMqiVp')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(/afsd/, done);
    });
});