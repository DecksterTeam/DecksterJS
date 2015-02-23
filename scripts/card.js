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