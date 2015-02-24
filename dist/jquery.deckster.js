/*! deckster - v0.0.0 - 2015-02-24
* https://github.com/DecksterTeam/DecksterJS
* Copyright (c) 2015 Deckster Team; Licensed MIT */
;(function (window, undefined) {
  'use strict';

  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  /*
   * Hashcode.js 1.0.2
   * https://github.com/stuartbannerman/hashcode
   *
   * Copyright 2013 Stuart Bannerman (me@stuartbannerman.com)
   * Released under the MIT license
   *
   * Date: 07-04-2013
   */
  window.Hashcode = (function () {
    // Hashes a string
    var hash = function (string) {
      var hash = 0, i;
      string = string.toString();

      for (i = 0; i < string.length; i++) {
        hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
      }

      return hash;
    };
    // Deep hashes an object
    var object = function (obj) {
      var result = 0;
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          result += hash(property + value(obj[property]));
        }
      }

      return result;
    };
    // Does a type check on the passed in value and calls the appropriate hash method
    var value = function (value) {
      var types =
      {
        'string': hash,
        'number': hash,
        'boolean': hash,
        'object': object
        // functions are excluded because they are not representative of the state of an object
        // types 'undefined' or 'null' will have a hash of 0
      };
      var type = typeof value;

      return value !== null && types[type] ? types[type](value) + hash(type) : 0;
    };

    return {
      value: value
    };
  })();

  /* escape, keys, has, and isObject functions taken from underscore.js
   *
   * Copyright (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and
   * Investigative Reporters & Editors
   *
   * Permission is hereby granted, free of charge, to any person
   * obtaining a copy of this software and associated documentation
   * files (the "Software"), to deal in the Software without
   * restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following
   * conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   * OTHER DEALINGS IN THE SOFTWARE.
   */
  window._ = window._ || {};

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  var has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Is a given variable an object?
  var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  var keys = function(obj) {
    if (!isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    return keys;
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  window._.escape = createEscaper(escapeMap);

})(window);
;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    root.DecksterCard = factory(root.$ || root.jQuery);
  }

}(this, function ($) {
  'use strict';

  var defaults = {
    id: null,
    title: null,
    icon: null,
    lazyLoad: true,
    usePopoutLayout: true,
    hasPopout: false,
    summaryContentHtml: null,
    summaryContentUrl: null,
    detailsContentHtml: null,
    detailsContentUrl: null,
    position : {
      size_x: 1,
      size_y: 1,
      expanded_x: null,
      expanded_y: null,
      col: 1,
      row: 1
    },
    onSummaryLoad: $.noop,
    onDetailsLoad: $.noop,
    loadData: $.noop
  };

  /**
   * @class Card
   *
   * @param {HTMLElement} el
   * @param options {Object} Configuration for the card
   *    @param {String} [options.id] Unique identifier for this card
   *    @param {String} [options.title] Title for this card
   *    @param {String} [options.icon] Icon class used for this card
   *    @param {Boolean} [options.lazyLoad] Whether to load the details section on load or wait until its needed
   *    @param {Boolean} [options.usePopoutLayout] Whether or not to place card content inside card layout when the
   *      card when the card is a popout
   *    @param {Boolean} [options.hasPopout] Whether or not the card can be popped out into a new window
   *    @param {String|Function} [options.summaryContentHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the summary section of the card
   *    @param {String} [options.summaryContentUrl] Url to request HTML content for summary section of card
   *    @param {String|Function} [options.detailsContentHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the details section of the card
   *    @param {String} [options.detailsContentUrl] Url to request HTML content for details section of card
   *    @param {Object} [options.position] Settings for how to position this card in the deck
   *        @param {Number} [options.position.size_x] Number of columns this card spans in deck
   *        @param {Number} [options.position.size_y] Number of rows this card spans in deck
   *        @param {Number} [options.position.expanded_x] Max number of columns this card spans when expanded
   *        @param {Number} [options.position.expanded_y] Max number of rows this card spans when expanded
   *        @param {Number} [options.position.col] Col the card should be positioned in
   *        @param {Number} [options.position.row] Row the card should be positioned in
   *    @param {Function} [options.onSummaryLoad] Function triggered when summary content is loaded;
   *      passes through the card
   *    @param {Function} [options.onDetailsLoad] Function triggered when details content is loaded;
   *      passes through the card
   *    @param {Function} [options.loadData] Function used to load data into card
   * @constructor
   */
  function Card(el, options) {
    this.$el = $(el);
    this.$deckster = this.$el.parent().data('deckster');
    this.options = $.extend(true, {}, defaults, options);
    this.$cardHashKey = Hashcode.value(this.options);
    this.currentSection = 'summary';
  }

  /**
   * Returns the card defaults
   *
   * @method getDefaults
   * @returns {Object} Card defaults
   */
  Card.getDefaults = function() {
    return defaults;
  };


  /**
   * Generates the layout for a card with given options
   *
   * @method getCardHtml
   * @param opts {Object} locals used to generate layout for card
   * @returns {HTMLElement|String} of card layout html
   */
  Card.getCardHtml = function (opts) {
    var template = Deckster.Templates['card/card'];
    return template({card: opts});
  };


  /**
   * Returns a numerical hash for the value the card options passed in
   *
   * @method getCardHash
   * @param opts
   * @returns {Number}
   */
  Card.getCardHash = function (opts) {
    return Hashcode.value(opts);
  };

  var fn = Card.prototype;


  /**
   * Returns the current options associated with this card
   *
   * @method getCardData
   * @returns {Object}
   */
  fn.getCardData = function () {
    // Get current state of card
    var currPosition = {
      size_x: this.$el.data('sizex'),
      size_y: this.$el.data('sizey'),
      col: this.$el.data('col'),
      row: this.$el.data('row')
    };

    return $.extend(true, {}, this.options, {position: currPosition});
  };


  /**
   * Loads the content of the different sections of the card. If lazyLoad is enabled only the summary content will
   * be loaded when the card is initialized.
   *
   * @method loadCard
   * @returns {Card}
   */
  fn.loadCard = function () {
    this.loadSummaryContent();

    this.hasDetails = this.options.detailsContentHtml || this.options.detailsContentUrl;

    !this.hasDetails ? this.$el.find('.deckster-card-toggle').hide() : this.$el.find('.deckster-card-toggle').show();
    !this.options.hasPopout ? this.$el.find('.deckster-card-popout').hide() : this.$el.find('.deckster-card-popout').show();

    if (this.hasDetails && (!this.options.lazyLoad || this.currentSection === 'details')) {
      this.loadDetailsContent();
    }

    this.bindCardHandlers();
    return this;
  };

  /**
   * Loads the popout for a card. The card element won't have the layout injected yet so we need to
   * do that first before loading the card.
   *
   * @method loadPopout
   * @returns {Card}
   */
  fn.loadPopout = function () {
    if(this.options.isPopout) {
      this.$el.html(Card.getCardHtml(this.options));
    }

    return this.loadCard();
  };


  /**
   * Loads the given HTML content into the specified section for this card
   *
   * @method setCardContent
   * @param section {String} 'summary'|'details'
   * @param html {HTMLElement|String} content for this section
   * @returns {Card}
   */
  fn.setCardContent = function (section, html) {
    var $container = this.$el.find('.deckster-card-content .deckster-' + section);
    $container.empty();
    $container.html(html);

    this[section + 'Loaded'] = true;
    section === 'summary' ? this.options.onSummaryLoad(this) : this.options.onDetailsLoad(this);
    return this;
  };

  var getCardHtml = function(url, cb) {
    $.get(url, cb);
  };


  /**
   * Loads the summary content for this card
   * @method loadSummaryContent
   */
  fn.loadSummaryContent = function () {
    if ($.isFunction(this.options.summaryContentHtml)) {
      this.options.summaryContentHtml(this.options, $.proxy(function (html) {
        this.setCardContent('summary', html);
      }, this));
    } else if (this.options.summaryContentHtml) {
      this.setCardContent('summary', this.options.summaryContentHtml);
    } else if (this.options.summaryContentUrl) {
      getCardHtml(this.options.summaryContentUrl, $.proxy(function(html) {
        this.setCardContent('summary', html);
      }, this));
    }
  };


  /**
   * Loads the details content for this card
   * @method loadDetailsContent
   */
  fn.loadDetailsContent = function () {
    if ($.isFunction(this.options.detailsContentHtml)) {
      this.options.detailsContentHtml(this.options, $.proxy(function (html) {
        this.setCardContent('details', html);
      }, this));
    } else if (this.options.detailsContentHtml) {
      this.setCardContent('details', this.options.detailsContentHtml);
    } else if (this.options.detailsContentUrl) {
      getCardHtml(this.options.detailsContentUrl, $.proxy(function(html) {
        this.setCardContent('details', html);
      }, this));
    }
  };


  /**
   * Loads the content for the specified section
   *
   * @method loadContent
   * @param section {String} 'summary'|'details'
   */
  fn.loadContent = function (section) {
    if (section === 'summary') {
      this.loadSummaryContent();
    } else {
      this.loadDetailsContent();
    }
  };


  /**
   * Reloads the content of this card
   * @method reloadContent
   */
  fn.reloadContent = function () {
    this.loadCard();
  };


  /**
   * Loads and displays the specified section if its not current displayed
   *
   * @method toggleSection
   * @param section {String} 'summary'|'details'
   * @returns {Card}
   */
  fn.toggleSection = function (section) {
    this.currentSection = section ? section :
      this.currentSection === 'summary' ? 'details' : 'summary';

    this.loadContent(this.currentSection);
    var prevSection = this.currentSection === 'summary' ? 'details' : 'summary';

    this.$el.find('.deckster-' + prevSection).fadeOut(200, $.proxy(function () {
      var exp_x = this.options.position.expanded_x,
          exp_y = this.options.position.expanded_y || 4;

      prevSection === 'summary' ? this.$deckster.$gridster.expand_widget(this.$el, exp_x, exp_y) :
        this.$deckster.$gridster.collapse_widget(this.$el);

      var toggleClass = this.currentSection === 'summary' ? 'glyphicon-resize-full' : 'glyphicon-resize-small';

      this.$el.find('.deckster-card-toggle')
        .removeClass('glyphicon-resize-small glyphicon-resize-full').addClass(toggleClass);
      this.$el.find('.deckster-' + this.currentSection).fadeIn(200);
    }, this));
    return this;
  };

  /**
   * Binds handlers to card element
   * @returns {Card}
   */
  fn.bindCardHandlers = function () {
    this.$el.off('click.deckster-card', '.deckster-card-toggle');
    this.$el.on('click.deckster-card', '.deckster-card-toggle', $.proxy(function() {this.toggleSection();}, this));

    this.$el.off('click.deckster-card', '.deckster-card-reload');
    this.$el.on('click.deckster-card', '.deckster-card-reload', $.proxy(function() {this.reloadContent();}, this));
    return this;
  };

  return Card;

}));
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

    return new Card(el, cardOpts).loadCard().toggleSection(section);
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

