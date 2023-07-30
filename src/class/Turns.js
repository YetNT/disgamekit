const EventEmitter = require('events');

class Turns extends EventEmitter {
    /**
     * @constructor
     * @param {...Player} players
     */
    constructor(...players) {
        super();
        this.players = players;
        this.currentPlayer = undefined;
    }

    /**
     *
     * @param {Player} player
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     *
     * @param {Player} player
     */
    removePlayer(player) {
        let index = this.players.indexOf(player);
        if (index !== 1) {
            this.players.splice(index, 1);
        }
    }

    startTurns() {
        this.emit('turnStart');
        this.currentPlayer = this.players[0];
    }

    /**
     *
     * @param {Player} overridePlayer
     */
    nextTurn(overridePlayer = undefined) {
        // override player makes player have an extra turn
        if (overridePlayer === undefined || overridePlayer === null) {
            let index =
                this.currentPlayer !== undefined
                    ? this.players.indexOf(this.currentPlayer)
                    : -1;
            let nextPos = index + 1 === this.players.length ? 0 : index + 1;
            this.currentPlayer = this.players[nextPos];
        } else {
            if (overridePlayer instanceof Player !== true) {
                throw new TypeError(
                    'overridePlayer should be an instance of Player class.'
                );
            }

            this.currentPlayer = overridePlayer;
        }
    }

    reverseOrder() {
        // reverse the order of the turns (uno refrence)
        this.players = this.players.reverse;
    }
}

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

module.exports = { Turns, Player };
