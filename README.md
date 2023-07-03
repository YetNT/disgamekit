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

##### Parameters

-   `interaction`: Interaction associated with the game

```js
game.start();
console.log(game.isGameOn()); // true
game.end(interaction); // so that when the end event is emitted you can edit an embed or do something to a message.
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

const gameId = 'game`';
const game = new Game(client, gameId);

game.on('start', () => {
    console.log('Game started!');
});

game.on('end', () => {
    console.log('Game ended!');
});

game.on('error', (error) => {
    console.error('An error occurred with the game!:', error);
});

game.start();

game.handleButtons();

// Event that is emitted when a button is clicked.
game.on(`${gameId}-btn`, (interaction) => {
    interaction.update('cool');
});
```

In the example above, a new `Game` instance is created with a game client and a unique ID. Event listeners are added for the `start`, `end`, and `error` events. The game is started using `game.start()` and `handleButtons()` method is called to handle button interactions.
Lastly we add an event listener for button interactions. `(game's id)-btn`

## Plane Class

The `Plane` class represents a grid-based 2d plane and provides methods to manage and manipulate objects on the plane.

### Constructor

#### Parameters

-   `game` <r>(required)</r>: The game instance associated with the plane.
-   `rows` <r>(required)</r>: The number of rows in the plane.
-   `columns` <r>(required)</r>: The number of columns in the plane.
-   `blank`: The default value for empty cells in the plane. Defaults to `null`

```js
const { Game, Plane } = require('djs-game');
/* Discord.js code ahead

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
*/
const game = new Game(client, 'gameId');

const plane = new Plane(game, 5, 5, 'blank');
```

### Methods

#### lookupObj

Looks up an object's coordinates based on its ID.

##### Parameters

-   `inputValue`: The ID of the object to be looked up on the plane.

```js
// If an object with the ID: qwert was at x:2 y: 6
plane.lookupObj('qwert'); // { x: 2, y: 6 }
```

#### lookupCoords

Looks up the value at the specified x and y coordinates on the plane

##### Parameters

-   `x`: The x-coordinate.
-   `y`: The y-coordinate

```js
plane.lookupCoords(2, 6); // "qwert"
```

#### clear

Clears the entire plane, removing all objects while preserving their coordinates.

```js
plane.clear();
```

#### update

Adds/Updates/Removes Objects on the plane.
If provided : It will update/add to the plane
If not provided : It will clear the plane of any objects.

##### Parameters

-   `...arr`: Numerous objects to be updated on the plane.

```js
plane.update(object1, object2, object3, object4);
```

#### return

Reutrns a string representation of the plane, with optional row and column separators.

##### Parameters

-   `row`: The separator for rows. Defaults to an empty string.
-   `column`: The separator for columns. Defaults to a line break

```js
// For example, the plane has 5 rows and 5 columns
plane.return('', '\n');
/*
blank blank blank blank blank
blank blank blank blank blank
blank blank blank blank blank
blank blank blank blank blank
blank blank blank blank blank
*/
```

## PlaneObject Class

Represents an object to be placed on the plane.

### Constructor

#### Parameters

-   `x`: <r>(required)</r>: The object's origin on the x-axis
-   `y`: <r>(required)</r>: The object's origin on the y-axis
-   `id`: <r>(required)</r>: A unique identifier for the object.
-   `value`: The emoji or value to display on the plane for said object. Defaults to the object's ID.
-   `detectCollision`: Whether to detect collisions with other objects. Defaults to `true`

```js
const { PlaneObject } = require('djs-game');

let hat = new PlaneObject(0, 0, 'hat', '🧢');
```

## Exmaple use (Plane & PlaneObject)

```js
const { Plane, PlaneObject } = require('djs-game');

// Create a game instance
const game = new Game();

// Create a plane with 5 rows and 5 columns
const plane = new Plane(game, 5, 5);

// Create plane objects
const object1 = new PlaneObject(2, 2, 'obj1', 'A');
const object2 = new PlaneObject(3, 3, 'obj2', 'B');

// Update the plane with the objects
plane.update(object1, object2);

// Lookup object coordinates
const coordinates1 = plane.lookupObj('obj1');
console.log('Object 1 coordinates:', coordinates1); // Output: Object 1 coordinates: { x: 2, y: 2 }

// Lookup value at coordinates
const value = plane.lookupCoords(3, 3);
console.log('Value at coordinates (3, 3):', value); // Output: Value at coordinates (3, 3): B

// Clear the plane
plane.clear();

// Update the plane with a single object
const object3 = new PlaneObject(1, 1, 'obj3', 'C');
plane.update(object3);

// Return the plane as a string
const planeString = plane.return(' ', '\n');
console.log(planeString);
/* Output:
null null null null null
null null null null null
null null C null null
null null null null null
null null null null null
*/
```

In the example above, we create a game instance and then create a `Plane` instance with 5 rows and 5 columns. We create `PlaneObject` instances (`object1` and `object2`) with origin coordinates and values. The plane is then updated with these objects using the `update()` method.

We perform lookups on the plane using the `lookupObj()` method to retrieve the coordinates of `object1`, and the `lookupCoords()` method to retrieve the value at coordinates `(3, 3)`.

The plane is cleared using the `clear()` method and then updated with a new object (`object3`). Finally, we return the plane as a string representation using the `return()` method and print it to the console.

## Example use (Plane, PlaneObject & Game)
