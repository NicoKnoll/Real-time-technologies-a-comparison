var express = require('express');
var app = express();


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


/* ----- GLOBAL STORED STATUS ----- */

var events = require("events");
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

global.storedStatus = '';

function updateStoredStatus(status) {
	global.storedStatus = status;
	ee.emit("onUpdateStoredStatus", status);
}


/* ----- AJAX ----- */

app.get('/ajax/', function (req, res) {
	res.sendFile(__dirname + '/public/ajax.html');
});

app.get('/ajax/ping/', function (req, res) {
	res.send(global.storedStatus);
});


/* ----- WEBSOCKET ----- */

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({host: '127.0.0.1', port: 3000});
var connections = [];
 
wss.on('connection', function(connection) {
	console.log('client connected...');

	connections.push(connection);

	connection.on('message', function(message) {
		console.log('received message from client: ' + message);
		updateStoredStatus(message);
	});
});

ee.on("onUpdateStoredStatus", function(status) {
	// Broadcast

	console.log(connections, connections.length);

	for(var i = 0; i < connections.length; i++) {
		console.log('sent');
		connections[i].send(status);
	}

});

app.get('/websocket/', function (req, res) {
	res.sendFile(__dirname + '/public/websocket.html');
});


/* ----- Server Sent events ----- */

app.get('/sse/', function (req, res) {
	res.sendFile(__dirname + '/public/sse.html');
});

app.get('/sse/stream/', function(req, res) {
	//send headers for event-stream connection
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	
	ee.on("onUpdateStoredStatus", function(status) {
		res.write('data: ' + JSON.stringify({ msg : global.storedStatus }) + '\n\n');
	});

	res.write('id\n\n');
});



/* ---- GOOOOOOO ----- */

app.listen(3000, function () {
	console.log('DEMO listening on port 3000!');
});