this["Deckster"] = this["Deckster"] || {};
this["Deckster"]["Templates"] = this["Deckster"]["Templates"] || {};

this["Deckster"]["Templates"]["card/card"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="deckster-card" id="' +((__t = ( card.id )) == null ? '' : __t) +'">\n    <div class="deckster-card-inner">\n        <div class="deckster-card-header">\n            <div class="card-icon"><i class="' +((__t = ( card.icon )) == null ? '' : __t) +'"></i></div>\n            <div class="deckster-card-functions">\n                <span class="deckster-card-function deckster-card-menu glyphicon glyphicon-menu-hamburger"></span>\n            </div>\n            <div class="deckster-card-controls">\n                <span class="deckster-card-control deckster-card-reload glyphicon glyphicon-refresh"></span>\n                <span class="deckster-card-control deckster-card-toggle glyphicon glyphicon-resize-full"></span>\n                <a href="deckster/card/' +((__t = ( card.id )) == null ? '' : __t) +'" class="deckster-card-control deckster-card-popout glyphicon glyphicon-new-window thin"></a>\n            </div>\n            <div class="deckster-card-title drag-handle">' +((__t = ( card.title )) == null ? '' : __t) +'</div>\n        </div>\n        <div class="deckster-card-content">\n            <div class="deckster-card-loading"></div>\n            <div class="deckster-summary"></div>\n            <div class="deckster-details" style="display: none;"></div>\n        </div>\n    </div>\n</div>';}return __p};