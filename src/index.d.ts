import { EventEmitter } from 'events';

/**
 * Represents a game instance.
 */
declare class Game extends EventEmitter {
    /**
     * Game variables.
     */
    var: {
        /**
         * Game's state.
         */
        gaming: boolean;
    };
    /**
     * Game's Unique Identifier
     */
    id: string;

    /**
     * Constructs a new Game instance.
     * @param {string} id A unique game identifier
     */
    constructor(id: string);

    /**
     * Start's the game
     */
    start(): void;

    /**
     * Returns true/false if game is on
     */
    isGameOn(): boolean;

    /**
     * End's the game
     * @param {Interaction} interaction Pass the interaction that was associated with the game. If null it will not do anythinng to the message. (Discord.js or Eris)
     * @param {string} custom Pass a custom string to be sent to the event listener.
     * @param {Plane} plane Pass the Plane to be cleared as the game ends.
     */
    end(interaction?: Interaction, custom?: string, plane?: Plane): void;

    /**
     * Forces the game to error and ends the game
     * @param {string} error Error message
     */
    error(error: string): void;

    /**
     * Listens for when the game starts
     */
    on(event: 'start', listener: () => void): this;
    /**
     * Listens for when the game ends.
     */
    on(
        event: 'end',
        listener: (interaction: Interaction, custom: string) => void
    ): this;
    /**
     * Listens for when an error occurs
     */
    on(event: 'error', listener: (error: TypeError) => void): this;
}

/**
 * A 2d plane
 */
declare class Plane extends EventEmitter {
    /**
     *
     * @param {Game} game Pass the game object
     * @param {number} rows Amount of rows
     * @param {number} columns Amount of columns
     * @param {string|null} blank The string that represents a default character in the plane.
     */
    constructor(
        game: Game,
        rows: number,
        columns: number,
        blank?: string | null
    );

    /**
     * The string that represents a default character in the plane.
     */
    blank: any;
    /**
     * The actual plane itself in it's raw form.
     */
    plane: string[][];
    /**
     * Plane's objects
     */
    objects: {
        /**
         * ID's of object cached on the plane. This is updated whenever the plane is updated.
         */
        ids: string[];
        /**
         * some planeobjects defined by the ids
         */
        objects: { [id: string]: PlaneObject };
    };

    /**
     *
     * @param {string} inputValue Lookup an objects id
     * @returns {object|null} {x:?, y:?}
     */
    lookupObj(inputValue: string): { x: number; y: number } | null;

    /**
     *
     * @param {number} x X Coordinate
     * @param {number} y Y Coordinate
     * @returns {string|undefined}
     */
    lookupCoords(x: number, y: number): string | undefined;

    /**
     * Clears the entire grid, removing every object. (Preserves object coordinates)
     */
    clear(): void;

    /**
     *
     * @param  {...PlaneObject} arr Objects to be updated on plane
     */
    update(...arr: PlaneObject[]): void;

    /**
     *
     * @param {string} row Split rows, default is null (assumes you use emojis for planes.)
     * @param {string} column Split columns, default is a line break.
     * @returns String with output plane.
     */
    return(row?: string, column?: string): string;
}

/**
 * An object to be represented on a plane
 * @class
 */
declare class PlaneObject {
    /**
     *
     * @param {Plane} plane The plane instance that this wil be placed on.
     * @param {number} x X coordinate origin, X axis origin is (0) (bottom left hand corner)
     * @param {number} y Y coordinate origin, Y axis origin is (0) (bottom left hand corner)
     * @param {string} id A unique object ID
     * @param {string} value An emoji for said object to display on the plane. Defaults to objectID
     * @param {boolean} detectCollision Detect collision on other Objects.
     */
    constructor(
        plane: Plane,
        x: number,
        y: number,
        id: string,
        value?: string,
        detectCollision?: boolean
    );

    /**
     * X coordinate
     */
    x: number;
    /**
     * Y coordinate
     */
    y: number;
    /**
     *  Unique Identifier
     */
    id: string;
    /**
     * Value for it to return when displayed on the plane.
     */
    value: string;
    /**
     * Detect collision, if false, it will pass through existing PlaneObjects
     */
    detectCollision: boolean;

    /**
     * Emitted when a collision occurs with another object.
     *
     * @event PlaneObject#collision
     * @param {PlaneObject | string} collidedObj - The collided object or a string representing the collision.
     */
    on(
        event: 'collision',
        listener: (collidedObj: PlaneObject | object) => void
    ): this;
}

/**
 * @class
 * Class for handling Turn based games.
 */
declare class Turns extends EventEmitter {
    /**
     *
     * @param {Player} players The plane instance that this wil be placed on.
     */
    constructor(...players: Player);

    /**
     *
     * @param {Player} player Player to be added to the Turns arrrray
     */
    addPlayer(player: Player): void;

    /**
     *
     * @param {Player} player Player to be removed from the Turns arrrray
     */
    removePlayer(player: Player): void;

    /**
     * Start by adding the first player as the current player
     */
    startTurns(): void;

    /**
     * 
     * @param {Player} overridePlayer Overrides with a player, if overriden with a player who recently had a turn, they'll have an extra turn
     */
    nextTurn(overridePlayer?: Player): void;

    /**
     * Reverses the order of the turns 
     */
    reverseOrder(): void

    /**
     * The current player. If `startTurns` was not run, this will be equal to undefined
     */
    currentPlayer: Player;
}

/**
 * @class
 * Player class for the Turns class
 */
declare class Player {
    
    /**
     * 
     * @param id Unique Id for the player
     * @param name Name for said Player
     */
    constructor(id: string, name: string);
}

export { Game, Plane, PlaneObject, Turns, Player };
