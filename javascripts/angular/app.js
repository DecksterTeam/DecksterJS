app = angular.module('decksterTestApp', ['ngRoute', 'decksterjs'])
.config(['$routeProvider', function($routeProvider) {

  var routes = Deckster.getRoutes('deckster/');

  angular.forEach(routes, function (route) {
    console.log(route);
    $routeProvider.when(routes.fullPath, {
      controller: 'DecksterPopoutCtrl'
    });
  });

  $routeProvider.when('/', {
    templateUrl: 'main.html',
    controller: 'MainCtrl'
  });

}]);

app.controller('MainCtrl', ['$scope', '$http', '$compile', function($scope, $http, $compile) {
  $scope.mainDeckOptions = {
    gridsterOpts: {
      columns: 5,
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850,
      rowHeight: 150,
      margins: [10, 10]
    }
  };

  var getSummaryTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testDetailsCard.html').success(function(html) {
      cb && cb(html);
    });
  };

  var getDetailsTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testDetailsCard.html').success(function(html) {
      cb && cb(html);
    });
  };

  $scope.cards = [
    {
      title: 'Photos',
      id: 'photoCard',
      size: {x: 1, y: 3},
      position: [0, 0],
      summaryTemplateHtml: getSummaryTemplate,
      detailsTemplateHtml: getDetailsTemplate
    },
    {
      title: 'Alerts',
      id: 'alertsCard',
      size: {x: 1, y: 3},
      position: [3, 0]
    },
    {
      title: 'Geospatial',
      id: 'mapCard',
      size: {x: 2, y: 4},
      position: [0, 2]
    },
    {
      title: 'Table Data',
      id: 'tableCard',
      size: {x: 1, y: 6},
      position: [0, 1]
    },
    {
      title: 'Timeline',
      id: 'timelineCard',
      size: {x: 3, y: 2},
      position: [4, 2]
    },
    {
      title: 'Node Details',
      id: 'nodeDetailsCard',
      size: {x: 1, y: 4},
      position: [0, 4]
    }
  ];

  // Setup the cards for this deck (add templateUrls and defaults)
//  decksterService.buildCards($scope.cards);


}]);