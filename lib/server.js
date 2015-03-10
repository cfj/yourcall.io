process.env.NODE_ENV = 'development';

var express        = require('express'),
    app            = express(),
    gzippo         = require('gzippo'),
    path           = require('path'),
    handler        = require('./handlers'),
    config         = require('./config'),
    Question       = config.getModel();


//Config
app.configure(function () {
    app.use(gzippo.staticGzip(path.join(__dirname, '../public')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function noCache(req, res, next){
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
        next();
    });
});

app.get('/api/questions', handler.getAll(Question));
app.get('/api/random', handler.getRandom(Question));
app.get('/api/questions/:question_url', handler.getQuestion(Question));
app.get('/api/reported', handler.getReported(Question));

app.post('/api/questions', handler.createQuestion(Question));

app.put('/api/report/:question_id', handler.reportQuestion(Question));
app.put('/api/vote/:question_url/:vote', handler.voteOnQuestion(Question));

app.delete('/api/delete/:question_id', handler.deleteQuestion(Question));

app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

app.get('/q/:question_url', function (req, res) {
    res.redirect('#/q/' + req.params.question_url);
});

app.get('/q/:question_url/result', function (req, res) {
    res.redirect('#/q/' + req.params.question_url + '/result');
});

app.get('/:question_url', function (req, res) {
    if(req.params.question_url === 'ask') {
        res.redirect('#/ask');
    }
    
    res.redirect('#/q/' + req.params.question_url);
});

app.listen(8080);
console.log('App listening on port 8080');

module.exports = app;