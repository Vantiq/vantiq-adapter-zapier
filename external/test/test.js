//
// Test that loads in the request bundle for a Twitter Tweet and
// tests the result.
//
var fs = require('fs');

//
// Load Zap script which injects the "Zap" variable.
//
eval(fs.readFileSync('../ZapScript.js', { encoding: 'utf8' }));

//
// Load the tweet request bundle
//
var bundle = require('./TwitterTweetBundle.json');

//
// Compute the request from the bundle
//
var request = Zap.PublishData_pre_write(bundle);

//
// Look at the transformed action_fields
//
var content = JSON.parse(JSON.parse(request.data).content);
console.log(content);
