/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*globals TC, jQuery*/

TC.defineController("Demo", function (params) {
	
	this.bindData("selected_users", {value: {}});
	this.table_model = {
	  get_num_rows: function () {
	    return 1;
	  },
	  get_value_at: function (row_index, column) {
	    return "Tim";
	  }
	  
	  
	  
	};

});
