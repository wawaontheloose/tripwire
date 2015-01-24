'use strict';

angular.module('nytApp')
  .factory('mandrill', function ($http) {
    // Public API here
    return {
      contactUser: function (cell, email, evidence) {
        var userInfo = { cell: cell, email: email, evidence: evidence };
        return $http.post('/api/mandrill', userInfo);
      }
    };
  });
