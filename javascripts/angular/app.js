app = angular.module('decksterTestApp', ['ngRoute', 'decksterjs'])
.config(['$routeProvider', function($routeProvider) {

  var routes = Deckster.getRoutes('/deckster/');

  angular.forEach(routes, function (route) {
    console.log(route.fullPath);
    $routeProvider.when(route.fullPath, {
      templateUrl: 'partials/deckster-popout.html'
    });
  });

  $routeProvider.when('/', {
    templateUrl: 'partials/main.html',
    controller: 'MainCtrl'
  });


}]);

app.controller('MainCtrl', ['$scope', '$http', '$compile', function($scope, $http, $compile) {
  $scope.mainDeckOptions = {
    gridsterOpts: {
      max_cols: 4,
      widget_margins: [10, 10],
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850
    }
  };

  var getSummaryTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testSummaryCard.html').success(function(html) {
      cb && cb($compile(html)($scope));
    });
  };

  var getDetailsTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testDetailsCard.html').success(function(html) {
      cb && cb($compile(html)($scope));
    });
  };

  // Define a static array of card configurations or load them from a server (ex: user defined cards)
  $scope.cards = [
    {
      title: 'Photos',
      id: 'photoCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate,
      position: {
        size_x: 1,
        size_y: 1,
        col: 1,
        row: 1
      }
    },
    {
      title: 'Alerts',
      id: 'alertsCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate,
      position: {
        size_x: 1,
        size_y: 2,
        col: 4,
        row: 1
      }
    },
    {
      title: 'Geospatial',
      id: 'mapCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate,
      position: {
        size_x: 2,
        size_y: 2,
        col: 2,
        row: 1
      }
    },
    {
      title: 'Table Data',
      id: 'tableCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate,
      position: {
        size_x: 1,
        size_y: 2,
        col: 1,
        row: 2
      }
    },
    {
      title: 'Timeline',
      id: 'timelineCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate,
      position: {
        size_x: 3,
        size_y: 1,
        col: 2,
        row: 3
      }
    }
  ];

}]);