import { EventEmitter } from 'events';
import { Plane } from './Plane';

export class Game extends EventEmitter {
    /**
     * Store game variables here.
     */
    var = {
        gaming: false, //game state
    };
    id: string;

    /**
     * Constructs a new Game instance.
     * @param {string} id A unique game identifier
     */
    constructor(id: string) {
        super();
        this.id = id;
    }

    /**
     * Starts the game
     */
    start(): void {
        this.var.gaming = true;
        this.emit('start');
    }

    /**
     * Returns true or false (Game's state)
     */
    isGameOn(): boolean {
        return this.var.gaming;
    }

    /**
     * End's the game
     * @param {any} interaction Pass the interaction that was associated with the game. If null it will not do anythinng to the message. (Discord.js or Eris)
     * @param {string} custom Pass a custom string to be sent to the event listener.
     * @param {Plane} plane Pass the Plane to be cleared as the game ends.
     */
    end(interaction?: any, custom?: string, plane?: Plane): void {
        this.var.gaming = false;
        if (interaction) {
            custom !== undefined || custom !== null
                ? this.emit('end', interaction, custom)
                : this.emit('end', interaction);
        } else {
            this.emit('end');
        }
        if (plane) {
            plane.clear();
        }
    }

    /** I aint sure bout this one, is it really needed?
     * 
     * Forces the game to error and ends the game
     * @param {string} error Error message
     *
    error(error: Function): void {
        // forces an error with a msg and ends the game
        this.emit('error', new error());
        this.end();
    }
    */

    /**
     * Listens for when the game starts
     */
    on(event: 'start', listener: () => void): this;
    /**
     * Listens for when the game ends.
     */
    on(
        event: 'end',
        listener: (interaction: any, custom: string) => void
    ): this;

    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
