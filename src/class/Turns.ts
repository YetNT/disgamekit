import { EventEmitter } from 'events';

export class Turns extends EventEmitter {
    players: Player[];
    currentPlayer: Player;
    /**
     * @constructor
     * @param {...Player} players
     */
    constructor(...players: Player[]) {
        super();
        this.players = players;
        this.currentPlayer = undefined;
    }

    /**
     * Add a player to the turns array
     * @param {Player} player Player to be added to the turns array
     */
    addPlayer(player: Player): void {
        this.players.push(player);
    }

    /**
     * Remove a player from the turns array
     * @param {Player} player Player to be removed from the turns array
     */
    removePlayer(player: Player): void {
        let index: number = this.players.indexOf(player);
        if (index !== 1) {
            this.players.splice(index, 1);
        }
    }

    /**
     * Start by adding the first player as the current player
     */
    startTurns(): void {
        this.emit('turnStart');
        this.currentPlayer = this.players[0];
    }

    /**
     *
     * @param {Player} overridePlayer Overrides with a player, if overriden with a player who recently had a turn, they'll have an extra turn
     */
    nextTurn(overridePlayer?: Player) {
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

    /**
     * Reverses the order of the turns
     */
    reverseOrder(): void {
        // reverse the order of the turns (uno refrence)
        this.players = this.players.reverse();
    }
}

/**
 * @class
 * Player class for the Turns class
 */
export class Player {
    id: string;
    name: string;

    /**
     *
     * @param id Unqiue ID for the player
     * @param name Name for said player
     */
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
