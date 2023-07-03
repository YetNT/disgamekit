<style>
    r {
        color: red;
    }
</style>

# djs-game

## Installation

```
npm i djs-game
```

## Game Class

### Constructor

#### Parameters

-   `client` <r>(required)</r>: Your discord.js client object
-   `id` <r>(required)</r>: The unique identifier for the game.

```js
const { Game } = require('djs-game');
/* Discord.js code ahead

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
*/
const game = new Game(client, 'gameId');
```

### Methods

#### start

Starts the game and emit's the "start" event.

```js
game.start();
```

#### isGameOn

Returns game's current state

```js
console.log(game.isGameOn()); // false
game.start();
console.log(game.isGameOn()); // true
```

#### end

Ends the game and emit's the "end" event.

```js
game.start();
console.log(game.isGameOn()); // true
game.end();
console.log(game.isGameOn()); // false
```

#### handleButtons

Handles button interactions during the game. Emits an event that is unique to the game ID when a button interaction occurs

_Throws an error if the game is not started before handling buttons_

```js
game.handleButtons(); // Error: Cannot handle buttons before starting the game.
game.start();
game.handleButtons(); // void
```

### Example use

```js
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const game = new Game(client, 'game1');

game.on('start', () => {
    console.log('Game started!');
});

game.on('end', () => {
    console.log('Game ended!');
});

game.on('error', (error) => {
    console.error('An error occurred:', error);
});

game.start();

game.handleButtons();
```
