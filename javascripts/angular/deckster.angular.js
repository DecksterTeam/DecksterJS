angular.module('decksterjs', [])

.factory('Deckster', function () {
  return window.Deckster;
})

.directive('decksterDeck', function($parse) {
  var defaults = {
    gridsterOpts: {
      columns: 5,
      margins: [10, 10],
      rowHeight: 150
    }
  };

  return {
    restrict: 'E',
    template: '<div class="deck gridster"></div>', // This will eventually be handled by DecksterJS
    link: function(scope, element, attrs) {
      console.log('linking deckster');
      var deckOptions = $.extend(true, {}, defaults, $parse(attrs.deckOptions || {})(scope));

      scope.deckster = $(element).deckster(deckOptions).data('deckster');

      attrs.$observe('deckCards', function(value) {
        var cards = $parse(value || [])(scope);
        scope.deckster.addCards(cards);
      });
    }
  };
});