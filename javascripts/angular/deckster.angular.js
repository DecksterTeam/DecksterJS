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
});