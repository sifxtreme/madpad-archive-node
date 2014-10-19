var express = require('express');
var app = express();

var randomstring = require('randomstring');

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.render('index', {random: randomstring.generate(3)});
});
app.get('/:id', function(request, response){
	response.render('pad', {id: request.params.id});
});

app.listen(1337);
