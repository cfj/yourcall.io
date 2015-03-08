process.env.NODE_ENV = 'test';

var config   = require('../lib/config')
    request  = require('supertest'),
    should   = require('should'),
    app      = require('../lib/server');
    Question = config.getModel();

describe('Questions API', function () {
    beforeEach(function (done) {
        Question.create({
            title: 'Test question one title',
            url: '12345',
            creator: 'John Doe',
            option_1: 'Option 1',
            option_2: 'Option 2',
            isPrivate: false
        }, function (err, question) {
            Question.create({
                title: 'Test question two title',
                url: 'abcde',
                creator: 'Jane Doe',
                option_1: 'Option One',
                option_2: 'Option Two',
                isPrivate: false
            }, function (err, question) {
                done();
            });
        });
    });

    afterEach(function (done) {
        Question.remove({}, function () {
            done();
        });
    });

    it('should respond with json', function (done) {
        request(app)
            .get('/api/questions')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should return the question with the specified id', function (done) {
        request(app)
            .get('/api/questions/abcde')
            .end(function (err, res) {
                res.body.title.should.equal('Test question two title');
                res.body.creator.should.equal('Jane Doe');
                done();
            });
    });

    it('should create a question', function (done) {
        var testQuestion = {
            title: 'New question',
            option_1: 'test1',
            option_2: 'test2',
            isPrivate: false
        };

        request(app)
            .post('/api/questions')
            .send(testQuestion)
            .end(function (err, res) {
                res.body.title.should.equal('New question');
                done();
            });
    });

    it('should vote on a question', function (done) {
        var agent = request(app);

        agent.put('/api/vote/12345/1').end(function () {
            agent.get('/api/questions/12345').end(function (err, res) {
                res.body.option_1_votes.should.equal(1);
                done();
            });
        });
    });

    it('should respond with 404 for a non-existing question', function (done) {
        request(app)
            .get('/api/question/xnzxm') 
            .expect(404, done);
    });

    it('should return a random question', function (done) {
        request(app)
            .get('/api/random')
            .end(function (err, res) {
                (res.text === '12345' || res.text === 'abcde').should.be.true;
                done();
            });
    });
});