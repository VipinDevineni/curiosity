var fs = require('fs'),
  url = require('url'),
  http = require('http'),
  path = require('path'),
  mime = require('mime'),
  io = require('socket.io'),
  myUtil = require('./public/js/util');

var httpServer = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  if(pathname == "/") pathname = "index.html";
  var filename = path.join(process.cwd(), 'public', pathname);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found");
      response.end();
      return;
    }

    response.writeHead(200, { 'Content-Type': mime.lookup(filename) });
    fs.createReadStream(filename, {
      'flags': 'r',
      'encoding': 'binary',
      'mode': 0666,
      'bufferSize': 4 * 1024
    }).addListener("data", function(chunk) {
      response.write(chunk, 'binary');
    }).addListener("close", function() {
      response.end();
    });
  });
});

httpServer.listen(process.env.PORT || 8080, "0.0.0.0");
console.log('Server running at 8080');

var userPreferenceMap = {};
var globalPreferenceMap = {};
var webSocket = io.listen(httpServer);

webSocket.sockets.on('connection', function(socket) {
  //console.dir(socket);
  var endpoint = socket.manager.handshaken[socket.id].address;
  console.log('Client connected from: ' + endpoint.address + ":" + endpoint.port);

  if(!userPreferenceMap.hasOwnProperty(endpoint.address)) {
    preferences = [];
    preferences[0] = undefined;
    preferences[1] = undefined;
    preferences[2] = undefined;
    preferences[3] = undefined;
    userPreferenceMap[endpoint.address] = preferences;
  }

  //1. emit the user preferences of the user
  socket.on('initialize me', function(callBack) {
    console.log('vipin - get my preferences - enter');
    if(userPreferenceMap.hasOwnProperty(endpoint.address)) {
      //callBack(userPreferenceMap[endpoint.address]);
      var data = {key: endpoint.address,
                  preferences: userPreferenceMap[endpoint.address]};
      callBack(data);
    }
    console.log('vipin - get my preferences - exit');
  });
  
  //2. listen for preference update
  socket.on('update my preference', function(removedPreferences, selectedPreference) {
    console.log('vipin - update my preference - enter');
    pref = userPreferenceMap[endpoint.address];
    if(pref) {
      myUtil.updatePreference(removedPreferences, selectedPreference, pref, globalPreferenceMap);
      //socket.emit('my preferences', userPreferenceMap[endpoint.address]);
      //3. broadcast the updated preference
      //socket.emit('updated preferences', globalPreferenceMap);
      socket.broadcast.emit('updated global preferences', globalPreferenceMap);
      var data = {key: endpoint.address,
                  preferences: pref};
      socket.broadcast.emit('your preferences', data);
    }
    console.log('vipin - update my preference - exit');
  });

  //4. send requested global preferences
  socket.on('request global preferences', function(sendData) {
    console.log('vipin - request global preferences - enter');
    sendData(globalPreferenceMap);
    console.log('vipin - request global preferences - exit');
  });
});

