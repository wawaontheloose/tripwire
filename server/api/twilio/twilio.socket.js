/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Twilio = require('./twilio.model');

exports.register = function(socket) {
  Twilio.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Twilio.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('twilio:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('twilio:remove', doc);
}