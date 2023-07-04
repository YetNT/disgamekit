const EventEmitter = require('events');

class Game extends EventEmitter {
    var = {
        gaming: false, //game state
    };

    constructor(id) {
        super();
        this.id = id;
    }

    start() {
        this.var.gaming = true;
        this.emit('start');
    }

    isGameOn() {
        return this.var.gaming;
    }

    end(interaction, plane) {
        this.var.gaming = false;
        if (interaction) {
            this.emit('end', interaction);
        } else {
            this.emit('end');
        }
        if (plane) {
            plane.clear();
        }
    }

    error(error) {
        // forces an error with a msg and ends the game
        this.emit('error', new TypeError(error));
        this.end();
    }
}

module.exports = Game;
