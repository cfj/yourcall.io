// http://scotch.io/tutorials/javascript/creating-a-single-page-todo-app-with-node-and-angular

//Setup
var express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    random   = require('mongoose-random'),
    Cookies  = require('cookies'),
    sha1     = require('sha1'),
    gzippo   = require('gzippo'),
    Schema   = mongoose.Schema;

//Config

mongoose.connect('mongodb://localhost/questions');

app.configure(function () {
    app.use(gzippo.staticGzip(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function noCache(req, res, next){

        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires",0);
        next();
    });
});


//kanske ha ett värde i schemat som heter url, och som innehåller typ rr42FE
var questionSchema = new Schema({
    title: String,
    url: String,
    creator: { type: String, default: "Anonymous"},
    option_1: String,
    option_1_votes: { type: Number, default: 0},
    option_2: String,
    option_2_votes: { type: Number, default: 0},
    date: { type: Date, default: Date.now },
    nsfw: { type: Boolean, default: false},
    reported: { type: Boolean, default: false},
    isPrivate: { type: Boolean, default: false}
    //random: {type: Number, default: function(){return Math.random();}}
});

questionSchema.plugin(random(), { path: '_r' });

var Question = mongoose.model('Question', questionSchema);

//Helpers

function generateId(len) {
    var id = '',
        possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        listLength = possibleChars.length;

    for (var i = 0; i < len; i++) {
        id += possibleChars.charAt(Math.floor(Math.random() * listLength));
    }

    return id;
}

//Routes

//API
//Get all questions
app.get('/api/questions', function (req, res) {
    Question.find(function (err, questions) {
        if (err) {
            res.send(err);
        }

        res.json(questions);
    });
});

var randCoords = function () { return [Math.random(), Math.random()] };
//Return a random question, kan kanske använda detta för att returnera många genom att ändra limit
app.get('/api/random', function (req, res) {

    var query = Question.find();

    query.where('isPrivate', false);

    query.where("_r", {
            $near: {$geometry: { type: 'Point', coordinates: randCoords() }}
        });

    query.limit(1);

    query.exec(function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json(question);
    });
    
    
    

    //Old random
    /*
    Question.findRandom(function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json(question);
    });
    */

});

//get a specific question
app.get('/api/questions/:question_url', function (req, res) {
    Question.findOne({ url: req.params.question_url }, function (err, question) {
        if (err) {
            console.log(err);
            //res.send(err);
        } else if (!question) {
            res.send(404, 'Question not found!');
        }

        res.json(question);

    });
});

//Create question
var salt = 'uvgeM9MWMYb4ssg7gzhS';
app.post('/api/questions', function (req, res) {

    var cookies = new Cookies(req, res);

    var owned = cookies.get('own_q'),
        cookieToSet = '';



    var urlId = generateId(6),
        creator = req.body.creator ? req.body.creator : 'Anonymous';

    var hash = sha1(urlId + salt);

    Question.create({
        title: req.body.title,
        url: urlId,
        creator: creator,
        option_1: req.body.option_1,
        option_2: req.body.option_2,
        isPrivate: req.body.isPrivate
    }, function (err, question) {
        if (err) {
            res.send(err);
        }

        if (!owned) {
            cookieToSet = question._id + ':' + hash + '|';
        } else {
            cookieToSet = owned + question._id + ':' + hash + '|';
        }

        cookies.set('own_q', cookieToSet, { httpOnly: false, expires: new Date(2015,4,01) } );

        res.json(question);
    });



    /*
    var urlId = generateId(6),
        creator = req.body.creator ? req.body.creator : 'Anonymous';

    Question.create({
        title: req.body.title,
        url: urlId,
        creator: creator,
        option_1: req.body.option_1,
        option_2: req.body.option_2,
        isPrivate: req.body.isPrivate
    }, function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json(question);
    });
    */
});

app.put('/api/report/:question_id', function (req, res) {
    Question.findOneAndUpdate({
        "_id" : req.params.question_id
    },{
        reported: true
    }, function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json({"success": "true"});
    });
});

app.get('/api/reported', function (req, res) {
    Question.find({"reported" : true}, function (err, questions) {
        if (err) {
            res.send(err);
        }

        res.json(questions);
    });
});

//Vote on a question
app.put('/api/vote/:question_url/:vote', function (req, res) {

    //cookie test
    var cookies = new Cookies(req, res);

    var votes = cookies.get('votes'),
        cookieToSet = '',
        responseToSend = {"success": "true"};

    if (!votes) {
        cookieToSet = req.params.question_url;
    } else if (votes.indexOf(req.params.question_url) === -1) {
        cookieToSet = votes + ':' + req.params.question_url;
    } else {
        responseToSend = {"success": "false"};
    }




    if (req.params.vote === '1'){
        if (cookieToSet) {
            Question.findOneAndUpdate({"url": req.params.question_url},
                {$inc: {"option_1_votes" : 1}},
             function (err, question) {
                if (err) {
                    res.send(err);
                }
                cookies.set('votes', cookieToSet, { httpOnly: false, expires: new Date(2015,4,01) } );
                res.json(responseToSend);
            });
        } else {
            res.json(responseToSend);
        }
    } else if (req.params.vote === '2') {
        if (cookieToSet) {
            Question.findOneAndUpdate({"url": req.params.question_url},
                {$inc: {"option_2_votes" : 1}},
             function (err, question) {
                if (err) {
                    res.send(err);
                }
                    cookies.set('votes', cookieToSet, { httpOnly: false, expires: new Date(2015,4,01) } );
                res.json(responseToSend);
            });
        } else {
            res.json(responseToSend);
        }
    }
});

//delete your own question
app.delete('/api/delete/:question_id', function (req, res) {
    var cookies = new Cookies(req, res),
        verify = req.query.verify;

    Question.findOne({ _id: req.params.question_id }, function (err, question) {
        if (err) {
            console.log(err);
        }

        var url = question.url,
            hash = sha1(url + salt);

        if (hash === verify) {
            Question.remove({
                _id: req.params.question_id
            }, function (err, question) {
                if (err) {
                    res.send(err);
                }

                res.json({"success": "true"});
            });
        } else {
            res.json({"success": "false"});
        }

    });
});

//delete a question (for admin)
app.get('/api/xn7qW7bSErR53kxBeRPbzD0JNtyE5b/:question_id', function (req, res) {
    Question.remove({
        _id: req.params.question_id
    }, function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json({"success": "true"});
    });
});

//make a question private (for admin)
app.get('/api/QHVNaLzGYZoUwY3A202Ia5G4S5vPtg/:question_id', function (req, res) {
    Question.findOneAndUpdate({ _id: req.params.question_id}, { isPrivate: true }, function (err, question) {
        if (err) {
            res.send(err);
        }

        res.json({"success": "true"});
    });
});

//Application

app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

//Show all questions
app.get('/show/ruMiT6ZxWIwRKj4ktQSgddFnkYqqbX', function (req, res) {
    res.sendfile('./public/partials/vnONfNvVQrTa6UPRABNrz5mq1SBLMG.html');
});

//Show reported questions
app.get('/show/kbamNaFJ4wyl5poBrBMoxruX9FPdGS', function (req, res) {
    res.sendfile('./public/partials/73DRIj56vz2sV44BEwiMgerdaF4RjG.html');
});

app.get('/:question_url', function (req, res) {
    res.redirect('/#' + req.params.question_url);
});

/*
app.get('*', function (req, res) {
    res.redirect('/');
});
*/

//Listen (start app with node server.js)

app.listen(8080);
console.log('App listening on port 8080');