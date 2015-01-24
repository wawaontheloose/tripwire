/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Twilio = require('./twilio.model');
var eventMachine = require('./eventMachine');

exports.register = function(socket) { //their pattern...
  eventMachine.on('userAborted', function(data) {
    socket.emit("userAborted", data)
  })
}
