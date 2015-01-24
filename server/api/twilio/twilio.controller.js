'use strict';

var _ = require('lodash');
var Twilio = require('./twilio.model');
var accountSid = 'AC445cc2f5f308b28894ed302ca2ad9ce6';
var authToken = "54719376e1d7c8c56ff914efd17aaa21";
var client = require('twilio')(accountSid, authToken);

exports.contactUser = function(req, res) {
  var cellArr = [];
  req.body.cell.split('-').forEach(function(part){
    cellArr.push(part);
  })
  var cellNum = "+1" + cellArr.join("");
  console.log("cellNum", cellNum)
  client.messages.create({
    body: "We caught someone sneakin' around! Check your email for evidence! - Tripwire",
    to: cellNum,
    from: "+12676993413"
  }, function(err, message) {
      console.log(err);
  });
}

// Get list of twilios
exports.index = function(req, res) {
  Twilio.find(function (err, twilios) {
    if(err) { return handleError(res, err); }
    return res.json(200, twilios);
  });
};

// Get a single twilio
exports.show = function(req, res) {
  Twilio.findById(req.params.id, function (err, twilio) {
    if(err) { return handleError(res, err); }
    if(!twilio) { return res.send(404); }
    return res.json(twilio);
  });
};

// Creates a new twilio in the DB.
exports.create = function(req, res) {
  Twilio.create(req.body, function(err, twilio) {
    if(err) { return handleError(res, err); }
    return res.json(201, twilio);
  });
};

// Updates an existing twilio in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Twilio.findById(req.params.id, function (err, twilio) {
    if (err) { return handleError(res, err); }
    if(!twilio) { return res.send(404); }
    var updated = _.merge(twilio, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, twilio);
    });
  });
};

// Deletes a twilio from the DB.
exports.destroy = function(req, res) {
  Twilio.findById(req.params.id, function (err, twilio) {
    if(err) { return handleError(res, err); }
    if(!twilio) { return res.send(404); }
    twilio.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
