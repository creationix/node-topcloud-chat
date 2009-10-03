/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery*/

TC.defineController("Demo", function (username) {
  
  var $ = jQuery, self = this, messages = [], users = {}, since = Date.now() - 60000 * 5;
	
	this.bindData("selected_users", {value: {}});
	this.bindData("new_message", {value: "Test"});
	this.bindData("chat_log", {value: format_conversation()});
	this.bindData("title", {value: "Logged in as\"" + username + "\""});
	this.table_model = {
	  get_num_rows: function () {
	    return 2;
	  },
	  get_value_at: function (row_index, column) {
	    return ["Tim", "Bob"][row_index];
	  }
	};

	function format_conversation() {
	  if (messages.length > 0) {
  	  since = messages[messages.length - 1][0];
	  }
	  var haml = messages.map(function (message) {
	    var user = message[1];
	    var css;
	    if (user === 'System') {
	      css = 'system';
	    } else {
	      css = (user === username) ? "self" : "other";
	    }
	    return ["%dl", {title: Date(message[0])},
	      ["%dt." + css, user],
	      ["%dd", message[2]]
      ];
	  });
	  return haml;
	}
	
	this.send_message = function () {
	  var message = self.new_message.get();
	  if (message === '') {
	    return;
	  }
	  $.ajax({
      type: "POST",
      url: "/message/" + username,
      contentType: 'text/plain',
      processData: false,
      data: message
    });
    self.new_message.set("");
	}
	
	
	// This recursive function keeps the long poll running
	function long_poll() {
	  $.ajax({
      type: "POST",
      dataType: 'json', 
      url: "/listen/" + username,
      contentType: 'application/json',
      processData: false,
      data: since + "",
      success: function (data) {
        // Append the new messages to the message log
        data.forEach(function (message) { messages.push(message); });
    	  // Update the display
        self.chat_log.set(format_conversation());
        // Kick off a new long_poll request
        long_poll();
      },
      error: function (err) {
        if (console && console.error) {
          console.error("Long-Poll Error, retrying in 10 seconds...");
        }
        setTimeout(long_poll, 10000);
      }
    });
	}
	
	// Kick off the long poll process on load and pull in all messages for the last 5 minutes
	this.onload = long_poll;

});
