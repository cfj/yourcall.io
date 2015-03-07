process.env.NODE_ENV = 'test';

var config   = require('../lib/config')
    request  = require('supertest'),
    app      = require('../lib/server');
    Question = config.getModel();

describe('Questions', function () {
    beforeEach(function (done) {
        Question.create({
            title: 'Test question title',
            url: '12345',
            creator: 'John Doe',
            option_1: 'Option 1',
            option_2: 'Option 2',
            isPrivate: false
        }, function (err, question) {
            done();
        });
    });

    afterEach(function (done) {
        Question.remove({}, function () {
            done();
        });
    });

    it('responds with json', function (done) {
        request(app)
            .get('/api/questions/12345')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});