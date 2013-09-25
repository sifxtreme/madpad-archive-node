var express = require('express');
var app = express();

var randomstring = require('randomstring');

// connect to database
var mongoose = require ("mongoose");

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/madpad';

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

var userSchema = new mongoose.Schema({
  url: String,
  password: String
});

var User = mongoose.model('users', userSchema);

// Creating one user.
var a = new User ({
  url: "Asif",
  password: "Magic"
});

a.save(function (err) {if (err) console.log ('Error on save!')});

var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.cookieParser('yaokdlusndpiux'));
app.use(express.session());
app.use(express.csrf());

app.use(express.static('public'));

app.get('/', function(request, response) {
	var a = User.find({})
	response.send(JSON.stringify(a, undefined, 2));
  // response.render('index', {random: randomstring.generate(3)});
});
app.get('/:id', function(request, response){
	response.render('pad', {id: request.params.id, token: request.session._csrf});
});

app.post('/:id', function(request, response){
var name = request.body.name;
response.send(name)

});

var port = process.env.PORT || 5000;
app.listen(port);