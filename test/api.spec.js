var frisby = require('frisby');

var URL = 'http://localhost:8080';

/*frisby.create('test')
    .get(URL + '/api/questions/eQtjUq')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('0', {
        '_id': String,
        'title': String,
        'url': String,
        'option_1': String,
        'option_2': String,
        '__v': Number,
        '_r': Object,
        'isPrivate': Boolean,
        'reported': Boolean,
        'nsfw': Boolean,
        'date': String,
        'option_2_votes': Number,
        'option_1_votes': Number,
        'creator': String
    })
.toss();*/

frisby.create('GET JSON data from an endpoint')
  .get('http://httpbin.org/get')
  .expectStatus(200)
  .expectHeader('Content-Type', 'application/json')
  .expectJSON({ 'url': 'http://httpbin.org/get' })
.toss();