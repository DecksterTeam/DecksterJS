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

(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["map-details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
}})();
(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["map-summary"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
}})();