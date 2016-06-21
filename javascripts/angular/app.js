//example of angular app using deckster


//configuring popout functionality
app = angular.module('decksterTestApp', ['ngRoute', 'decksterjs'])
.config(['$routeProvider', function($routeProvider) {

  // configuring base url for deckster popouts
  var popoutRoute = Deckster.getPopoutRoute('/deckster/');

  // configuring the popout base template
  $routeProvider.when(popoutRoute.fullPath, {
    templateUrl: 'partials/deckster-popout.html'
  });
  
  $routeProvider.when('/', {
    templateUrl: 'partials/main.html',
    controller: 'MainCtrl'
  });

}]);

//configuring a specific page to have a deckster deck
app.controller('MainCtrl', ['$scope', '$http', '$compile', '$timeout', function ($scope, $http, $compile, $timeout) {
  // says when it's okay to render the deck
  $scope.initialized = false;
  $scope.mainDeck = {
    rootUrl: '#/deckster',
    //settings for gridster
    gridsterOpts: {
      max_cols: 4,
      widget_margins: [10, 10],
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850
    }
  };

  // examples Of how you can fetch content for cards
  var getSummaryTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testSummaryCard.html').success(function (html) {
      cb && cb($compile(html)($scope));
    });
  };

  var getDetailsTemplate = function(cardConfig, cb) {
    // Not using the cardConfig here but you could use it to make request
    $http.get('partials/testDetailsCard.html').success(function (html) {
      cb && cb($compile(html)($scope));
    });
  };

  // Define a static array of card configurations or load them from a server (ex: user defined cards)
  $scope.mainDeck.cards = [
    {
      title: 'Photos',
      id: 'photoCard',
      hasPopout: true,
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

  // Once the cards are loaded (could be done in a async call) initialize the deck
  $timeout(function () {
    $scope.initialized = true;
  });

}]);