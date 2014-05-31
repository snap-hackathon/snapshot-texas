/*var csv = require("ya-csv");
var reader = csv.createCsvFileReader("Cost_of_Food.csv", {
                                                'separator': ',',
                                                'quote': '"',
                                                'escape': '"',  
                                                'comment': ''
                                             });
reader.addListener('data', function(data) {
                console.log(data);
        });
*/

var request = require("request"),
csv = require("csv");
 
module.exports = function(app) {
	// accepts the POST form submit of the CSV file
	app.post("/upload/data", function(req, res) {
		// the name under "files" must correspond to the name of the
		// file input field in the submitted form (here: "csvdata")
		csv().from.path(req.files.csvdata.path, {
		delimiter: ",",
		escape: '"'
		})
		// when a record is found in the CSV file (a row)
		.on("record", function(row, index) {
		var firstName, lastName;
		 
		// skip the header row
		if (index === 0) {
		return;
		}
		 
		// read in the data from the row
		firstName = row[0].trim();
		lastName = row[1].trim();
		 
		// perform some operation with the data
		// ...
		})
		// when the end of the CSV document is reached
		.on("end", function() {
		// redirect back to the root
		res.redirect("/");
		})
		// if any errors occur
		.on("error", function(error) {
		console.log(error.message);
		});
	});
};