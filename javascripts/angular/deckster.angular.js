angular.module('decksterjs', [])

.factory('Deckster', function () {
  return window.Deckster;
})

.directive('decksterDeck', function() {
  var defaults = {
    gridsterOpts: {
      max_cols: 5,
      widget_margins: [10, 10],
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850
    }
  };

  return {
    restrict: 'A',
    scope: {
      deckOptions: '=',
      deckCards: '='
    },
    controller: function($scope) {

      this.addCard = function(card, callback) {
        $scope.deckster.addCard(card, callback);
      };
    },
    link: function(scope, element) {

      var deckOptions = $.extend(true, {}, defaults, (scope.deckOptions || {}));

      scope.deckster = $(element).deckster(deckOptions).data('deckster');
    }
  };
})

.directive('decksterCard', function () {
  return {
    restrict: 'E',
    require: '^decksterDeck',
    transclude: true,
    scope: {
      card: '='
    },
    link: function(scope, element, attrs, deckCtrl) {
      deckCtrl.addCard(scope.card);
    }
  }
})

.directive('decksterPopout', ['$injector', '$compile', '$http', 'Deckster', function($injector, $compile, $http, Deckster) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var cardId, section;

      var $routeParams = $injector.get('$routeParams');
      cardId = $routeParams.id;
      section = $routeParams.section;


      var getSummaryTemplate = function(cardConfig, cb) {
        // Not using the cardConfig here but you could use it to make request
        $http.get('partials/testSummaryCard.html').success(function(html) {
          cb && cb($compile(html)(scope));
        });
      };

      var getDetailsTemplate = function(cardConfig, cb) {
        // Not using the cardConfig here but you could use it to make request
        $http.get('partials/testDetailsCard.html').success(function (html) {
          cb && cb($compile(html)(scope));
        });
      };

      // Get card config from server or angular constants using cardId
      var cardConfig =  {
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
      };

      Deckster.generatePopout(element, cardConfig, section);
    }
  };
}]);