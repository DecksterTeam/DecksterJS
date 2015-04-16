/*! deckster - v0.2.13 - 2015-04-16
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
   * object.watch polyfill
   *
   * 2012-04-03
   *
   * By Eli Grey, http://eligrey.com
   * Public Domain.
   * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
   */

// object.watch
  if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
      enumerable: false
      , configurable: true
      , writable: false
      , value: function (prop, handler) {
        var
          oldval = this[prop]
          , getter = function () {
            return oldval;
          }
          , setter = function (newval) {
            if (oldval !== newval) {
              handler.call(this, prop, oldval, newval);
              oldval = newval;
            }
            else { return false }
          }
          ;

        if (delete this[prop]) { // can't watch constants
          Object.defineProperty(this, prop, {
            get: getter
            , set: setter
            , enumerable: true
            , configurable: true
          });
        }
      }
    });
  }

  if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false
      , configurable: true
      , writable: false
      , value: function (prop) {
        var val = this[prop];
        delete this[prop]; // remove accessors
        this[prop] = val;
      }
    });
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
    if (!isObject(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    var keys = [];
    for (var key in obj) {
      if (has(obj, key)) {
        keys.push(key);
      }
    }
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
    var testRegexp = new RegExp(source);
    var replaceRegexp = new RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  window._.escape = createEscaper(escapeMap);

})(window);

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define('deckster-card', ['jquery'], factory);
  } else {
    root.DecksterCard = factory(root.$ || root.jQuery);
  }

}(this, function ($) {
  'use strict';

  var defaults = {
    id: null,
    cardType: false,
    title: null,
    lazyLoad: true,
    usePopoutLayout: true,
    hasPopout: false,
    expandable: true,
    expandInPlace: false,
    resizable: true,
    showFooter: true,
    summaryContentHtml: null,
    summaryContentUrl: null,
    detailsContentHtml: null,
    detailsContentUrl: null,
    leftControlsHtml: null,
    leftControlsContentUrl: null,
    rightControlsHtml: null,
    rightControlsContentUrl: null,
    centerControlsHtml: null,
    centerControlsContentUrl: null,
    getPopoutUrl: function (card) {
      return card.options.rootUrl + '/card/' + card.options.id;
    },
    position : {
      size_x: 1,
      size_y: 1,
      expanded_x: null,
      expanded_y: null,
      col: 1,
      row: 1
    },
    spinnerOpts: {
      lines: 8, // The number of lines to draw
      length: 1, // The length of each line
      width: 4, // The line thickness
      radius: 6, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    },
    onSummaryLoad: $.noop,
    onSummaryDisplayed: $.noop,
    onDetailsLoad: $.noop,
    onDetailsDisplayed: $.noop,
    onResize: $.noop,
    onExpand: $.noop,
    onCollapse: $.noop,
    onReload: $.noop,
    loadData: $.noop,
    fieldsToSerialize: [
      'id',
      'cardType',
      'title',
      'lazyLoad',
      'usePopoutLayout',
      'hasPopout',
      'expandable',
      'showFooter',
      'position',
      'fieldsToSerialize'
    ]
  };

  /**
   * @class Card
   *
   * @param {HTMLElement} el
   * @param options {Object} Configuration for the card
   *    @param {String} [options.id] Unique identifier for this card
   *    @param {String} [options.cardType] Type of predefined card configuration
   *    @param {String} [options.title] Title for this card
   *    @param {Boolean} [options.lazyLoad] Whether to load the details section on load or wait until its needed
   *    @param {Boolean} [options.usePopoutLayout] Whether or not to place card content inside card layout when the
   *      card when the card is a popout
   *    @param {Boolean} [options.hasPopout] Whether or not the card can be popped out into a new window
   *    @param {Boolean} [options.expandable] Whether or not the card can be expanded
   *    @param {Boolean} [options.expandInPlace] Whether or not to expand from the widgets current column
   *    @param {Boolean} [options.showFooter] Show the footer for this card
   *    @param {String|Function} [options.summaryContentHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the summary section of the card
   *    @param {String} [options.summaryContentUrl] Url to request HTML content for summary section of card
   *    @param {String|Function} [options.detailsContentHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the details section of the card
   *    @param {String} [options.detailsContentUrl] Url to request HTML content for details section of card
   *    @param {String|Function} [options.leftControlsHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the left controls content for this card
   *    @param {String} [options.leftControlsContentUrl] Url to request HTML content for the left controls content for this card
   *    @param {String|Function} [options.rightControlsHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the right controls content for this card
   *    @param {String} [options.rightControlsContentUrl] Url to request HTML content for the right controls content for this card
   *    @param {String|Function} [options.centerControlsHtml] Can be a HTMLElement or String of HTML or a function
   *      with a callback that takes the generated HTML for the center controls content for this card
   *    @param {String} [options.centerControlsContentUrl] Url to request HTML content for the center controls content for this card
   *    @param {Object} [options.position] Settings for how to position this card in the deck
   *        @param {Number} [options.position.size_x] Number of columns this card spans in deck
   *        @param {Number} [options.position.size_y] Number of rows this card spans in deck
   *        @param {Number} [options.position.expanded_x] Max number of columns this card spans when expanded
   *        @param {Number} [options.position.expanded_y] Max number of rows this card spans when expanded
   *        @param {Number} [options.position.col] Col the card should be positioned in
   *        @param {Number} [options.position.row] Row the card should be positioned in
   *    @param {Function} [options.onSummaryLoad] Function triggered when summary content is loaded;
   *      passes through the card
   *    @param {Function} [options.onSummaryDisplayed] Function triggered when summary content is displayed
   *    @param {Function} [options.onDetailsLoad] Function triggered when details content is loaded;
   *      passes through the card
   *    @param {Function} [options.onDetailsDisplayed] Function triggered when details content is displayed
   *    @param {Function} [options.onResize] Function triggered when this card is resized
   *    @param {Function} [options.onExpand] Function triggered when this card is expanded
   *    @param {Function} [options.onCollapse] Function triggered when this card is collapsed
   *    @param {Function} [options.onReload] Function triggered when this card is reloaded
   *    @param {Function} [options.loadData] Function used to load data into card
   *    @param {Array} [options.fieldsToSerialize] Fields that should be plucked from the options during serialization
   * @constructor
   */
  function Card(el, options) {
    this.$el = $(el);
    this.$deckster = this.$el.parents('.deckster-deck').data('deckster');
    this.options = Card.extendDefaults(options);
    this.$cardHashKey = Hashcode.value(this.options);
    this.currentSection = 'summary';
    this.isExpanded = false;
    this.spinner = null;

    this.$el.data('deckster-card', this);
  }

  /**
   * Returns the card defaults
   *
   * @method getDefaults
   * @return {Object} Card defaults
   */
  Card.getDefaults = function() {
    return defaults;
  };


  /**
   * Extend default options of card with options given
   *
   * @method extendDefaults
   * @param options
   * @returns {Object}
   */
  Card.extendDefaults = function(options) {
    var fields = options.fieldsToSerialize;

    var opts = $.extend(true, {}, defaults, options);

    if(fields) {
      opts.fieldsToSerialize = fields;
    }

    return opts;
  };

  /**
   * Generates the layout for a card with given options
   *
   * @method getCardHtml
   * @param opts {Object} locals used to generate layout for card
   * @return {HTMLElement|String} of card layout html
   */
  Card.getCardHtml = function (opts) {
    var template = window['Deckster']['Templates']['card/card'];
    return template({card: Card.extendDefaults(opts)});
  };


  /**
   * Returns a numerical hash for the value the card options passed in
   *
   * @method getCardHash
   * @param opts
   * @return {Number}
   */
  Card.getCardHash = function (opts) {
    return Hashcode.value(Card.extendDefaults(opts));
  };

  var fn = Card.prototype;


  /**
   * Returns the current options associated with this card
   *
   * @method getCardData
   * @return {Object}
   */
  fn.getCardData = function () {
    // Get current state of card
    var grid = this.$el.data('coords').grid;
    var currPosition = {
      col: grid.col,
      row: grid.row
    };

    if (this.isExpanded) {
      currPosition['expanded_x'] = grid.size_x;
      currPosition['expanded_y'] = grid.size_y;
      currPosition['size_x'] = this.options.position.size_x;
      currPosition['size_y'] = this.options.position.size_y;
    }
    else {
      currPosition['size_x'] = grid.size_x;
      currPosition['size_y'] = grid.size_y;
      currPosition['expanded_x'] = this.options.position.expanded_x;
      currPosition['expanded_y'] = this.options.position.expanded_y;
    }

    var optsToSerialize = {};

    $.each(this.options.fieldsToSerialize, $.proxy(function(idx, field) {
      optsToSerialize[field] = this.options[field];
    }, this));

    return $.extend(true, {}, optsToSerialize, {position: currPosition, isExpanded: this.isExpanded});
  };


  /**
   * Loads the content of the different sections of the card. If lazyLoad is enabled only the summary content will
   * be loaded when the card is initialized.
   *
   * @param reloading whether or not the card is being reloaded
   * @method loadCard
   * @return {Card}
   */
  fn.loadCard = function (reloading) {
    this.loadSummaryContent(reloading);

    this.hasDetails = !!(this.options.detailsContentHtml || this.options.detailsContentUrl);

    if (typeof Spinner !== 'undefined' && !this.spinner) {
      this.spinner = new Spinner(this.options.spinnerOpts);
    }

    !this.options.expandable || this.options.isPopout ? this.$el.find('.deckster-card-toggle').hide() : this.$el.find('.deckster-card-toggle').show();
    !this.options.resizable || this.options.isPopout ? this.$el.find('.gs-resize-handle').hide() : this.$el.find('.gs-resize-handle').show();
    !this.options.hasPopout || this.options.isPopout ? this.$el.find('.deckster-card-popout').hide() : this.$el.find('.deckster-card-popout').show();

    if (this.hasDetails && (!this.options.lazyLoad || this.currentSection === 'details')) {
      this.loadDetailsContent(reloading);
    }

    this.bindCardHandlers();
    this.setWatchers();
    return this;
  };


  /**
   * Loads the popout for a card. The card element won't have the layout injected yet so we need to
   * do that first before loading the card.
   *
   * @method loadPopout
   * @return {Card}
   */
  fn.loadPopout = function () {
    if(this.options.isPopout) {
      this.$el.html('<div class="deckster-popout-wrapper">' + Card.getCardHtml(this.options) + '</div>');
    }

    return this.loadCard();
  };


  /**
   * Shows the loading spinner
   *
   * @method showSpinner
   * @returns {Card}
   */
  fn.showSpinner = function () {
    if (this.spinner) {
      this.$el.find('.deckster-card-overlay').show();
      this.spinner.spin(this.$el.find('.deckster-card-content')[0]);
    }
    return this;
  };


  /**
   * Hides the loading spinner
   *
   * @method hideSpinner
   * @returns {Card}
   */
  fn.hideSpinner = function () {
    if (this.spinner) {
      this.$el.find('.deckster-card-overlay').hide();
      this.spinner.stop();
    }
    return this;
  };


  /**
   * Loads the given HTML content into the specified section for this card
   *
   * @method setCardContent
   * @param section {String} 'summary'|'details'
   * @param html {HTMLElement|String} content for this section
   * @param reloading whether or not the card is being reloaded
   * @return {Card}
   */
  fn.setCardContent = function (section, html, reloading) {
    var $container = this.$el.find('.deckster-card-content .deckster-' + section);
    $container.empty();
    $container.html(html);

    this[section + 'Loaded'] = true;
    section === 'summary' ? this.options.onSummaryLoad(this) : this.options.onDetailsLoad(this);

    if (reloading && this.currentSection === section) {
      this.options.onReload(this);
    }

    this.loadLeftControls();
    this.loadRightControls();
    this.loadCenterControls();

    this.hideSpinner();
    return this;
  };

  var getCardHtml = function(url, cb) {
    $.get(url, cb);
  };


  /**
   * Loads the content for the left controls on the card header
   * @returns {Card}
   */
  fn.loadLeftControls = function() {
    if ($.isFunction(this.options.leftControlsHtml)) {
      this.options.leftControlsHtml(this, $.proxy(function (html) {
        this.$el.find('.deckster-card-controls.left').empty().html(html);
      }, this));
    } else if (this.options.leftControlsHtml) {
      this.$el.find('.deckster-card-controls.left').empty().html(this.options.leftControlsHtml);
    } else if (this.options.leftControlsContentUrl) {
      getCardHtml(this.options.leftControlsContentUrl, $.proxy(function(html) {
        this.$el.find('.deckster-card-controls.left').empty().html(html);
      }, this));
    }
    return this;
  };


  /**
   * Loads the content for the right controls on the card header
   * @returns {Card}
   */
  fn.loadRightControls = function() {
    if ($.isFunction(this.options.rightControlsHtml)) {
      this.options.rightControlsHtml(this, $.proxy(function (html) {
        this.$el.find('.deckster-card-controls.right').empty().html(html);
      }, this));
    } else if (this.options.rightControlsHtml) {
      this.$el.find('.deckster-card-controls.right').empty().html(this.options.rightControlsHtml);
    } else if (this.options.rightControlsContentUrl) {
      getCardHtml(this.options.rightControlsContentUrl, $.proxy(function(html) {
        this.$el.find('.deckster-card-controls.right').empty().html(html);
      }, this));
    }
    return this;
  };

  /**
   * Loads the content for the center controls on the card header
   * @returns {Card}
   */
  fn.loadCenterControls = function() {
    if ($.isFunction(this.options.centerControlsHtml)) {
      this.options.centerControlsHtml(this, $.proxy(function (html) {
        this.$el.find('.deckster-card-controls.center').empty().html(html);
      }, this));
    } else if (this.options.centerControlsHtml) {
      this.$el.find('.deckster-card-controls.center').empty().html(this.options.centerControlsHtml);
    } else if (this.options.centerControlsContentUrl) {
      getCardHtml(this.options.centerControlsContentUrl, $.proxy(function(html) {
        this.$el.find('.deckster-card-controls.center').empty().html(html);
      }, this));
    }
    return this;
  };


  /**
   * Loads the summary content for this card
   *
   * @param reloading whether or not the card is being reloaded
   * @method loadSummaryContent
   * @return {Card}
   */
  fn.loadSummaryContent = function (reloading) {
    this.showSpinner();
    if ($.isFunction(this.options.summaryContentHtml)) {
      this.options.summaryContentHtml(this, $.proxy(function (html) {
        this.setCardContent('summary', html, reloading);
      }, this));
    } else if (this.options.summaryContentHtml) {
      this.setCardContent('summary', this.options.summaryContentHtml, reloading);
    } else if (this.options.summaryContentUrl) {
      getCardHtml(this.options.summaryContentUrl, $.proxy(function(html) {
        this.setCardContent('summary', html, reloading);
      }, this));
    } else {
      this.hideSpinner();
    }
    return this;
  };


  /**
   * Loads the details content for this card
   *
   * @param reloading whether or not the card is being reloaded
   * @method loadDetailsContent
   * @return {Card}
   */
  fn.loadDetailsContent = function (reloading) {
    this.showSpinner();
    if ($.isFunction(this.options.detailsContentHtml)) {
      this.options.detailsContentHtml(this, $.proxy(function (html) {
        this.setCardContent('details', html, reloading);
      }, this));
    } else if (this.options.detailsContentHtml) {
      this.setCardContent('details', this.options.detailsContentHtml, reloading);
    } else if (this.options.detailsContentUrl) {
      getCardHtml(this.options.detailsContentUrl, $.proxy(function(html) {
        this.setCardContent('details', html, reloading);
      }, this));
    } else {
      this.hideSpinner();
    }
    return this;
  };


  /**
   * Loads the content for the specified section
   *
   * @method loadContent
   * @param section {String} 'summary'|'details'
   * @return {Card}
   */
  fn.loadContent = function (section) {
    if (section === 'summary') {
      this.loadSummaryContent();
    } else {
      this.loadDetailsContent();
    }
    return this;
  };


  /**
   * Reloads the content of this card
   * @method reloadContent
   * @return {Card}
   */
  fn.reloadContent = function () {
    return this.loadCard(true);
  };


  /**
   * Scroll to the card in the deck
   *
   * @method scrollToCard
   * @returns {Card}
   */
  fn.scrollToCard = function () {
    this.$deckster.$el.parent().animate({
      scrollTop: this.$el.offset().top
    }, this.$deckster.options.scrollToSpeed);
    return this;
  };


  /**
   * Expand the card
   *
   * @method expandCard
   * @param cb Callback to call after function has been expanded
   */
  fn.expandCard = function (cb) {
    var self = this;

    var col = this.options.expandInPlace ? this.$el.data('coords').grid.col : 1;

    this.$deckster.$gridster.expand_widget(
      this.$el,
      this.options.position.expanded_x,
      this.options.position.expanded_y || 4,
      col,
    function () {
      self.isExpanded = true;
      self.$el.find('.deckster-card-toggle')
        .removeClass('glyphicon-resize-full')
        .addClass('glyphicon-resize-small');

        if (cb) {
          cb.call(self);
        }

        self.options.onExpand(self);
    });
  };


  /**
   * Collapse the card
   *
   * @method collapseCard
   * @param cb Callback to call after function has been collapsed
   */
  fn.collapseCard = function (cb) {
    var self = this;

    this.$deckster.$gridster.collapse_widget(this.$el, function () {
      self.isExpanded = false;
      self.$el.find('.deckster-card-toggle')
        .removeClass('glyphicon-resize-small')
        .addClass('glyphicon-resize-full');

      if (cb) {
        cb.call(self);
      }

      self.options.onCollapse(self);
    });
  };


  /**
   * Toggles a card between expanded and collapsed
   *
   * @method toggleCard
   * @param cb
   */
  fn.toggleCard = function (cb) {
    if (this.options.expandable) {
      this.isExpanded ? this.collapseCard(cb) : this.expandCard(cb);
    }
  };


  /**
   * Changes the section of the card from one section to another section
   *
   * @method changeSection
   * @param newSection Section the card is being changed to
   * @param oldSection Current section
   * @returns {Card}
   */
  fn.changeSection = function (newSection, oldSection) {
    this.$el.find('.deckster-' + oldSection).fadeOut(200, $.proxy(function () {
      this.$el.find('.deckster-' + this.currentSection).fadeIn(200);
    }, this));
    return this;
  };


  /**
   * Loads and displays the specified section if its not current displayed
   *
   * @method toggleSection
   * @param section {String} 'summary'|'details'
   * @return {Card}
   */
  fn.toggleSection = function (section) {
    var prevSection = this.currentSection;

    this.currentSection = section ? section :
      (this.currentSection === 'summary') && this.hasDetails ? 'details' : 'summary';

    // If section has changed load new content
    if(this.currentSection !== prevSection) {
      this.loadContent(this.currentSection);
      if (this.options.expandable && !this.options.isPopout) {
        this.toggleCard(function () {
          this.changeSection(this.currentSection, prevSection);
        });
      } else {
        this.changeSection(this.currentSection, prevSection);
      }
    } else {
      if (this.options.expandable && !this.options.isPopout) {
        this.toggleCard();
      }
    }
    return this;
  };


  /**
   * Removes the card from the deck but saves the state so it can be recalled
   *
   * @method hideCard
   * @returns {Card}
   */
  fn.hideCard = function () {
    this.hiddenState = this.getCardData();
    this.$deckster.$gridster.remove_widget(this.$el, false);
    this.hidden = true;
    return this;
  };


  /**
   * Places the card back in the deck with the same state it had before it was hidden
   *
   * @method showCard
   * @returns {Card}
   */
  fn.showCard = function () {
    if (this.hidden && this.hiddenState) {
      this.currentSection = 'summary';
      this.$el = this.$deckster.$gridster.add_widget(
        Card.getCardHtml(this.options),
        this.hiddenState.position ? this.hiddenState.position.size_x : null,
        this.hiddenState.position ? this.hiddenState.position.size_y : null,
        this.hiddenState.position ? this.hiddenState.position.col : null,
        this.hiddenState.position ? this.hiddenState.position.row : null,
        null, null, $.proxy(function() {
          this.$el.data('deckster-card', this);
          this.loadCard();
          if (this.isExpanded) {
            this.isExpanded = false;
            this.toggleSection('details');
          }
          this.hiddenState = null;
          this.hidden = false;
        },this));
    }
    return this;
  };


  /**
   * Popout the card
   *
   * @method popoutCard
   * @returns {Card}
   */
  fn.popoutCard = function () {
    var url = this.options.getPopoutUrl(this);
    if (url) {
      window.open(url,'_blank');
    }
  };


  /**
   * Sets the object watchers for this card
   *
   * @method setWatchers
   * @returns {Card}
   */
  fn.setWatchers = function () {
    this.options.watch('title', $.proxy(function(prop, oldVal, newVal) {
      if(newVal) {
        this.$el.find('.deckster-card-title h2').html(newVal);
      }
    }, this));

    this.options.watch('expandable', $.proxy(function(prop, oldVal, newVal) {
      if(newVal) {
        this.$el.find('.deckster-card-toggle').show();
      } else {
        this.$el.find('.deckster-card-toggle').hide();
      }
    }, this));

    this.options.watch('resizable', $.proxy(function(prop, oldVal, newVal) {
      if(newVal) {
        this.$el.find('.gs-resize-handle').show();
      } else {
        this.$el.find('.gs-resize-handle').hide();
      }
    }, this));

    this.options.watch('hasPopout', $.proxy(function(prop, oldVal, newVal) {
      if(newVal) {
        this.$el.find('.deckster-card-popout').show();
      } else {
        this.$el.find('.deckster-card-popout').hide();
      }
    }, this));

    return this;
  };


  /**
   * Removes the object watchers on this card
   * @returns {Card}
   */
  fn.removeWatchers = function() {
    this.options.unwatch('title');

    this.options.unwatch('expandable');

    this.options.unwatch('resizable');

    this.options.unwatch('hasPopout');

    return this;
  };


  /**
   * Binds handlers to card element
   *
   * @method bindCardHandlers
   * @return {Card}
   */
  fn.bindCardHandlers = function () {
    this.$el.off('click.deckster-card', '.deckster-card-toggle');
    this.$el.on('click.deckster-card', '.deckster-card-toggle', $.proxy(function() {this.toggleSection();}, this));

    this.$el.off('click.deckster-card', '.deckster-card-reload');
    this.$el.on('click.deckster-card', '.deckster-card-reload', $.proxy(function() {this.reloadContent();}, this));

    this.$el.off('click.deckster-card', '.deckster-card-remove');
    this.$el.on('click.deckster-card', '.deckster-card-remove', $.proxy(function() {this.destroy();}, this));

    this.$el.off('click.deckster-card', '.deckster-card-popout');
    this.$el.on('click.deckster-card', '.deckster-card-popout', $.proxy(function() {this.popoutCard();}, this));

    return this;
  };


  /**
   * Function used to destroy the card and remove it from the deck
   * @method destroy
   */
  fn.destroy = function () {
    this.$el.off('click.deckster-card', '.deckster-card-toggle');
    this.$el.off('click.deckster-card', '.deckster-card-reload');
    this.$el.off('click.deckster-card', '.deckster-card-remove');
    this.$el.off('click.decgrukster-card', '.deckster-card-popout');
    this.removeWatchers();
    this.$deckster.removeCard(this);
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
    rootUrl: '/deckster',
    autoInit: true,
    scrollToSpeed: 1000,
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

(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["card/card"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (card.isPopout) { ;
__p += '\n<div class="deckster-card is-popout" id="' +
((__t = ( card.id )) == null ? '' : __t) +
'">\n';
 } else { ;
__p += '\n<div class="deckster-card" id="' +
((__t = ( card.id )) == null ? '' : __t) +
'">\n';
 } ;
__p += '\n    <div class="deckster-card-inner">\n        <div class="deckster-card-header">\n            <div class="deckster-card-controls left"></div>\n            <div class="deckster-card-title drag-handle">\n              <h2 class="drag-handle">' +
((__t = ( card.title )) == null ? '' : __t) +
'</h2>\n              <span class="deckster-card-controls center"></span>\n            </div>\n            <div class="deckster-default-controls">\n              <span class="deckster-card-control deckster-card-reload glyphicon glyphicon-refresh"></span>\n              <span class="deckster-card-control deckster-card-toggle glyphicon glyphicon-resize-full"></span>\n              <span class="deckster-card-control deckster-card-popout glyphicon glyphicon-new-window thin"></span>\n            </div>\n            <div class="deckster-card-controls right"></div>\n        </div>\n        <div class="deckster-card-content">\n            <div class="deckster-card-overlay"></div>\n            <div class="deckster-summary"></div>\n            <div class="deckster-details" style="display: none;"></div>\n        </div>\n        ';
 if (card.showFooter) { ;
__p += '\n        <div class="deckster-card-footer">\n          <div class="left-controls"></div>\n          <div class="right-controls">\n            <span class="deckster-card-control deckster-card-remove glyphicon glyphicon-trash"></span>\n          </div>\n        </div>\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
}})();
(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["deck/deck"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="deck gridster"></div>\n';

}
return __p
}})();
(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["deck/dock"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="deckster-deck-dock">\n</div>';

}
return __p
}})();
(function() {
window["Deckster"] = window["Deckster"] || {};
window["Deckster"]["Templates"] = window["Deckster"]["Templates"] || {};

window["Deckster"]["Templates"]["deck/toolbar"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="deckster-deck-toolbar">\n    <img class="deck-toolbar-logo" src="' +
((__t = ( deck.logoUrl )) == null ? '' : __t) +
'"/>\n    <div class="deck-search-wrapper">\n        <input type="text" class="deck-toolbar-searchbox" placeholder="' +
((__t = ( deck.searchPlaceholder )) == null ? '' : __t) +
'">\n    </div>\n    <div class="deck-toolbar-controls">\n        <span class="toolbar-control refresh glyphicon glyphicon-refresh"></span>\n        <span class="toolbar-control settings glyphicon glyphicon-cog"></span>\n        <span class="toolbar-control save glyphicon glyphicon-floppy-disk"></span>\n    </div>\n</div>';

}
return __p
}})();