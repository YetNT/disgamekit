const EventEmitter = require('events');
const { Client } = require('discord.js');

/**
 * Represents a game instance.
 * @class
 */
class Game extends EventEmitter {
    /**
     * An object in which game variables can be stored
     * @type {Object}
     * @property {boolean} gaming Game's state. Changing this will be as if `#end()` was run without emitting `gameEnded`
     */
    var = {
        gaming: false, //game state
    };
    client;

    /**
     * Constructs a new Game instance.
     * @constructor
     * @param {Client} client A Discord.js client
     * @param {string} id A unique game identifier
     */
    constructor(client, id) {
        super();
        this.client = client;
        this.id = id;
    }

    /**
     * Start game
     */
    start() {
        this.var.gaming = true;
        this.emit('start');
    }

    /**
     * Returns true/false if game is on
     * @returns boolean
     */
    isGameOn() {
        return this.var.gaming;
    }

    /**
     * Ends the game
     */
    end() {
        this.var.gaming = false;
        this.emit('end');
    }

    /**
     * Forces the game to error and ends the game
     * @param {string} error Error message
     */
    error(error) {
        // forces an error with a msg and ends the game
        this.emit('error', new TypeError(error));
        this.end();
    }

    /**
     * Handles button Interactions. can be placed beneath `game.start()`
     */
    handleButtons() {
        if (!this.isGameOn()) {
            throw new Error('Cannot handle buttons before starting the game.');
        }
        this.client.on('interactionCreate', (interaction) => {
            if (!interaction.isButton()) return; // Check if the interaction is a button interaction

            this.emit(`${this.id}-btn`, interaction);
        });
    }
}

module.exports = Game;
