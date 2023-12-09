<h1 align="center"> disgamekit </h1>
<p align="center">
<img alt="Static Badge" src="https://img.shields.io/badge/version-2.2.0-baige">
</p>

A small package that will help making ts/js discord bot mini games way easier!
(placeholder for game example)

## Installation

```
npm i disgamekit
```

## Table of Contents

-   [Game Class](#game-class)
-   -   [Constructor](#constructor)
-   -   [Methods](#methods)
-   -   [Events](#events)
-   -   [Example](#example-use)
-   [Plane Class](#plane-class)
-   -   [Constructor](#constructor-1)
-   -   [Methods](#methods-1)
-   [PlaneObject Class](#planeobject-class)
-   -   [Constructor](#constructor-2)
-   -   [Methods](#methods-2)
-   -   [Events](#events-1)
-   -   [Example (plane + planeobject)](#exmaple-use-plane--planeobject)
-   [ComplexPlaneObject](#complexplaneobject-class)
-   -   [Constructor](#constructor-3)
-   -   [Methods](#methods-3)
-   [All classes exmaple](#example-discordjs)
-   [Turns Class](#turns-class)
-   -   [Constructor](#constructor-4)
-   -   [Methods](#methods-4)
-   [Player Class (Turns)](#player-class)
-   -   [Constructor](#constructor-5)

## Game Class

The Game class represents a simple game controller with start, end, and error handling functionality. It manages the overall state of the game and provides methods to start, end, and handle game events.

### Constructor

#### Parameters

-   `id` : The unique identifier for the game.

```js
const { Game } = require('disgamekit');
const game = new Game('gameId');
```

### Methods

#### `start`

Starts the game and emit's the "start" event.

```js
game.start();
```

#### `isGameOn`

Returns game's current state

```js
console.log(game.isGameOn()); // false
game.start();
console.log(game.isGameOn()); // true
```

#### `end`

Ends the game and emit's the "end" event.

##### Parameters

-   `interaction`:**(optional)** Interaction associated with the game
-   `custom`:**(optional)** Pass a custom string to be sent to the event listener.
-   `plane`:**(optional)** Pass the plane to be reset.

```js
game.start();
console.log(game.isGameOn()); // true
game.end(interaction); // so that when the end event is emitted you can edit an embed or do something to a message.
console.log(game.isGameOn()); // false
```

### Events

#### "start"

Fired when the game starts

```js
const { Game } = require('disgamekit');

let game = new Game('game');
game.on('start', () => {
    console.log('Game sucessfully started!');
});
```

#### "end"

Fired when the game ends

```javascript
const { Game } = require('disgamekit');

let game = new Game('game');

game.on('end', () => {
    console.log('Game ended!');
});
game.end();

// If you have a component to end the game, you can edit the reply one last time.

game.on('end', (i) => {
    i.update('Game has ended.');
});
game.end(interaction);

// And lastly if you used a custom message
game.on('end', (i, c) => {
    i.update(c);
});
game.end(interaction, 'Game has ended.');
```

#### "error"

Fired when an error occurs.

```js
const { Game } = require('disgamekit');

let game = new Game('game');
game.on('error', (error) => {
    console.log('Error occured!' + error);
});
```

### Example use

```js
const gameId = 'game`';
const game = new Game(gameId);

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
```

In the example above, a new `Game` instance is created with a game client and a unique ID. Event listeners are added for the `start`, `end`, and `error` events. Lastly the game is started using `game.start()`.

## Plane Class

The `Plane` class represents a grid-based 2d plane and provides methods to manage and manipulate objects on the plane. All objects refrenced can be found [here](#planeobject-class)

### Constructor

#### Parameters

-   `game`: The game instance associated with the plane.
-   `rows`: The number of rows in the plane.
-   `columns`: The number of columns in the plane.
-   `blank`:**(optional)** The default value for empty cells in the plane. Defaults to `null`

```js
const { Game, Plane } = require('disgamekit');

const game = new Game('gameId');

const plane = new Plane(game, 5, 5, 'blank');
```

### Methods

#### `lookupObj`

Looks up an object's coordinates based on its ID.

##### Parameters

-   `inputValue`: The ID of the object to be looked up on the plane.

```js
// If an object with the ID: qwert was at x:2 y: 6
plane.lookupObj('qwert'); // { x: 2, y: 6 }
```

#### `lookupCoords`

Looks up the value at the specified x and y coordinates on the plane

##### Parameters

-   `x`:**(optional)** The x-coordinate.
-   `y`:**(optional)** The y-coordinate

```js
plane.lookupCoords(2, 6); // "qwert"
```

#### `clear`

Clears the entire plane, removing all objects while preserving their coordinates.

```js
plane.clear();
```

#### `update`

Adds/Updates/Removes Objects on the plane.
If provided : It will update/add to the plane
If not provided : It will clear the plane of any objects.

##### Parameters

-   `...arr`:**(optional)** Numerous objects to be updated on the plane.

```js
plane.update(object1, object2, object3, object4);
```

#### `return`

Reutrns a string representation of the plane, with optional row and column separators.

##### Parameters

-   `row`:**(optional)** The separator for rows. Defaults to an empty string.
-   `column`:**(optional)** The separator for columns. Defaults to a line break

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

The PlaneObject class represents an object that can be placed on the Plane. It emits events for collision detection and can be used to create interactive game elements.

### Constructor

#### Parameters

-   `plane`: Plane instance.
-   `x`: The object's origin on the x-axis
-   `y`: The object's origin on the y-axis
-   `id`: A unique identifier for the object.
-   `value`:**(optional)** The emoji or value to display on the plane for said object. Defaults to the object's ID.
-   `detectCollision`:**(optional)** Whether to detect collisions with other objects. Defaults to `true`
-   `ai`: **(optional)** Enable Auto-Movement

```js
const { Plane, PlaneObject } = require('disgamekit');

let plane = new Plane(...)
let hat = new PlaneObject(plane, 0, 0, 'hat', '🧢');
```

### Methods

#### `isAi`

Check if current PlaneObject is an AI

```js
const { Plane, PlaneObject } = require('disgamekit');

let plane = new Plane(...)
let hat = new PlaneObject(plane, 0, 0, 'hat', '🧢', false, true);

hat.isAi() // true
```

#### `start`

Start tracking specified target

##### Parameters

-   `target`: another PlaneObject to target

```js
let apple = new PlaneObject(plane, 5, 5, 'apple', 'a');

hat.start(apple);
```

#### `step`

Step 1 grid space closer to the target

##### Parameters

-   `target`: **(optional)** Override current target with new target

```js
hat.step(); // since it's tracking apple at (5, 5), hat will go to (1, 1)
```

#### `stop`

Stop running the AI

```js
hat.stop();

hat.step(); // AI has not been started!
```

### Events

#### "collision"

Fired when `foo` collides with a wall or another `PlaneObject` instance

```js
const { Game, PlaneObject, Plane } = require('disgamekit');

let game = new Game('game');
let plane = new Plane(game, 4, 4);
let object = new PlaneObject(plane, 2, 0, 'object');

object.on('colllision', (i) => {
    console.log(`Object collided with ${i.id}!`);
});
```

## Exmaple use (Plane & PlaneObject)

```js
const { Plane, PlaneObject } = require('disgamekit');

// Create a game instance
const game = new Game('gameId');

// Create a plane with 5 rows and 5 columns
const plane = new Plane(game, 5, 5);

// Create plane objects
const object1 = new PlaneObject(plane, 2, 2, 'obj1', 'A');
const object2 = new PlaneObject(plane, 3, 3, 'obj2', 'B');

// Update the plane with the objects
plane.update(object1, object2);

// Check for collision (This is called when collided with a wall, even if detectCollison = false.)
object1.on('collision', (i) => {
    console.log(`${i} collided with object1!`);
});

// Lookup object coordinates
const coordinates1 = plane.lookupObj('obj1');
console.log('Object 1 coordinates:', coordinates1); // Output: Object 1 coordinates: { x: 2, y: 2 }

// Lookup value at coordinates
const value = plane.lookupCoords(3, 3);
console.log('Value at coordinates (3, 3):', value); // Output: Value at coordinates (3, 3): B

// Clear the plane
plane.clear();

// Update the plane with a single object
const object3 = new PlaneObject(plane, 1, 1, 'obj3', 'C');
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

## Example [Discord.js](https://discord.js.org/)

```js
// This works the same with interactions. But so that the code is not 6k lines long, I've used messages.
// Discord.js and disgamekit imports
const {
    Client,
    IntentsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');
const { Game, Plane, PlaneObject } = require('disgamekit');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log(`${client.user.tag} is online`);
});

// var setup
const game = new Game(client, 'game');
game.var.score = 0;
const plane = new Plane(game, 10, 10, ':green_square:');
const moveable = new PlaneObject(
    plane,
    3,
    3,
    'moveable',
    ':blue_square:',
    true
);
const nonmove = new PlaneObject(plane, 2, 2, 'nonmove', ':apple:');

// game controls
const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('up')
        .setLabel('up')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('down')
        .setLabel('down')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('left')
        .setLabel('left')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('right')
        .setLabel('right')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('end')
        .setLabel('end')
        .setStyle(ButtonStyle.Danger)
);

client.on('messageCreate', async (m) => {
    if (m.author.bot) return;
    const message = m.content;
    if (!message.includes('mjb?')) return;

    let cmd = message.split('?');

    switch (cmd[1]) {
        case 'help':
            m.reply('No.');
            break;
        case 'button':
            game.start();
            plane.update(moveable, nonmove); // show the initial state by updating the object to the grid before hand
            await m.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('g a m e')
                        .setDescription(plane.return()),
                ],
                components: [row],
            });
            break;
    }
});
// game events
game.on('start', () => {
    console.log('Game started!');
});
game.on('end', async (i) => {
    await i.update({
        content: `game has ended! Your final score = ${game.var.score}`,
        components: [],
        embeds: [],
    }); // clear buttons so no errors occur.
    console.log('Game ended!');
});
moveable.on('collision', (obj) => {
    // when the moveable collides with nonemoveable update the score, if wall, log it to the console.
    if (obj.id == nonmove.id) {
        game.var.score++;
    } else if (obj.id == 'wall') {
        // You can just use an if since it's 2 objects but i used an else if for documentation sake
        console.log('Collision with wall!');
    }
});

// game controls
client.on(`interactionCreate`, async (i) => {
    switch (i.customId) {
        case 'up':
            moveable.y++;
            await update(i, plane, moveable, nonmove);
            break;
        case 'down':
            moveable.y--;
            await update(i, plane, moveable, nonmove);
            break;
        case 'left':
            moveable.x--;
            await update(i, plane, moveable, nonmove);
            break;
        case 'right':
            moveable.x++;
            await update(i, plane, moveable, nonmove);
            break;
        case 'end':
            game.end(i);
    }
});

// helper function to make this 50 less lines.
async function update(i, plane, ...item) {
    /* 
        you don't need to make a function like this
        but due to my controls doing the same thing
        over and, over again, I made it a function.
        */
    await plane.update(...item);
    await i.update({
        embeds: [
            new EmbedBuilder()
                .setTitle(`g a m e`)
                .setDescription(plane.return())
                .setFooter({ text: `Score = ${game.var.score}` }),
        ],
        components: [row],
    });
}

// Login the Discord client with your token
client.login('your-token-here-bro');
```

This code sets up a Discord bot using the Discord.js library and integrates it with a game using the disgamekit library. Here's a breakdown of the major components:

-   Discord.js: It's used to create the Discord client, handle events, and interact with the Discord API.
-   disgamekit: This library.

The code initializes a game with a client, a plane, and plane objects. It also sets up game controls as buttons using an `ActionRowBuilder`.

When a user sends a message with the command "mjb?button", the game starts, the plane is updated with the objects, and the game state is sent as a reply with the buttons.

The game responds to interactions with the buttons, updating the position of the moveable object and updating the game state accordingly.

The game emits events for "start", "end", and "collision", which can be handled to perform actions when these events occur. (Currently) the `moveable` listens for the "collision" event and checks whether it collided with an object or the wall. If it's the wall it logs to the console. If it's the `nonmove` object, it updates the game variables stored in `game.var`.

The `update` function is a helper function that updates the game state and updates the message with the new state and buttons.

**NOTE** - The code above is set up in a way that every user plays the same game . To avoid this either initialize the variables in the message create or use a map.

## ComplexPlaneObject Class

Like the PlaneObject (without collision or AI), but can span multiple pixels on the plane.
Currently can create a line from point A to B.

### Constructor

#### Parameters

-   `plane`: Pass the plane associated with this object, like the PlaneObject

```js
const { ComplexPlaneObject, Plane } = require('disgamekit');

const plane = new Plane(/** Plane stuff**/);
const obj1 = new ComplexPlaneObject(plane);
```

### Methods

#### `draw`

Draw a line or multiples with one object.

##### Parameters

-   `...input`: Numerous Objects to be added. (Rest parameter)

```js
obj1.draw(
    {
        value: /* Emoji to display for the line*/,
        path: /* Path the line should take.*/
    },
    {
        value: ":apple:",
        path: "0, 0 -> 7, 8" // (x1, y1 -> y1, y2)
    }
)
```

#### `return`

Return an array of PlaneObjects that represent the line.

```js
const plane = new Plane(/** plane stuff */);
const obj1 = new ComplexPlaneObject(plane);

plane.update(...obj1.return()); // used a rest parameter because array.
```

## Turns Class

The Turns class manages a turn-based system for games with multiple players. It allows adding, removing, and advancing turns for players.

### Constructor

#### Parameters

-   `...players`: Numerous players to be added

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');
const player3 = new Player('3', 'Charlie');

const turns = new Turns(player1, player2, player3);
```

### Methods

#### `addPlayer`

Adds a new player to the game.

##### Parameters

-   `player`: The player represented by the player class

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');

const turns = new Turns(player1);

const player3 = new Player('3', 'Charlie');
turns.addPlayer(player3);
```

#### `removePlayer`

Removes a player from the game.

##### Parameters

-   `player`: The player represented by the player class

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');
const player3 = new Player('3', 'Charlie');

const turns = new Turns(player1, player2, player3);

turns.removePlayer(player2);
```

#### `startTurns`

Starts the turn-based game.

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');

const turns = new Turns(player1, player2);

turns.startTurns();
```

#### `nextTurn`

Advances to the next turn.

##### Parameters

-   `overridePlayer`:**(optional)** Override with an additional player, making them have an extra turn

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');

const turns = new Turns(player1, player2);

turns.startTurns();

turns.nextTurn();
```

#### `reverseOrder()`

Reverses the order of turns.

```js
const { Turns, Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');
const player3 = new Player('3', 'Charlie');

const turns = new Turns(player1, player2, player3);

turns.reverseOrder();
```

## Player Class

The Player class represents a player in the game (specifically for the Turns class). It holds a unique identifier (id) and the player's name (name).

### Constructor

#### Parameters

-   `id`: The player's unique identifier.
-   `name`: The player's name.

```js
const { Player } = require('disgamekit');

const player1 = new Player('1', 'Alice');
const player2 = new Player('2', 'Bob');
```
