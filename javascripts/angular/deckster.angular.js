angular.module('decksterjs', [])

.factory('Deckster', function () {
  return window.Deckster;
})

.directive('decksterDeck', function($parse) {
  var defaults = { // Example of using defaults for your deckster apps
    gridsterOpts: {
      max_cols: 5,
      widget_margins: [10, 10],
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850
    }
  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="deck gridster"></div>', // This will eventually be handled by DecksterJS
    link: function(scope, element, attrs) {

      var deckOptions = $.extend(true, {}, defaults, $parse(attrs.deckOptions || {})(scope));

      scope.deckster = $(element).deckster(deckOptions).data('deckster');

      attrs.$observe('deckCards', function(value) {
        var cards = $parse(value || [])(scope);
        scope.deckster.addCards(cards);
      });
    }
  };
})

.directive('decksterPopout', ['$injector', '$compile', '$http', 'Deckster', function($injector, $compile, $http, Deckster) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var cardId, section;

      var $routeParams = $injector.get('$routeParams');
      cardId = $routeParams.cardId;
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

      var card = Deckster.generatePopout(element, cardConfig, section);
    }
  };
}]);