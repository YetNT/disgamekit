const EventEmitter = require("events");

class Game extends EventEmitter {
    gaming = false; //game state
    client;
    constructor(client, id) {
        super();
        this.client = client;
        this.id = id;
    }

    /**
     * Start game
     */
    start() {
        this.gaming = true;
        this.emit("gameStarted");
    }

    /**
     * Returns true/false if game is on
     * @returns boolean
     */
    isGameOn() {
        return this.gaming;
    }

    /**
     * Ends the game
     */
    end() {
        this.gaming = false;
        this.emit("gameEnded");
    }

    /**
     * Forces the game to error and ends the game
     * @param {string} error Error message
     */
    error(error) {
        // forces an error with a msg and ends the game
        this.emit("error", new TypeError(error));
        this.end();
    }

    /**
     * Handles button Interactions. can be placed beneath `game.start()`
     */
    handleButtons() {
        if (!this.isGameOn()) {
            throw new Error("Cannot handle buttons before starting the game.");
        }
        this.client.on("interactionCreate", (interaction) => {
            if (!interaction.isButton()) return; // Check if the interaction is a button interaction

            this.emit(`${this.id}-btn-${interaction.customId}`, {
                // Emits "gameId-btn-customid", Since if you have multiple running all will be calling the same button, but with gameId instance it will only call one
                id: interaction.customId,
                user: interaction.user,
                gameId: this.id,
            });
        });
    }
}

module.exports = Game;
