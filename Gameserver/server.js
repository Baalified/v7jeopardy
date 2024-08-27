const net = require('net');
var bodyParser=require('body-parser');
var express=require('express');
const { BADNAME } = require('dns');

// Array to store connected buzzers
var buzzers = [
  {
    name: '0',
    uniqueId: undefined,
    socket: undefined,
    color: 'LED 255 128 000'
  },
  {
    name: '1',
    uniqueId: undefined,
    socket: undefined,
    color: 'LED 000 000 255'
  },
  {
    name: '2',
    uniqueId: undefined,
    socket: undefined,
    color: 'LED 000 255 000'
  },
  {
    name: '3',
    uniqueId: undefined,
    socket: undefined,
    color: 'LED 255 000 255'
  }
];
// Flag to determine if a buzzer press can be handled
var canBuzz = true;

const ledServer = net.createServer((socket) => {
  console.log('Buzzer connected:', socket.remoteAddress);

  // Get the buzzer's unique identifier (e.g., MAC address)
  const uniqueId = socket.remoteAddress; // You can replace this with MAC if you have it

  // Check if this buzzer was already connected before
  let buzzer = buzzers.find(b => b.uniqueId === uniqueId);
  if (!buzzer) {
    // New buzzer, add to the array with a name and unique ID
    for(var i=0; i<buzzers.length; i++) {
      buzzer = buzzers[i];
      if(buzzer.uniqueId == undefined || buzzer.uniqueId == '') {
        buzzer.uniqueId = uniqueId;
        buzzer.socket = socket;
        break;
      }
    }
    console.log(`New buzzer added: ${buzzer.name}`);
    updateBuzzerState();
  } else {
    // Reconnected buzzer, update the socket
    buzzer.socket = socket;
    console.log(`Buzzer reconnected: ${buzzer.name}`);
    updateBuzzerState();
  }

  // Handle incoming data from the buzzer
  socket.on('data', (data) => {
    if(curGameData && curGameData.activequestion && !curGameData.activeplayer) {
      const message = data.toString().trim();
      console.log(`${buzzer.name} sent: ${message}`);

      if (message === 'BUZZ') {
        console.log(`${buzzer.name} buzzed in!`);

        io.emit("buzz", {player: buzzer.name});
        lightsOff(buzzer.name);
        buzzer.socket.write("LED 255 255 255\n");
        curGameData.activeplayer = curGameData.players[buzzer.name];
      }
    }
  });

  // Handle buzzer disconnection
  socket.on('end', () => {
    console.log(`Buzzer disconnected: ${buzzer.name}`);
  });

  // Handle socket errors
  socket.on('error', (err) => {
    console.error(`Socket error with ${buzzer.name}:`, err);
  });
});

// Start the server
ledServer.listen(8080, '0.0.0.0', () => {
  console.log('LED Server listening on port 8080');
});


var tingodb=require('tingodb')();
var app=express();
var http = require('http').Server(app);
var io=require("socket.io")(http);
var exec = require('child_process').exec;

// Initializing Database and Table games
var db=new tingodb.Db(__dirname + '/db', {});
var games = db.collection("games");

// Variable to store current Gamedata serverside
var curGameData;

// Add folder /public to HTTP Server
app.use(express.static(__dirname + "/public"));
// Configure JSON Parser for HTTP Server
app.use(bodyParser.json());

// Define GameMaster view at /gm

app.get("/gm", function(req, res) {
  if(process.env.MULTI)
    res.sendFile(__dirname + "/public/index_multi.html");
  else
    res.sendFile(__dirname + "/public/index_4pl.html");
});

app.get("/", function(req, res) {
  if(process.env.MULTI)
    res.sendFile(__dirname + "/public/index_multi.html");
  else
    res.sendFile(__dirname + "/public/index_4pl.html");
});

