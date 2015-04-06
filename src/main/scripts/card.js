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
    icon: null,
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
    position : {
      size_x: 1,
      size_y: 1,
      expanded_x: null,
      expanded_y: null,
      col: 1,
      row: 1
    },
    onSummaryLoad: $.noop,
    onSummaryDisplayed: $.noop,
    onDetailsLoad: $.noop,
    onDetailsDisplayed: $.noop,
    onResize: $.noop,
    onExpand: $.noop,
    onCollapse: $.noop,
    loadData: $.noop,
    fieldsToSerialize: [
      'id',
      'cardType',
      'title',
      'icon',
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
   *    @param {String} [options.icon] Icon class used for this card
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
   * @method loadCard
   * @return {Card}
   */
  fn.loadCard = function () {
    this.loadSummaryContent();

    this.hasDetails = !!(this.options.detailsContentHtml || this.options.detailsContentUrl);

    !this.options.expandable || this.options.isPopout ? this.$el.find('.deckster-card-toggle').hide() : this.$el.find('.deckster-card-toggle').show();
    !this.options.resizable || this.options.isPopout ? this.$el.find('.gs-resize-handle').hide() : this.$el.find('.gs-resize-handle').show();
    !this.options.hasPopout || this.options.isPopout ? this.$el.find('.deckster-card-popout').hide() : this.$el.find('.deckster-card-popout').show();

    if (this.hasDetails && (!this.options.lazyLoad || this.currentSection === 'details')) {
      this.loadDetailsContent();
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
   * Loads the given HTML content into the specified section for this card
   *
   * @method setCardContent
   * @param section {String} 'summary'|'details'
   * @param html {HTMLElement|String} content for this section
   * @return {Card}
   */
  fn.setCardContent = function (section, html) {
    var $container = this.$el.find('.deckster-card-content .deckster-' + section);
    $container.empty();
    $container.html(html);

    this[section + 'Loaded'] = true;
    section === 'summary' ? this.options.onSummaryLoad(this) : this.options.onDetailsLoad(this);
    this.loadLeftControls();
    this.loadRightControls();
    this.loadCenterControls();

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
   * @method loadSummaryContent
   * @return {Card}
   */
  fn.loadSummaryContent = function () {
    if ($.isFunction(this.options.summaryContentHtml)) {
      this.options.summaryContentHtml(this, $.proxy(function (html) {
        this.setCardContent('summary', html);
      }, this));
    } else if (this.options.summaryContentHtml) {
      this.setCardContent('summary', this.options.summaryContentHtml);
    } else if (this.options.summaryContentUrl) {
      getCardHtml(this.options.summaryContentUrl, $.proxy(function(html) {
        this.setCardContent('summary', html);
      }, this));
    }
    return this;
  };


  /**
   * Loads the details content for this card
   * @method loadDetailsContent
   * @return {Card}
   */
  fn.loadDetailsContent = function () {
    if ($.isFunction(this.options.detailsContentHtml)) {
      this.options.detailsContentHtml(this, $.proxy(function (html) {
        this.setCardContent('details', html);
      }, this));
    } else if (this.options.detailsContentHtml) {
      this.setCardContent('details', this.options.detailsContentHtml);
    } else if (this.options.detailsContentUrl) {
      getCardHtml(this.options.detailsContentUrl, $.proxy(function(html) {
        this.setCardContent('details', html);
      }, this));
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
    return this.loadCard();
  };


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
        } else {
          self.options.onExpand.call(self);
        }
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
      } else {
        self.options.onCollapse.call(self);
      }
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
      if (this.options.expandable) {
        this.toggleCard(function () {
          this.changeSection(this.currentSection, prevSection);
        });
      } else {
        this.changeSection(this.currentSection, prevSection);
      }
    } else {
      if (this.options.expandable) {
        this.toggleCard();
      }
    }
    return this;
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
    this.removeWatchers();
    this.$deckster.removeCard(this);
  };

  return Card;

}));
