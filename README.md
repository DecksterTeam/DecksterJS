DecksterJS
==========
Welcome to the DecksterJS GitHub Repo!

DecksterJS is a jQuery plugin that uses gridster.js under the hood to allow a user to quickly bootstrap interactive dashboards.

Think of Deckster as a deck of cards. The deck is the dashboard and the widgets on the dashboard are the cards. Just like a deck of cards you can shuffle the cards around in the deck by dragging or resizing them.

### How to add a Deckster Deck to Your Project

#### AngularJS Projects
See [instructions for AngularJS apps](https://github.com/DecksterTeam/DecksterJS/wiki/AngularJS:--How-to-Add-a-Deckster-Deck-to-Your-Project) in the wiki.

### Instructions for Developers

##### How to Set Up the Project and Dependencies
1. Install Node.js if not already
`brew install nodejs` (if on a Mac with Homebrew)
See the [Node.js website](https://nodejs.org/en/download/) for direct installation.
2. Install bower and gulp
`npm install -g bower gulp-cli`
3. Git clone the repository
`git clone https://github.com/DecksterTeam/DecksterJS.git`
4. Install sass and compass
`gem install sass compass`
5. install dependencies listed in bower.json and package.json files
`bower install && npm install`

##### How to Run Project
Run default gulp task by running `gulp` in the terminal.

##### Formatting Rules for Commit Messages
Each commit should be prefixed with either feat(x), fix(x), or chore(x), where x is the main file that has been edited. This is so that these updates will be added in the correct format to the CHANGELOG.md file.

+ feat(x) = added a new feature to x
+ fix(x) = fixed a bug with x
+ chore(x) = completed miscellaneous task related to x

Example commit message: "feat(card): allow user to define popout url"
