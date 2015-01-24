'use strict';

angular.module('nytApp')
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, middleman, clickedToBegin, userInfo) {

    var ssNum, ssRate;
    $scope.formValidation = function(cell, email, num, rate) {
      var toReturn = false;
      if(cell.length !== 12) toReturn = true;
      if(cell.split('-').length !== 3) toReturn = true;
      if(email.split('@').length !== 2) toReturn = true;
      if(email.indexOf('@') > 0 && email.split('@')[1].split('.').length !== 2) toReturn = true;
      if(num < 0 || num > 5 || rate > 5 || rate < 0) toReturn = true;
      ssNum = num, ssRate = rate;
      return toReturn;
    }

    $scope.ok = function () {
      userInfo.email = $scope.email;
      userInfo.cell = $scope.cell;
      if(ssNum) userInfo.ssNum = ssNum;
      if(ssRate) userInfo.ssRate = ssRate;
      middleman();
      $modalInstance.close();
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
      clickedToBegin.status = false;
    }

    $scope.setSettings = function() {
      angular.element('#modal-settings').slideToggle();
    }

  })
  .controller('MainCtrl', function ($scope, $http, socket, $modal, $interval, $timeout, mandrill, twilio, $location) {

    var canvas = document.getElementById("canvas-blended");
    $scope.cameraOn = false;
    $scope.clickedToBegin = { status: false };
    $scope.manualStop = false;
    var busted = false, evidence = [];
    var email, cell;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 5;
    var camMotion = CamMotion.Engine({
      canvasSource: canvas
    });
    camMotion.on("error", function (e) {

    });
    camMotion.on("frame", function () {
      var point = camMotion.getMovementPoint(true);
      // draw a circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI*2, true);
      ctx.closePath();
      if (camMotion.getAverageMovement(point.x-point.r/2, point.y-point.r/2, point.r, point.r)>4) {
        if(!busted) {
          var imageCt = 0;
          var screenshotRate = 2000; //default setting
          var screenshotNum = 5; //default seting
          if($scope.userInfo.ssNum) screenshotNum = $scope.userInfo.ssNum;
          if($scope.userInfo.ssRate) screenshotRate = $scope.userInfo.ssRate * 1000;
          twilio.contactUser($scope.userInfo.cell); //text before email
          busted = true;
          $interval(function(){
            if(imageCt < screenshotNum) {
              imageCt++;
              var imgSrc = document.getElementById("canvas-blended").toDataURL('image/png');
              evidence.push(imgSrc);
              if(imageCt == screenshotNum) {
                console.log('how many times are mandrill/twilio server posts being called..?')
                mandrill.contactUser($scope.userInfo.cell, $scope.userInfo.email, evidence);
              }
            }
          }, screenshotRate)
        }
        // ctx.fill();
      } else {
        // ctx.stroke();
      }
    });

    $scope.startWatching = function() {
      $scope.doneCounting = false;
      $scope.cameraOn = true;
      document.getElementsByTagName('canvas')[0].width = 640;
      document.getElementsByTagName('canvas')[0].height = 480;
      camMotion.start();
      $scope.x = 10;
      $interval(function(){
        if($scope.x > 0 && camMotion.intervalCount()) $scope.x--;
        if($scope.x == 3) document.getElementsByTagName('audio')[0].play();
        if($scope.x == 0) $scope.doneCounting = true;
      }, 1000)
    }

    $scope.stopCamera = function() {
      document.getElementsByTagName('video')[0].src = '';
      document.getElementsByTagName('video')[0].pause();
      camMotion.stop();
      $scope.manualStop = true;
    }

    $scope.userInfo = { email: null, cell: null }

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
          },
          userInfo: function() {
            return $scope.userInfo;
          }
        }
      });
    }

    $scope.refresh = function() {
      location.reload();
    }

    socket.socket.on('userAborted', function(data) {
      var holder = [];
      if($scope.userInfo.cell) {
        $scope.userInfo.cell.split('-').forEach(function(part){
          holder.push(part);
        })
      }
      var userCell = "+1" + holder.join("");
      if(data.senderNum == userCell && data.abort == true) {
        window.location = 'https://www.google.com/search?q=how+to+be+inconspicuous&es_sm=119&biw=1914&bih=986&source=lnms&sa=X&ei=eg_EVMK4J4yagwSKzoHoBQ&ved=0CAUQ_AUoAA&dpr=1';
      }
    })

  });
