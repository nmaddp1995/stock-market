var express = require('express');
var app = express();
var request = require('request');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var stocks = ['FB'];

var port = process.env.PORT || 8080;



app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/getStockData', function(req, res) {
  var parameters = {
        Normalized: false,
        NumberOfDays: 3650,
        DataPeriod: "Day",
        Elements: [{Symbol: req.query.symbol,Type: "price",Params: ["ohlc"]}]
    };
  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters='+JSON.stringify(parameters);

request.get({
    url: url,
    json: true,
    headers: {
        'Content-Type': 'application/json'
    }
}, function (e, r, b) {
  if(b.Dates){
    res.json(b);
    
  } else {
    res.json("error");
  }
      
        
});
});

app.get('/getStocks', function(req, res) {
  console.log(req.query.inp);
   var url = 'http://dev.markitondemand.com/api/v2/Lookup/json?input='+req.query.inp;

request.get({
    url: url,
    json: true,
    headers: {
        'Content-Type': 'application/json'
    }
}, function (e, r, b) {
       
        res.send(b);
});
});

io.on('connection', function(socket){
  socket.send(JSON.stringify( { type: 'history', data: stocks} ));
  socket.on('chat message', function(msg){
    console.log("chat message "+msg);
    stocks.push(msg);
    io.emit('chat message', msg);
  });
  socket.on('remove message', function(msg){
    console.log("remove message "+msg);
    for(var j = 0; j < stocks.length; j++) {
      	if(stocks[j] === msg) {
      		stocks.splice(j, 1);
      		break;
      	}
      }
      io.emit('remove message', msg);
  });
});

server.listen(port, function() {
  console.log("Server is running");
});
