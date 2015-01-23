'use strict';

var _ = require('lodash');
var Mandrill = require('./mandrill.model');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('r7WRzIXqZC2ZNXcaq_KF0A');

exports.contactUser = function(req, res) {
  console.log('request to contactuser')
  var attachments = [];
  req.body.evidence.forEach(function(encodedStr){
    // console.log('split')
    // var buff = new Buffer(encodedStr.split(',')[1], 'base64');
    attachments.push({
      "type": "image/png",
      "name": "evidence.png",
      "content": encodedStr.split(',')[1]
    });
  })
  var message = {
      "subject": "Tripwire: Someone's been sneaking around in your space!",
      "from_email": "trip@wire.com",
      "from_name": "Tripwire",
      "to": [{
              "email": req.body.email,
              "name": "Agent 007"
          }],
      "important": false,
      "track_opens": true,
      "auto_html": false,
      "preserve_recipients": true,
      "merge": false,
    "attachments": attachments
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
  }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
}

// Get list of mandrills
exports.index = function(req, res) {
  Mandrill.find(function (err, mandrills) {
    if(err) { return handleError(res, err); }
    return res.json(200, mandrills);
  });
};

// Get a single mandrill
exports.show = function(req, res) {
  Mandrill.findById(req.params.id, function (err, mandrill) {
    if(err) { return handleError(res, err); }
    if(!mandrill) { return res.send(404); }
    return res.json(mandrill);
  });
};

// Creates a new mandrill in the DB.
exports.create = function(req, res) {
  Mandrill.create(req.body, function(err, mandrill) {
    if(err) { return handleError(res, err); }
    return res.json(201, mandrill);
  });
};

// Updates an existing mandrill in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mandrill.findById(req.params.id, function (err, mandrill) {
    if (err) { return handleError(res, err); }
    if(!mandrill) { return res.send(404); }
    var updated = _.merge(mandrill, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, mandrill);
    });
  });
};

// Deletes a mandrill from the DB.
exports.destroy = function(req, res) {
  Mandrill.findById(req.params.id, function (err, mandrill) {
    if(err) { return handleError(res, err); }
    if(!mandrill) { return res.send(404); }
    mandrill.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
