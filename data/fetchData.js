+function(undefined) {
"use strict";

var request = require("request")
,   jsdom   = require("jsdom")
,   Promise = require("bluebird");

var total = 12321
,   arr = [];

for (var i = 12321; i <= total; i++)
{
  arr.push(function(pageIndex) {
    var defer = Promise.defer();
    
    jsdom.env({
      url: "http://ndb.nal.usda.gov/ndb/foods/show/" + pageIndex + "?format=Full",
      scripts: ["http://code.jquery.com/jquery-2.1.4.min.js"],
      done: function(err, window) {
        console.log(pageIndex);
        if (err) {
          defer.resolve();
          return;
        }
        
        var $ = window.$;
        
        var recordName
        ,   recordGroup;
        
        if ($(".errors").length === 0) {
          var newRecord = {};
          
          var parts = $("#view-name").text().split(',');
          parts.shift();
          
          recordName = parts.join(',').trim();
          
          recordGroup = $(".dialog .prop:nth-child(1) .value").text().trim();
          
          console.log(recordName, recordGroup);
          newRecord["name"] = recordName;
          newRecord["group"] = recordGroup;
          newRecord['nutrient'] = {};
          
          var $records = $(".odd").filter(function() {
            return $(this).css("display") !== "none";
          });
          
          for (var j = 0; j < $records.length; j++)
          {
            var $record = $($records[j])
            ,   nutrientName = $record.children("td:nth-child(1)")
              .clone().children().remove().end().text().trim()
            ,   unit = $record.children("td:nth-child(2)").text().trim()
            ,   value = $record.children("td:nth-child(3)").text().trim();
            
            newRecord['nutrient'][nutrientName] = value + '/' + unit;
          }
          
          request.post({
            url: "http://localhost:3001/api/foods",
            form: {food: JSON.stringify(newRecord)}
          }, function(err, httpResponse, body) {
            if (err) {
              console.log(err);
            }            
            
            defer.resolve();
          });
        } else {
          defer.resolve();
        }
      }
    });
    
    return defer.promise;
  }.bind(null, i));
}

arr.reduce(function(previous, current) {
  return previous.then(current);
}, Promise.cast());

}();