include('/utils.js');
var server = require("http_server.js");
var haml = require("haml.js");

// haml.render({}, 'interface.haml', function (html) {
//   puts(html);
// });


// This is the handler for long-poll requests.  We don't want to respond to these right away, but wait till
// there is something to report.  We will set up an event listener that closes the connection upon an event.
function long_poll(req, res, username) {
 
}

function send_message(req, res, username, message) {
 puts("Message" + message);
 res.close();
}


// Render the interface.haml file for requests to the base path
server.get(/^\/$/, function (req, res) {
 haml.render({}, 'interface.haml', function (html) {
   res.simpleHtml(200, html);
 });
});

// Serve js, css, and png files as static resources
server.get(/^(\/.+\.(?:js|css|png|ico|tci))$/, function (req, res, path) {
 server.staticHandler(req, res, "public" + path);
});

// Handle long_poll requests
server.get(/^\/listen\/(.*)$/, long_poll);

// Handle new messages
server.post(/^\/message\/(.*)$/, send_message, 'plain');

server.listen(9292);
