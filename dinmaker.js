include('/utils.js');
var server = require("http_server.js");
var haml = require("haml.js");
var listeners = {};

// This is the handler for long-poll requests.  We don't want to respond to these right away, but wait till
// there is something to report.  We will set up an event listener that closes the connection upon an event.
function long_poll(req, res, username) {
 listeners[username] = function (message) {
   puts(JSON.stringify({username: username, message: message}));
   res.finish();
 }
}

function send_message(req, res, username, message) {
  for (name in listeners) {
    if (listeners.hasOwnProperty(name)) {
      (listeners[name])(message);
    }
  }
 puts("Message" + message);
 res.finish();
}


// Serve js, css, and png files as static resources
server.get(/^(\/.+\.(?:js|css|png|ico|tci))$/, function (req, res, path) {
 server.staticHandler(req, res, "public" + path);
});

// Render the login window
server.get(/^\/$/, function (req, res) {
 haml.render({}, 'login.haml', function (html) {
   res.simpleHtml(200, html);
 });
});

// Render the chat interface
server.get(/^\/([^\/]*)$/, function (req, res, username) {
 haml.render({username: username}, 'interface.haml', function (html) {
   res.simpleHtml(200, html);
 });
});


// Handle long_poll requests
server.get(/^\/listen\/(.*)$/, long_poll);

// Handle new messages
server.post(/^\/message\/(.*)$/, send_message, 'plain');

server.listen(9292);
