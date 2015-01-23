'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MandrillSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Mandrill', MandrillSchema);