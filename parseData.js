var csv = require("ya-csv");
var reader = csv.createCsvFileReader("Cost_of_Food.csv", {
                                                'separator': ',',
                                                'quote': '"',
                                                'escape': '"',  
                                                'comment': ''
                                             });
reader.addListener('data', function(data) {
                console.log(data);
        });