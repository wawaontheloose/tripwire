'use strict';

angular.module('nytApp')
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, middleman) {

    $scope.ok = function () {
      middleman();
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  })
  .controller('MainCtrl', function ($scope, $http, socket, $modal) {

    var canvas = document.getElementById("canvas-blended");
    $scope.cameraOn = false;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 5;

    console.log("Inintializing");
    var camMotion = CamMotion.Engine({
      canvasBlended: canvas
    });
    console.log(camMotion);
    camMotion.on("error", function (e) {
      console.log("error", e);
    });
    console.log(camMotion);
    camMotion.on("streamInit", function(e) {
      console.log("webcam stream initialized", e);
    });
    camMotion.onMotion(CamMotion.Detectors.LeftMotion, function () {
      console.log("AAAAAAAAAAAAAAAH Left motion detected");
    });
    camMotion.onMotion(CamMotion.Detectors.RightMotion, function () {
      console.log("AAAAAAAAAAAAAAAH Right motion detected");
    });
    camMotion.onMotion(CamMotion.Detectors.DownMotion, function () {
      console.log("AAAAAAAAAAAAAAAH Down motion detected");
    });
    camMotion.onMotion(CamMotion.Detectors.UpMotion, function () {
      console.log("AAAAAAAAAAAAAAAH Up motion detected");
    });
    camMotion.on("frame", function () {

      var point = camMotion.getMovementPoint(true);
      // draw a circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI*2, true);
      ctx.closePath();
      if (camMotion.getAverageMovement(point.x-point.r/2, point.y-point.r/2, point.r, point.r)>4) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    });

    $scope.startWatching = function() {
      var email = $scope.email;
      var cell = $scope.cell;
      $scope.cameraOn = true;
      camMotion.start();
    }

    $scope.stopCamera = function() {
      document.getElementsByTagName('video')[0].src = '';
      document.getElementsByTagName('video')[0].pause();
      camMotion.stop();
    }

    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        windowClass: 'modal-background',
        size: size,
        resolve: {
          middleman: function () {
            return $scope.startWatching;
          }
        }
      });
    }

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
  });
