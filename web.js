var express = require('express');
var app = express();

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.render('index');
});
app.get('/:id', function(request, response){
	response.render('pad',{id: request.params.id});
});

var port = process.env.PORT || 5000;
app.listen(port);