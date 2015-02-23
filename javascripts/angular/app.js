app = angular.module('decksterTestApp', ['ngRoute', 'decksterjs'])
.config(['$routeProvider', function($routeProvider) {

  var routes = Deckster.getRoutes('deckster/');

  angular.forEach(routes, function (route) {
    $routeProvider.when(route.fullPath, {
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
      max_cols: 5,
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

  $scope.cards = [
    {
      title: 'Photos',
      id: 'photoCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    },
    {
      title: 'Alerts',
      id: 'alertsCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    },
    {
      title: 'Geospatial',
      id: 'mapCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    },
    {
      title: 'Table Data',
      id: 'tableCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    },
    {
      title: 'Timeline',
      id: 'timelineCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    },
    {
      title: 'Node Details',
      id: 'nodeDetailsCard',
      summaryContentHtml: getSummaryTemplate,
      detailsContentHtml: getDetailsTemplate
    }
  ];

}]);