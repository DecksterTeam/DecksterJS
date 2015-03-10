
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

      $deckster.addCard(testCard);

      expect($deckster.getCards().length).toBe(1);
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
