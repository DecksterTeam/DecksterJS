<a name="0.2.23"></a>
### 0.2.23 (2015-06-30)


#### Bug Fixes

* **card:** ie8 issues with object.watchit to allow for this to degrade gracefully exposed t ((97458f9c))


<a name="0.2.22"></a>
### 0.2.22 (2015-05-17)


#### Bug Fixes

* **card:** card html content only gets reloaded if on currentSection ((5827570a))


<a name="0.2.21"></a>
### 0.2.21 (2015-05-17)


#### Features

* **card:** now passing section type through on certain callbacks ((f04f1f70))


<a name="0.2.20"></a>
### 0.2.20 (2015-05-17)


#### Bug Fixes

* **card:** fixing scrollToCard issue. using parents to traverse up dom tree until parent is ((428679da))


<a name="0.2.19"></a>
### 0.2.19 (2015-05-15)


#### Bug Fixes

* **card:** fixing issue seen in FF with native object.watch using our own internal watchit  ((b2d16fcc))


<a name="0.2.18"></a>
### 0.2.18 (2015-05-05)


#### Features

* **card:** expose resize function to resize each card view ((79931943))


<a name="0.2.17"></a>
### 0.2.17 (2015-05-04)


#### Bug Fixes

* **card:** fixed issues with callback timing, added functions for resizing summary/detail v ((f4bf840d))


<a name="0.2.16"></a>
### 0.2.16 (2015-05-04)


#### Features

* **card:** adding ability to specify summaryViewType or detailsViewType to prepopulate view ((5b228906))


<a name="0.2.15"></a>
### 0.2.15 (2015-04-30)


#### Features

* **card:** allows user to set custom popoutCard function instead of using a url ((ba4d5d5d))


<a name="0.2.14"></a>
### 0.2.14 (2015-04-27)


#### Bug Fixes

* **deckster:** if a card is hidden it won't load ((d1a5067b))


#### Features

* **card:** user can now configure whether or not to make card reloadable (variable is watch ((da29f4e9))
* **deckster:** user can now specifiy the scrollContainer for the deck ((bfe3d64e))


<a name="0.2.13"></a>
### 0.2.13 (2015-04-16)


#### Bug Fixes

* **card:** fixing other popout expand bug ((7bf5042c))


#### Features

* **card:** hasPopout is now observed ((62405607))


<a name="0.2.12"></a>
### 0.2.12 (2015-04-16)


#### Bug Fixes

* **card:**
  * hide spinner when there is no content ((e6554455))
  * fixed  $gridster undefined issue with creating popout ((8e243baa))


#### Features

* **card:** allow user to define popout url ((9d575d36))


<a name="0.2.11"></a>
### 0.2.11 (2015-04-10)


<a name="0.2.10"></a>
### 0.2.10 (2015-04-10)


<a name="0.2.9"></a>
### 0.2.9 (2015-04-10)


<a name="0.2.8"></a>
### 0.2.8 (2015-04-09)


#### Features

* **card:** adding reload callback ((513ade55))


<a name="0.2.7"></a>
### 0.2.7 (2015-04-08)


#### Bug Fixes

* **card:** fixed bug with duplicate spinner initialization, removed card icons ((c8cc4e66))


<a name="0.2.6"></a>
### 0.2.6 (2015-04-08)


#### Features

* **card:** added loading spinner to each card, allow cards to be hidden/shown in deck ((bb639ccf))


<a name="0.2.5"></a>
### 0.2.5 (2015-04-06)


<a name="0.2.4"></a>
### 0.2.4 (2015-03-24)


#### Bug Fixes

* **deckster:**
  * removing deckster instance from dom on destroy ((b95c17ef))
  * fixing issues with AMD definitions ((ca1ee16e))
  * fixing issues with AMD definitions ((14492794))


<a name="0.2.4"></a>
### 0.2.4 (2015-03-24)


#### Bug Fixes

* **deckster:** removing deckster instance from dom on destroy ((b95c17ef))


<a name="0.2.4"></a>
### 0.2.4 (2015-03-24)


#### Bug Fixes

* **deckster:**
  * fixing issues with AMD definitions ((ca1ee16e))
  * fixing issues with AMD definitions ((14492794))


<a name="0.2.3"></a>
### 0.2.3 (2015-03-18)


#### Features

* **deckster:** add clearDeck function which allows users to remove all cards from the deck ((fd11bae3))


<a name="0.2.2"></a>
### 0.2.2 (2015-03-13)


#### Features

* **card:** adding watchers to card options to update card data when the options are changed ((21c0eb1d))


<a name="0.2.1"></a>
### 0.2.1 (2015-03-11)


#### Features

* **card:** adding scrollToCard functionality feat(card): added fieldsToSerialize option tha ((b9d9ba20))
* **deckster:**
  * deckster now adds the deck element to the wrapper container ((068f6f4d))
  * added scrollToSpeed to allow user to specify speed the card is scrolled to ((828a58cd))


<a name="0.2.0"></a>
## 0.2.0 (2015-03-10)


#### Bug Fixes

* **deckster:** fixed issue with duplicate cards getting added to deck feat(deckster): added abi ((70788ecd))


#### Features

* **card:**
  * allow card to expand when only summary content is added feat(card): provided onR ((9268a27f))
  * added base for prepackaged map deckster map card ((67791450))
  * adding ability to load custom functions in top right corner of card ((bcadbf34))
  * adding ability to load custom functions in top right corner of card ((bee24483))


<a name="0.1.0"></a>
## 0.1.0 (2015-02-24)


#### Bug Fixes

* **deckster:**
  * fixing card template for popouts ([f83784be](https://github.com/DecksterTeam/DecksterJS/commit/f83784be4182aaeab2bdce3b8e85aef36c489324))
  * fixing card template for popouts ([ce6f342c](https://github.com/DecksterTeam/DecksterJS/commit/ce6f342cd3cd85c43671953f9313af07cdb4b44d))
  * fixing card template for popouts ([5bad5632](https://github.com/DecksterTeam/DecksterJS/commit/5bad5632f3c9f58a226ee90b3423485c0c3bf7e7))
  * since popout cards don't have card layout injected we need to inject that first  ([3f4af3c2](https://github.com/DecksterTeam/DecksterJS/commit/3f4af3c28a1fd7a82df2a21e7dfd31850f1bbb96))
  * since popout cards don't have card layout injected we need to inject that first  ([87836cd3](https://github.com/DecksterTeam/DecksterJS/commit/87836cd36f4dc0776a21279fc7ad3c3117cae2bd))
  * since popout cards don't have card layout injected we need to inject that first  ([56587db3](https://github.com/DecksterTeam/DecksterJS/commit/56587db3aba94c9f546a960c0f1e5b35bb69bfb7))
  * needed to loadCard before toggling the section fix(deckster): split out popout r ([ea94ad71](https://github.com/DecksterTeam/DecksterJS/commit/ea94ad71a6a9eb761c87fff54e858c3c7807d1ca))
  * fixing issue with build leaving out templates ([ddf984a7](https://github.com/DecksterTeam/DecksterJS/commit/ddf984a7848f64323318330cf4b097db246072ea))

