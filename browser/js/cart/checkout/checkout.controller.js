app.controller('checkoutController', function($scope, CheckoutFactory, LocalStorage) {

  $scope.getTotalPrice = function() {

    var cart = LocalStorage.getLocalCart();
    console.log('my object ', cart)

    if (cart.products.length === 1) {
      return cart.products[0].total;
    } else {
      var pricething = cart.products.reduce(function(current, next) {
          return current.total+next.total;
      });
      return pricething;
    }
  }

  $scope.stripeCallback = function(code, result, attributes){
    if(result.error) {
      alert('Your payment failed, please try again.');
    } else {
      alert('Payment success! Please proceed to checkout');
      CheckoutFactory.sendStripeToken({token: result.id, amount: $scope.getTotalPrice()})
      .then(function(res) {
      })
    }
  };

})

