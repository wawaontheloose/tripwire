'use strict';

angular.module('nytApp')
  .factory('twilio', function ($http) {

    // Public API here
    return {
      contactUser: function (cell) {
        return $http.post('/api/twilio', { cell : cell });
      }
    };
  });
