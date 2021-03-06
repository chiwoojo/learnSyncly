angular.module('lsync.video', ['lsync.services'])
.controller('VideoController', function($scope,VideoState){
  angular.extend($scope,VideoState);
  $scope.playerEvent = function(event){
    var data = Array.prototype.slice.apply(arguments, 1);
    this.$broadcast(event,data);
  };

  $scope.url='https://www.youtube.com/watch?v=lBqiZSemrqg&ab_channel=TimKindberg';
  $scope.$on('updateTime', function (event, data) {
    console.log(data);
  });

  $scope.data={
    videoid: "M7lc1UVf-VE",
  };
})
.directive('youtube', function($window,$rootScope) {
  return {
    restrict: "E",

    scope: {
      videoid: "@",
    },

    template: '<div></div>',

    player: null,

    link: function(scope, element) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      $window.onYouTubeIframeAPIReady = function() {

        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            theme: "dark",
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1,
            start: 0,
          },

          videoId: scope.videoid,

          events:{
            'onReady': seekToBeginning,
            'onStateChange':onPlayerStateChange
         }
        });
        seekToBeginning();
        setInterval(onPlayerStateChange,500);
      };
      var seekToBeginning = function(){
        player.seekTo(0);
        player.playVideo();
      };
      var onPlayerStateChange = function(){
        $rootScope.$emit('videoPlaying', player.getCurrentTime());
      };
      // setInterval(onPlayerStateChange, 500);
      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        player.cueVideoById(scope.videoid);

      });
      scope.$on('seekTo', function(time){
        player.seekTo(time);
        player.pauseVideo();
      });
      scope.$on('play',function(){
        player.playVideo();
      });
      scope.$on('pause',function(){
        player.pauseVideo();
      });
    }
  };
});
