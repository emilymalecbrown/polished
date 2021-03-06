app.controller('catalogController', function ($scope, $state, productFactory, products, allCollections) {
  $scope.products = products;
  $scope.allCollections = allCollections;
  $scope.filteredCollections = [];
  $scope.filteredColors = [];
  $scope.delta = 50;
  $scope.allColors = {
    Red: [255, 0, 0],
    Orange: [255, 110, 75],
    Yellow: [255, 255, 0],
    Green: [0, 255, 0],
    Turquoise: [0, 245, 255],
    Blue: [0, 0, 255],
    Purple: [211, 85, 165],
    Pink: [255, 75, 110],
    Light: [275, 275, 275],
    Dark: [0, 0, 0]
  };
  $scope.searchDefault = '.*';
  $scope.collectionView = false;
  $scope.colorNames = Object.keys($scope.allColors);

  $scope.goToCol = function (id) {
    $state.go('singleProduct', {id: String(id)});
  }

  $scope.vectorDistance = function (v1, v2) {
    var squareSum = 0;
    for (var i = 0; i < v1.length; i++) {
      squareSum += Math.pow(v2[i] - v1[i], 2);
    }
    return Math.sqrt(squareSum);
  }

  $scope.assignColor = function (item) {
    var closest = [null, Number.POSITIVE_INFINITY];
    for (var color in $scope.allColors) { // eslint-disable-line
      var dist = $scope.vectorDistance(item.rgbValue, $scope.allColors[color]);
      if (dist < closest[1]) {
        closest[1] = dist;
        closest[0] = color;
      }
    }
    return closest[0];
  }

  $scope.toggleFilter = function (str, filterArray, colBool) {
    $scope.collectionView = colBool;
    var index = filterArray.indexOf(str);
    if (index < 0) {
      filterArray.push(str);
    } else {
      filterArray.splice(index, 1);
    }

    if ($scope.filteredCollections.length === 0) {
      $scope.collectionView = false;
    }
  }
})

app.filter('inStock', function () {
  return function (items) {
    var filtered = [];
    items.forEach(function (item) {
      if (item.inventory > 0) filtered.push(item);
    });
    return filtered;
  }
})

app.filter('selectedColors', function () {
  return function (colors, filteredColors) {
    var showTheseCols = [];
    if (filteredColors.length === 0) {
      return colors;
    }
    for (var color in colors) {
      if (filteredColors.indexOf(colors[color]) > -1) {
        showTheseCols.push(colors[color]);
      }
    }
    if (showTheseCols) return showTheseCols;
    return colors;
  }
})

app.filter('searchFilter', function () {
  return function (items, searchString) {
    var filteredItems = [];
    for (var i = 0; i < items.length; i++) {
      if (new RegExp(searchString).test(items[i].name)) {
        filteredItems.push(items[i])
      }
    }
    return filteredItems;
  }
})

app.filter('colorFilter', function () {
  return function (items, cols, assignColor) {
    if (cols.length === 0) return items;
    var filteredItems = [];
    for (var i = 0; i < items.length; i++) {
      if (cols.indexOf(assignColor(items[i])) > -1) {
        filteredItems.push(items[i]);
      }
    }
    return filteredItems;
  }
});

app.filter('selectedCollections', function () {
  return function (collections, filteredCollections) {
    var showTheseCols = [];
    if (filteredCollections.length === 0) {
      return collections;
    }
    for (var col = 0; col < collections.length; col++) {
      if (filteredCollections.indexOf(collections[col]) > -1) {
        showTheseCols.push(collections[col]);
      }
    }
    if (showTheseCols) return showTheseCols;
    return collections;
  }
})

app.filter('collectionFilter', function () {
  return function (items, cols, extraCol) {
    if (extraCol) cols = [extraCol];
    if (cols.length > 0) {
      var filtered = [];
      for (var i = 0; i < items.length; i++) {
        if (cols.indexOf(items[i].collection) > -1) {
          filtered.push(items[i]);
        }
      }
      if (filtered) return filtered;
      else return items;
    }
    else {
      return items;
    }
  }
});

/* eslint-enable complexity id-length */
