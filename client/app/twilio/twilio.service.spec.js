'use strict';

describe('Service: twilio', function () {

  // load the service's module
  beforeEach(module('nytApp'));

  // instantiate service
  var twilio;
  beforeEach(inject(function (_twilio_) {
    twilio = _twilio_;
  }));

  it('should do something', function () {
    expect(!!twilio).toBe(true);
  });

});
