const EventEmitter = require('events');
const { Interaction } = require('discord.js');

class Game extends EventEmitter {
    var = {
        gaming: false, //game state
    };
    client;

    constructor(client, id) {
        super();
        this.client = client;
        this.id = id;
    }

    start() {
        this.var.gaming = true;
        this.emit('start');
    }

    isGameOn() {
        return this.var.gaming;
    }

    end(interaction) {
        this.var.gaming = false;
        if (interaction) {
            this.emit('end', interaction);
        } else {
            this.emit('end');
        }
    }

    error(error) {
        // forces an error with a msg and ends the game
        this.emit('error', new TypeError(error));
        this.end();
    }

    handleButtons() {
        if (this.isGameOn()) {
            this.client.on('interactionCreate', (interaction) => {
                if (!interaction.isButton()) return; // Check if the interaction is a button interaction
                this.emit(`${this.id}-btn`, interaction);
            });
        }
    }
}

module.exports = Game;
