;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'deckster-card', 'gridster'], factory);
  } else {
    root.Deckster = factory(root.$ || root.jQuery, root.DecksterCard, root.Gridster);
  }

}(this, function ($, Card, Gridster) {
  'use strict';

  var defaults = {
    showDock: false,
    showToolbar: false,
    autoInit: true,
    gridsterOpts: {
      columns: 5,
      margins: [10, 10],
      rowHeight: 150,
      draggable: {
        handle: '.drag-handle'
      },
      resize: {
        enabled: true
      }
    }
  };

  /**
   * @class Deckster
   * @uses Card
   * @param {HTMLElement} element The HTMLElement that will hold the deck
   * @param {Object} [options] An Object will all the default options you wish to overwrite:
   *    @param {Boolean} [options.showDock] Choose to show the Deck dock or not.
   *    @param {Boolean} [options.showToolbar] Choose to show the Deck toolbar or not.
   *    @param {Boolean} [options.autoInit] Choose whether or not to init the Deck automatically after creation.
   *    @param {Object} [options.gridsterOpts] Define options for gridster.js. See available options here http://gridster.net/#documentation
   *
   * @constructor
   */
  function Deckster(element, options) {
    this.$el = $(element);
    this.$cardHash = {};
    this.$gridster = null;

    this.options = $.extend(true, {}, defaults, options);

    if (this.options.autoInit) {
      this.init();
    }
  }


  /**
   * Generates routes used for DecksterJS
   *
   * @method getRoutes
   * @param basePath The root path for DecksterJS
   * @param optionalIdentifier Character used to denote a parameter is optional. Default: '?'
   * @returns {Array} routes
   */
  Deckster.getRoutes = function(basePath, optionalIdentifier) {
    basePath = basePath ? basePath : 'deckster/';
    basePath = basePath && basePath.endsWith('/') ? basePath : basePath + '/';
    optionalIdentifier = optionalIdentifier ? optionalIdentifier : '?';
    return [
      {
        basePath: basePath + 'card',
        fullPath: basePath + 'card/:id/:section' + optionalIdentifier,
        queryParams: [{name: 'id', optional: false}, {name: 'section', optional: true}]
      }
    ];
  };


  /**
   * Generates route use for popouts
   *
   * @method getPopoutRoute
   * @param basePath The root path for DecksterJS
   * @param optionalIdentifier Character used to denote a parameter is optional. Default: '?'
   * @returns {Object} route
   */
  Deckster.getPopoutRoute = function (basePath, optionalIdentifier)  {
    basePath = basePath ? basePath : 'deckster/';
    basePath = basePath && basePath.endsWith('/') ? basePath : basePath + '/';
    optionalIdentifier = optionalIdentifier ? optionalIdentifier : '?';

    return {
      basePath: basePath + 'card',
      fullPath: basePath + 'card/:id/:section' + optionalIdentifier,
      queryParams: [{name: 'id', optional: false}, {name: 'section', optional: true}]
    };
  };


  /**
   * Given a card configuration this function generates html for a card adds to the element and displays the
   * given section.
   *
   * @method generatePopout
   * @param el {HTMLElement} To bind card to
   * @param cardOpts {Object} Options used to configure card
   * @param section {String} 'summary'|'details'
   * @return {Card} instance of card
   */
  Deckster.generatePopout = function(el, cardOpts, section) {
    cardOpts.isPopout = true;
    section = section || 'details';

    return new Card(el, cardOpts).loadPopout().toggleSection(section);
  };

  var fn = Deckster.prototype;


  /**
   * Initializes Deckster and adds cards if any are given
   *
   * @method init
   * @param cards Cards to be added to the deck
   */
  fn.init = function (cards) {
    this.$gridster = new Gridster(this.$el, this.options.gridsterOpts);

    if (cards) {
      this.addCards(cards);
    }
  };


  /**
   * Checks if a card is in the deck
   *
   * @method hasCard
   * @param card configurations of card
   * @returns {Boolean}
   */
  fn.hasCard = function(card) {
    var cardHashKey = Card.getCardHash(card);
    return this.$cardHash.hasOwnProperty(cardHashKey);
  };


  /**
   * Returns the cards in the deck
   *
   * @method getCards
   * @returns {Array}
   */
  fn.getCards = function () {
    return $.map(this.$cardHash, function(card) { return card; });
  };


  /**
   * Add an {Array} of cards to the deck.
   *
   * @method addCards
   * @param cards {Array} of {Card} configurations
   * @returns {Deckster}
   */
  fn.addCards = function (cards) {
    $.each(cards, $.proxy(function (idx, cardOpts) {
      if (this.hasCard(cardOpts)) {
        // Update Card instead of adding a new one
      } else {
        this.addCard(cardOpts);
      }
    }, this));

    return this;
  };


  /**
   * Add a {Card} to the deck and load the cards data
   *
   * @method addCard
   * @param card Card configuration
   * @returns {Card}
   */
  fn.addCard = function (card) {
    var $cardEl = this.$gridster.add_widget(
      Card.getCardHtml(card),
      card.position ? card.position.size_x : null,
      card.position ? card.position.size_y : null,
      card.position ? card.position.col : null,
      card.position ? card.position.row : null
    );

    var newCard = new Card($cardEl, card).loadCard();
    this.$cardHash[newCard.$cardHashKey] = newCard;

    return newCard;
  };


  /**
   * Destroy Deckster
   *
   * @method destroy
   */
  fn.destroy = function () {
    this.$gridster.destroy();
  };


  $.fn.deckster = function (options) {
    return this.each(function () {
      if (!$.data(this, 'deckster')) {
        $.data(this, 'deckster', new Deckster(this, options));
      }
    });
  };

  return Deckster;

}));
