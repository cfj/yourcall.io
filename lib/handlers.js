var mongoose          = require('mongoose'),
    Schema            = mongoose.Schema,
    Cookies           = require('cookies'),
    sha1              = require('sha1'),
    generateId        = require('./util').generateId,
    randomCoordinates = require('./util').randomCoordinates,
    salt              = require('./salt');


module.exports = {
    getAll: function (Question) {
        return function (req, res) {
            Question.find(function (err, questions) {
                if (err) {
                    res.send(err);
                }

                res.json(questions);
            });
        };
    },
    getRandom: function (Question) {
        return function (req, res) {
            var query = Question.find();

            query.where('isPrivate', false);

            query.where('_r', {
                    $near: {$geometry: { type: 'Point', coordinates: randomCoordinates() }}
                });

            query.limit(1);

            query.exec(function (err, question) {
                if (err) {
                    res.send(err);
                }

                res.send(question[0].url);
            });
        };
    },
    getQuestion: function (Question) {
        return function (req, res) {
            Question.findOne({ url: req.params.question_url }, function (err, question) {
                if (err) {
                    console.log(err);
                    //res.send(err);
                } else if (!question) {
                    res.send(404, 'Question not found!');
                }

                res.json(question);

            });
        };
    },
    createQuestion: function (Question) {
        return function (req, res) {
            var cookies = new Cookies(req, res);

            var owned = cookies.get('own_q'),
                cookieToSet = '';

            var urlId = generateId(6),
                creator = req.body.creator ? req.body.creator : 'Anonymous';

            var hash = sha1(urlId + salt);

            var expiryDate = new Date();

            expiryDate.setDate(expiryDate.getDate() + 365*5);

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

                cookies.set('own_q', cookieToSet, { httpOnly: false, expires: expiryDate } );

                res.json(question);
            });
        };   
    },
    reportQuestion: function (Question) {
        return function (req, res) {
            Question.findOneAndUpdate({
                '_id' : req.params.question_id
            },{
                reported: true
            }, function (err, question) {
                if (err) {
                    res.send(err);
                }

                res.json({'success': 'true'});
            });
        };   
    },
    getReported: function (Question) {
        return function (req, res) {
            Question.find({'reported' : true}, function (err, questions) {
                if (err) {
                    res.send(err);
                }

                res.json(questions);
            });
        };   
    },
    voteOnQuestion: function (Question) {
        return function (req, res) {
            //cookie test
            var cookies = new Cookies(req, res);

            var votes = cookies.get('votes'),
                cookieToSet = '',
                responseToSend = {'success': 'true'};

            var expiryDate = new Date();

            expiryDate.setDate(expiryDate.getDate() + 365);

            if (!votes) {
                cookieToSet = req.params.question_url;
            } else if (votes.indexOf(req.params.question_url) === -1) {
                cookieToSet = votes + ':' + req.params.question_url;
            } else {
                responseToSend = {'success': 'false'};
            }

            if (req.params.vote === '1'){
                if (cookieToSet) {
                    Question.findOneAndUpdate({'url': req.params.question_url},
                        {$inc: {'option_1_votes' : 1}},
                     function (err, question) {
                        if (err) {
                            res.send(err);
                        }
                        cookies.set('votes', cookieToSet, { httpOnly: false, expires: expiryDate } );
                        res.json(responseToSend);
                    });
                } else {
                    res.json(responseToSend);
                }
            } else if (req.params.vote === '2') {
                if (cookieToSet) {
                    Question.findOneAndUpdate({'url': req.params.question_url},
                        {$inc: {'option_2_votes' : 1}},
                     function (err, question) {
                        if (err) {
                            res.send(err);
                        }
                            cookies.set('votes', cookieToSet, { httpOnly: false, expires: expiryDate } );
                        res.json(responseToSend);
                    });
                } else {
                    res.json(responseToSend);
                }
            }
        }   
    },
    deleteQuestion: function (Question) {
        return function (req, res) {
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

                        res.json({'success': 'true'});
                    });
                } else {
                    res.json({'success': 'false'});
                }

            });
        };   
    }
};