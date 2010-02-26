process.mixin(require('sys'));
var server = require("node-router");
var haml = require("haml");
var fs = require('fs');
var listeners = {};
var messages = [[Date.now(), 'System', 'Chat Server Started Up']];

// This is the handler for long-poll requests.  We don't want to respond to these right away, but wait till
// there is something to report.  We will set up an event listener that closes the connection upon an event.
function long_poll(req, res, username, since) {
  var timeout;
  function send_update() {
    clearTimeout(timeout);
    res.simpleJson(200, messages.filter(function (message) {
      return message[0] > since;
    }));
  }
  // Close long poll after 100 seconds
  timeout = setTimeout(send_update, 100000);
  // Close long poll when there is new data too.
  listeners[username] = [since, send_update];
  notify();
}

function notify() {
  var last = 0;
  if (messages.length > 0 ) {
    last = messages[messages.length - 1][0];
  }
  for (name in listeners) {
    if (listeners.hasOwnProperty(name)) {
      if (last > listeners[name][0]) {
        (listeners[name][1])();
      }
    }
  }
}

function send_message(req, res, username, message) {
  res.simpleJson(200, true);
  messages.push([Date.now(), username, message]);
  notify();
}


// Serve js, css, and png files as static resources
server.get(/^(\/.+\.(?:jpg|js|css|png|ico|tci))$/, function (req, res, path) {
 server.staticHandler(req, res, __dirname + "/public" + path);
});

// Render the login window
server.get(/^\/$/, function (req, res) {
  fs.readFile(__dirname + '/interface.haml', function (err, text) {
   res.simpleHtml(200, haml.render(text));
  });
});


// Handle long_poll requests
server.post(/^\/listen\/([^\/]*)$/, long_poll, 'json');

// Handle new messages
server.post(/^\/message\/([^\/]*)$/, send_message, 'plain');

server.listen(7000);
