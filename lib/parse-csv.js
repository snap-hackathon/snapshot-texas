"use strict";

var csv = require("csv");

/**
 * Reads a CSV file, calling the callback with the data found
 *
 * @param  {String}   fileName            The name of the CSV file to parse
 * @param  {String}   rowToMatchItemValue A value to match the row to parse
 * @param  {Number}   rowToMatchItemIndex The index within the row of the value to match
 * @param  {Array}    columns             An array of column names and indexes to pull
 *                                        from the CSV
 * @param  {Boolean}  matchAll            Set to true if we should match all rows,
 *                                        false to just match the first
 * @param  {Function} callback            Called with two arguments: the first an
 *                                        optional error, the second either an object
 *                                        of row values, or an array of objects with
 *                                        row values (depending on the value of
 *                                        <code>matchAll</code>)
 */
module.exports.parse = function(fileName, rowToMatchItemValue, rowToMatchItemIndex, columns, matchAll, callback) {
    var foundRow, allMatches;

    foundRow = false;

    // used if we're matching on multiple rows
    allMatches = [];

    csv().from.path(__dirname + "/../csv/" + fileName, {
        delimiter: ",",
        escape: '"'
    })
    // when a record is found in the CSV file (a row)
    .on("record", function(row, index) {
        var item, value, rowValues;

        // skip the header row
        if (index === 0) {
            return;
        }

        item = row[rowToMatchItemIndex].trim();
        if (item.toLowerCase() !== rowToMatchItemValue.toLowerCase()) {
            // skip it, not our item
            return;
        }

        // if we got here, we found the right row
        foundRow = true;

        // grab the row values in our object
        rowValues = {};
        for (var i = 0; i < columns.length; i++) {
            value = row[columns[i].index].trim();
            value = value.replace(/\$/, "");
            value = value.replace(/\#/, "");
            rowValues[columns[i].name] = value;
        }

        // if we match all rows that have our item to match, then
        // we keep looking. If not, and we're only matching on the
        // first occurrance, we stop here and return
        if (matchAll) {
            // add this rowValues to our matches
            allMatches.push(rowValues);
        } else {
            // we're done, no errors
            callback(null, rowValues);
        }
    })
    // when the end of the CSV document is reached
    .on("end", function() {
        if (foundRow) {
            if (matchAll) {
                // return all our matches
                callback(null, allMatches);
            } else {
                // do nothing, we've already returned
            }
        } else {
            callback({
                code: 404,
                message: "Unable to find data for " + rowToMatchItemValue
            });
        }
    })
    // if any errors occur
    .on("error", function(error) {
        callback(error);
    });
};

/**
 * Finds a column index within the columns object.  Throws an exception
 * if the index can not be found.
 *
 * @param  {String} columnName The name of the column to find
 * @param  {Array}  columns    The columns to search
 * @return {Number}            The column index
 */
module.exports.findColumnIndex = function(columnName, columns) {
    var columnIndex, i;

    for (i = 0; i < columns.length; i++) {
        if (columns[i].name.toLowerCase() === columnName.toLowerCase()) {
            columnIndex = columns[i].index;
            break;
        }
    }

    if (columnIndex < 0) {
        throw new Error("Unable to find column index for columnName: " + columnName);
    }

    return columnIndex;
};
