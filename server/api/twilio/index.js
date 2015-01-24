'use strict';

var express = require('express');
var controller = require('./twilio.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.contactUser);
router.post('/abort', controller.userAborted);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
