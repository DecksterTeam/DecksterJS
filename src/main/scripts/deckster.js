;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'deckster-card', 'gridster'], factory);
  } else {
    root.Deckster = factory(root.$ || root.jQuery, root.DecksterCard, root.Gridster);
  }

}(this, function ($, Card, Gridster) {
  'use strict';

  var defaults = {
    rootUrl: '/deckster',
    autoInit: true,
    scrollToSpeed: 1000,
    scrollContainer: '.deckster-deck',
    watchChanges: true,
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
    },
    onRemoveCard: $.noop
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
    this.$wrapper = $(element);
    this.$el = this.$wrapper.addClass('deckster-deck').append(window['Deckster']['Templates']['deck/deck']()).find('.deck');

    this.$cardHash = {};
    this.$gridster = null;

    this.options = $.extend(true, {}, defaults, options);

    if (!this.options.gridsterOpts.resize.stop) {
      this.options.gridsterOpts.resize.stop = this.widget_resized;
    }

    if (this.options.autoInit) {
      this.init();
    }
  }

  Deckster.cards = Deckster.cards || {};
  Deckster.views = Deckster.views || {};

  /**
   * Generates routes used for DecksterJS
   *
   * @method getRoutes
   * @param basePath The root path for DecksterJS
   * @param optionalIdentifier Character used to denote a parameter is optional. Default: '?'
   * @return {Array} routes
   */
  Deckster.getRoutes = function (basePath, optionalIdentifier) {
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
   * @return {Object} route
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
  Deckster.generatePopout = function (el, cardOpts, section) {
    cardOpts.isPopout = true;
    section = section || 'details';

    return new Card(el, cardOpts).loadPopout().toggleSection(section);
  };


  var fn = Deckster.prototype;


  fn.serializeDeck = function () {
    var data = this.options;
    data.cards = [];

    for (var key in this.$cardHash) {
      if (this.$cardHash.hasOwnProperty(key)) {
        data.cards.push(this.$cardHash[key].getCardData());
      }
    }
    return data;
  };
  /**
   * Function fired when a widget is resized in gridster
   * @method widget_resized
   * @param e
   * @param ui
   * @param $widget
   * @returns {Deckster}
   */
  fn.widget_resized = function (e, ui, $widget) {
    var card = $widget.data('deckster-card');
    if (card.options.onResize) {
      card.options.onResize.call(card, card);
    }
    return this;
  };


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
   * @return {Boolean}
   */
  fn.hasCard = function(card) {
    var cardHashKey = Card.getCardHash(card);
    return this.$cardHash.hasOwnProperty(cardHashKey);
  };


  /**
   * Returns the cards in the deck
   *
   * @method getCards
   * @return {Array}
   */
  fn.getCards = function () {
    return $.map(this.$cardHash, function(card) { return card; });
  };


  /**
   * Add an {Array} of cards to the deck.
   *
   * @method addCards
   * @param cards {Array} of {Card} configurations
   * @return {Deckster}
   */
  fn.addCards = function (cards) {
    $.each(cards, $.proxy(function (idx, cardOpts) {
      this.addCard(cardOpts);
    }, this));

    return this;
  };


  /**
   * Add a {Card} to the deck and load the cards data
   *
   * @method addCard
   * @param card Card configuration
   * @param {Function} callback Callback function that gets called with card as param after
   *  card is added to the deck
   * @return {Deckster}
   */
  fn.addCard = function (card, callback) {
    card.rootUrl = card.rootUrl || this.options.rootUrl;

    // If this card has a type specified try and get predefined
    // configurations for this card
    if(card.cardType && Deckster.cards[card.cardType]) {
      card = $.extend(true, {}, Deckster.cards[card.cardType], card);
    }

    if (this.hasCard(card)) {
      return null;
    }

    this.$cardHash[Card.getCardHash(card)] = card;

    var $cardEl = this.$gridster.add_widget(
      Card.getCardHtml(card),
      card.position ? card.position.size_x : null,
      card.position ? card.position.size_y : null,
      card.position ? card.position.col : null,
      card.position ? card.position.row : null,
      null, null, $.proxy(function() {
        var newCard = new Card($cardEl, card).loadCard();
        this.$cardHash[newCard.$cardHashKey] = newCard;
        if (callback) {
          callback(newCard);
        }
      },this)
    );

    return this;
  };

  /**
   * Removes all cards from the deck
   *
   * @method clearDeck
   * @returns {Deckster}
   */
  fn.clearDeck = function () {
    $.each(this.$cardHash, $.proxy(function(hash, card) {
      this.removeCard(card);
    }, this));

    return this;
  };


  /**
   * Remove a card from the deck
   *
   * @method removeCard
   * @param card
   * @returns {Deckster}
   */
  fn.removeCard = function (card) {
    this.$gridster.remove_widget(card.$el);
    delete this.$cardHash[card.$cardHashKey];
    this.options.onRemoveCard.call(this, card);
    return this;
  };


  /**
   * Destroy Deckster
   *
   * @method destroy
   */
  fn.destroy = function () {
    this.$wrapper.removeData('deckster');
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
