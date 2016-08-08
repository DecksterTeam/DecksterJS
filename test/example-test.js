var fixtures  = jasmine.getFixtures();

// given relative path test/fixtures/ to karma
fixtures.fixturesPath = 'base/test/fixtures/';

describe('<Unit Test>', function () {
  describe('Deckster', function () {
    it('should add deckster instance to element data', function () {
      fixtures.load('example.html');
      var $example = $('.example');

      $example.deckster();

      expect($example.data('deckster')).toBeDefined();
    });

    it('should have gridster instance', function () {
      fixtures.load('example.html');
      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      expect($deckster.$gridster).toBeDefined();
    });

    it('should add card to deck', function () {
      fixtures.load('example.html');
      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      var testCard = {
        id: 'test-card'
      };

      var flag = false;

      var funcs = {
        callback: function(card) {
        }
      };

      spyOn(funcs, 'callback');

      runs(function() {
        $deckster.addCard(testCard, function(card) {
          flag = true;
          funcs.callback(card);
        });
      });

      waitsFor(function() {
        return flag;
      }, 700);

      runs(function() {
        expect($deckster.getCards().length).toBe(1);
      });
    });

    it('should return correct view type of card', function () {
      fixtures.load('example.html');

      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      var testCard = {
        id: 'test-card',
        summaryViewType: 'test-view-type'
      };

      var flag = false;

      var funcs = {
        callback: function(card) {
        }
      };

      spyOn(funcs, 'callback');

      runs(function() {
        $deckster.addCard(testCard, function(card) {
          flag = true;
          funcs.callback(card);
        });
      });

      waitsFor(function() {
        return flag;
      }, 700);

      runs(function() {
        expect(funcs.callback).toHaveBeenCalled();
        var card = funcs.callback.mostRecentCall.args[0];
        expect(card.getCurrentViewType('summary')).toBe('test-view-type');
        expect(card.getCurrentViewType()).toBe('test-view-type');
      });

    });

    it('should return correct view options of card', function () {
      fixtures.load('example.html');

      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      var testCard = {
        id: 'test-card',
        summaryViewOptions: {testField: true}
      };

      var flag = false;

      var funcs = {
        callback: function(card) {
        }
      };

      spyOn(funcs, 'callback');

      runs(function() {
        $deckster.addCard(testCard, function(card) {
          flag = true;
          funcs.callback(card);
        });
      });

      waitsFor(function() {
        return flag;
      }, 700);

      runs(function() {
        expect(funcs.callback).toHaveBeenCalled();
        var card = funcs.callback.mostRecentCall.args[0];
        expect(card.getCurrentViewOptions('summary').testField).toBe(true);
        expect(card.getCurrentViewOptions().testField).toBe(true);
      });

    });

    it('should reload view', function () {
      var flag = false;

      var funcs = {
        reload: function(card, cardSection) {
        }
      };

      spyOn(funcs, 'reload');

      Deckster.views = {
        'test-view-type': {
          reload: funcs.reload
        }
      };

      fixtures.load('example.html');

      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      var testCard = {
        id: 'test-card',
        summaryViewType: 'test-view-type'
      };

      runs(function() {
        $deckster.addCard(testCard, function(card) {
          card.reloadView();
          flag = true;
        });
      });

      waitsFor(function() {
        return flag;
      }, 700);

      runs(function() {
        expect(funcs.reload).toHaveBeenCalled();
      });



    });

    it('card should have correct hashKey', function () {
      fixtures.load('example.html');
      var $example = $('.example');

      var $deckster = $example.deckster().data('deckster');

      var testCard = {
        id: 'test-card',
        rootUrl: '/deckster'
      };

      var flag = false;

      var funcs = {
        callback: function(card) {
        }
      };

      spyOn(funcs, 'callback');

      runs(function() {
        $deckster.addCard(testCard, function(card) {
          flag = true;
          funcs.callback(card);
        });
      });

      waitsFor(function() {
        return flag;
      }, 700);

      runs(function() {
        expect(funcs.callback).toHaveBeenCalled();
        expect(funcs.callback.mostRecentCall.args[0].$cardHashKey).toEqual(DecksterCard.getCardHash(testCard));
      });

    });

    it('card should have correct html with id', function () {
      fixtures.load('example.html');
      var expectedCardHtml = fixtures.read('expected-card-template.html').replace(/\s+/g, '');

      var testCard = {
        id: 'test-card'
      };

      expect(DecksterCard.getCardHtml(testCard).replace(/\s+/g, '')).toEqual(expectedCardHtml);
    });

  });
});
