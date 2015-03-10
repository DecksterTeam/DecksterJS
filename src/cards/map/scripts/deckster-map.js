;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'deckster'], factory);
  } else {
    root.DecksterMapCard = factory(root.$ || root.jQuery, root.Deckster);
  }

}(this, function($, Deckster){

  // Card config for map
  Deckster.cards.map = {
    title: 'Map',
    position: {
      size_x: 3,
      size_y: 2
    },
    summaryContentHtml: function (cardConfig, cb) {

    },
    detailsContentHtml: function (cardConfig, cb) {

    },
    onSummaryLoad: function (card) {

    },
    onDetailsLoad: function (card) {

    }
  };

}));
