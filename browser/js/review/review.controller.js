app.controller('ReviewController', function ( $scope, $stateParams, productFactory, $state, AuthService) {

  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.rateBy = function (star) {
      $scope.ratedBy = star;
  }
  //checks if user is logged in
  //if true, show "add review" card
  $scope.isLoggedIn = function () {
    return AuthService.isAuthenticated();
  };

  //finds user associated with review
  var findUser = function () {
    AuthService.getLoggedInUser()
    .then(function (user) {
      $scope.user = user;
    });
  };

  findUser();

  //posts a review
  $scope.addReview = function(id, body) {
    body.productId = $scope.product.id;
    body.stars = $scope.ratedBy;
    if ($scope.user) {
      body.userId = $scope.user.id;
    }

    return productFactory.postReview(id, body)
    .then(function() {
      $state.reload();
    });

  }
  $scope.starString = function (num) {
    return 'abcde'.slice(0, num);
  }
});
