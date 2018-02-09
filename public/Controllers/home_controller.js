app.controller('homeController', function ($scope,$rootScope,$cookies,$location,amountService,groupService,gamesService,playerService) {
    
    $scope.controllerName = 'homeController';

    amountService.getAllCashIn()
    .then(function(res){
      $scope.totalCashIn = 0;
      for(var i = 0; i< res.data.length; i++){
        $scope.totalCashIn += res.data[i].cash_in;
      }
    });

    playerService.getAllPlayers()
    .then(function (res) {
        $scope.totalPlayers = res.data.length;
    });

    gamesService.getAllGames()
    .then(function(res){
        $scope.totalGames = res.data.length;
    });

    groupService.getAllGroups()
    .then(function(res){
        $scope.totalGroups = res.data.length;
    });
    
    $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: '//unsplash.it/' + newWidth + '/300',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }


  $(function() {
    $('.banner').unslider({
      autoplay: true,
      infinite: true,
      arrows: false,
      keys: false,
      nav: false,
      speed: 1000,
      delay: 3500

    });
  });



  // *** START - Amination *** //
  $scope.elements = [];
  $scope.animation = {};
  $scope.animation.current = 'fadeInUp';
  $scope.animation.previous = $scope.animation.current;

  // only required for dynamic animations

	$scope.animateElementIn = function($el) {
    
      $el.removeClass('hidden');
      $el.addClass('animated ' + $scope.animation.current);  
      if($el[0].id == 'number-count' && !$scope.run){
        $scope.run = true;  
        document.getElementById("demo").click();
      }
	};

  $scope.reCount = function () {
    $scope.cashinFrom = 0;
    $scope.cashinTo = $scope.totalCashIn;

    $scope.gamesFrom = 0;
    $scope.gamesTo = $scope.totalGames;

    $scope.groupsFrom = 0;
    $scope.groupsTo = $scope.totalGroups;

    $scope.playersFrom = 0;
    $scope.playersTo = $scope.totalPlayers;
};
  
	$scope.animateElementOut = function($el) {
		$el.addClass('hidden');
    $el.removeClass('animated ' + $scope.animation.current);
    
  };
  // *** END - Amination *** //

  

  $scope.backToTop = function() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  }

  $scope.getStarted = function(){
    // if login
    if($rootScope.userLogIn){
      $location.path('/balance');
    }
    else{
      $location.path('/login');
    }
    
  }

    // if($rootScope.userLogIn && $rootScope.userLogIn.currentUser){
    //   $scope.btnText = 'Go to Balance'
    // } else{
    //   $scope.btnText = 'Get started now!';
    // }

    $scope.$watch(function() {
      return $rootScope.userLogIn;
    }, function() {
      if($rootScope.userLogIn && $rootScope.userLogIn.currentUser){
        $scope.btnText = 'Go to Balance'
      } else{
        $scope.btnText = 'Get started now!';
      }
    }, true);
  
    
});