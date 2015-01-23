/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mandrill = require('./mandrill.model');

exports.register = function(socket) {
  Mandrill.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mandrill.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mandrill:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mandrill:remove', doc);
}