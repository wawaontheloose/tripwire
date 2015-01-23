'use strict';

angular.module('nytApp')
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, middleman, clickedToBegin) {

    $scope.formValidation = function(cell, email) {
      var toReturn = false;
      if(cell.length !== 12) toReturn = true;
      if(cell.split('-').length !== 3) toReturn = true;
      if(email.split('@').length !== 2) toReturn = true;
      if(email.indexOf('@') > 0 && email.split('@')[1].split('.').length !== 2) toReturn = true;
      toReturn = false;
      return toReturn;
    }

    $scope.ok = function () {
      middleman();
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
      clickedToBegin.status = false;
    };

  })
  .controller('MainCtrl', function ($scope, $http, socket, $modal, $interval, $timeout) {

    var canvas = document.getElementById("canvas-blended");
    $scope.cameraOn = false;
    $scope.clickedToBegin = { status: false };
    $scope.manualStop = false;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 5;
    var camMotion = CamMotion.Engine({
      canvasSource: canvas
    });
    camMotion.on("error", function (e) {
      console.log("error", e);
    });
    camMotion.on("frame", function () {
      var point = camMotion.getMovementPoint(true);
      // draw a circle
      var image = new Image();
      image.src = document.getElementById("canvas-blended").toDataURL('image/png');
      $scope.screenshot = image;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI*2, true);
      ctx.closePath();
      if (camMotion.getAverageMovement(point.x-point.r/2, point.y-point.r/2, point.r, point.r)>4) {
        console.log('what what what what')
        ctx.fill();
      } else {
        ctx.stroke();
      }
    });

    $scope.startWatching = function() {
      var email = $scope.email;
      var cell = $scope.cell;
      $scope.cameraOn = true;
      document.getElementsByTagName('canvas')[0].width = 640;
      document.getElementsByTagName('canvas')[0].height = 480;
      camMotion.start();
      $scope.x = 10;
      $interval(function(){
        if($scope.x > 0 && camMotion.intervalCount()) $scope.x--;
        if($scope.x == 3) document.getElementsByTagName('audio')[0].play();
      }, 1000)
    }

    $scope.stopCamera = function() {
      document.getElementsByTagName('video')[0].src = '';
      document.getElementsByTagName('video')[0].pause();
      camMotion.stop();
      $scope.manualStop = true;
    }

    $scope.open = function (size) {
      $scope.clickedToBegin.status = true;
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        windowClass: 'modal-background',
        size: size,
        resolve: {
          middleman: function () {
            return $scope.startWatching;
          },
          clickedToBegin: function() {
            return $scope.clickedToBegin;
          }
        }
      });
    }

  });