// Initialize Socket.IO connection and setup Socket
io.on('connection', function(socket){
  console.log('a client connected');
  
  // On initial connect send Games List and Current Game State to connected client
  games.find().toArray(function(err, docs) {
    // Initialize Games List
    socket.emit('initGamesList', docs);
    // Set Gamemaster Mode based on URI
    socket.emit('setgm', socket.handshake.headers.referer && (socket.handshake.headers.referer.endsWith("/gm") || socket.handshake.headers.referer.endsWith("/multigm")));
    // Send current Game State
    socket.emit('gamedata', curGameData);
  });

  socket.on('buzz', function(buzzdata) {
    console.log("BUZZ!");
    console.log(buzzdata);
    io.emit('buzz', buzzdata);
    curGameData.activeplayer = curGameData.players[buzzdata.player];
    lightsOff(buzzdata.player);
  });

  // When an update to the current Game State is received...
  socket.on('gamedata', function(gamedata) {
    console.log("Publishing Gamedata...");
    console.log(gamedata);
    // ...save Game State in Database
    games.save(gamedata, function(err, doc){
        console.log("Saved");
        console.log(err);
        console.log(doc);
      });
    // ...publish Game State to all clients connected
    io.emit('gamedata', gamedata);
    // ...update Game State in runtime server
    curGameData=gamedata;

    updateBuzzerState();
  });

  // Reload Games List
  socket.on("getGameList", function() {
    games.find().toArray(function(err, docs) {
      io.emit('initGamesList', docs);
    });
  });

  socket.on("videoQuestionPlay", function() {
    io.emit('videoQuestionPlay');
  });

  socket.on("videoQuestionReplay", function() {
    io.emit('videoQuestionReplay');
  });
  
  socket.on("videoQuestionStop", function() {
    io.emit('videoQuestionStop');
  });
  
  socket.on("audioQuestionPlay", function() {
    io.emit('audioQuestionPlay');
  });

  socket.on("audioQuestionReplay", function() {
    io.emit('audioQuestionReplay');
  });
  
  socket.on("audioQuestionStop", function() {
    io.emit('audioQuestionStop');
  });

  socket.on("toggleSplash", function(splash) {
    io.emit('toggleSplash', splash);
  });

  socket.on("showSolution", function() {
    io.emit("showSolution");
  });

  socket.on("themePlay", function() {
    io.emit("themePlay");
  });

  socket.on("themeStop", function() {
    io.emit("themeStop");
  });

  socket.on("themeToggle", function(vol) {
    io.emit('themeToggle', vol);
  });
  
});

function updateBuzzerState() {
  if(!curGameData)
    return;

  // If there is no active question, disable Buzzers and turn all lights off
  if(!curGameData.activequestion) {
    lightsOff();
  }

  // If there is an active question but no active Player yet, turn all lights on
  if(curGameData.activequestion && !curGameData.activeplayer) {
    lightsOn();
  }

  if(curGameData.activequestion && curGameData.activeplayer) {
    lightsOff( curGameData.players.indexOf(curGameData.activeplayer) );
  }
}

// Turn lights on all Buzzers off - if keepOn is supplied, keep that buzzers light on
function lightsOff(keepOn) {
  if(!curGameData)
    return;
  buzzers.forEach(function(buzzer, idx) {
    if(idx != keepOn) {
      // Surrounding with try/catch as gpio can throw exceptions when not fully initialized yet
      try {
        if(buzzer.socket != undefined) {
          buzzer.socket.write("LED 000 000 000"+"\n");
        }
      }catch(e){}
    } else {
      try {
        if(buzzer.socket != undefined) {
          buzzer.socket.write("LED 255 255 255"+"\n");
        }
      }catch(e){}
    }
  });
}

// Turn lights on all Buzzers on - if keepOn is supplied, keep that buzzers light on
function lightsOn() {
  if(!curGameData)
    return;
  buzzers.forEach(function(buzzer, idx) {
    // Surrounding with try/catch as gpio can throw exceptions when not fully initialized yet
    try {
      if(buzzer.socket != undefined) {
        buzzer.socket.write(buzzer.color+"\n");
        console.log("Sent "+buzzer.color+" to Buzzer "+buzzer.name);
      }
    }catch(e){}
  });
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
