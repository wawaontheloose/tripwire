'use strict';

describe('Service: mandrill', function () {

  // load the service's module
  beforeEach(module('nytApp'));

  // instantiate service
  var mandrill;
  beforeEach(inject(function (_mandrill_) {
    mandrill = _mandrill_;
  }));

  it('should do something', function () {
    expect(!!mandrill).toBe(true);
  });

});
