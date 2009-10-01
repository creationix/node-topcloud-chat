/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery*/

TC.defineController("Demo", function (username) {
  
  var $ = jQuery, self = this, messages = [], users = {};
	
	this.bindData("selected_users", {value: {}});
	this.bindData("new_message", {value: ""});
	
	this.send_message = function () {
	  var message = self.new_message.get();
	  if (message === '') {
	    return;
	  }
	  $.ajax({
      type: "POST",
      url: "/message/" + username,
      processData: false,
      data: message
    });
    self.new_message.set("");
	}
	
	this.table_model = {
	  get_num_rows: function () {
	    return 2;
	  },
	  get_value_at: function (row_index, column) {
	    return ["Tim", "Bob"][row_index];
	  }
	};
	
	function long_poll() {
	  $.ajax({
      type: "POST",
      url: "/listen/" + username,
      success: function (data) {
        console.log(data);
        long_poll();
      },
      error: function (err) {
        console.error("Long-Poll Error, retrying in 10 seconds...");
        setTimeout(long_poll, 10000);
      }
    });
	}
	
	// Kick off the long poll process on load
	$(long_poll);

});
