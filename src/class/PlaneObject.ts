import { EventEmitter } from 'events';
import { Plane } from './Plane';

/**
 * An object to be represented on a plane
 * @class
 */
export class PlaneObject extends EventEmitter {
    plane: { c: number; r: number };
    origin: { x: number; y: number };
    _x: number;
    _y: number;
    /**
     * Unqiue identifier
     */
    id: string;
    /**
     * Detect Collision, if false, it will pass thorugh objects without emitting an event.
     */
    detectCollision: boolean;
    /**
     * Value for it to return when displaying an empty region on the plane.
     */
    value: string;
    ai: { ai: boolean; target: PlaneObject | undefined; running: boolean };
    /**
     *
     * @param {Plane} plane plane
     * @param {number} x X coordinate, origin is (0) (top left hand corner) [Not zero idnexed]
     * @param {number} y Y coordinate, origin is (0) (top left hand corner) [Not zero indexed]
     * @param {string} id A unique object ID
     * @param {string} value An emoji for said object to display on the plane. Defaults to objectID
     * @param {boolean} detectCollision Detect collision on other Objects.
     * @param {boolean} ai PlaneObject AI (Moves by itself to desired target)
     */
    constructor(
        plane: Plane,
        x: number,
        y: number,
        id: string,
        value?: string,
        detectCollision?: boolean,
        ai?: boolean
    ) {
        super();
        this.plane = { c: plane.columns, r: plane.rows };
        this._x = x;
        this._y = y;
        this.id = id;
        this.origin = { x: x, y: y };
        this.detectCollision =
            detectCollision === undefined ? true : detectCollision;
        this.value = value === undefined ? id : value;
        this.ai = { ai: ai, target: undefined, running: false };
    }

    // -1 for 0 based indexing.

    set x(value) {
        let out = 0;
        if (value < 0) {
            out = value - value;
            this.collide('wall');
        } else if (value > this.plane.r - 1) {
            out = this.plane.r - 1;
            this.collide({ id: 'wall', value: 'wall' });
        } else {
            out = value;
        }
        this._x = out;
    }

    /**
     * X coordinate
     */
    get x() {
        return this._x;
    }

    set y(value) {
        let out = 0;
        if (value < 0) {
            out = value - value;
            this.collide('wall');
        } else if (value > this.plane.c - 1) {
            out = this.plane.c - 1;
            this.collide({ id: 'wall', value: 'wall' });
        } else {
            out = value;
        }
        this._y = out;
    }

    /**
     * Y coordinate
     */
    get y() {
        return this._y;
    }

    /**
     *
     * @param {object|string} what What collided with this object?
     */
    collide(what: Object | string): void {
        if (this.detectCollision) {
            this.emit('collision', what);
        } // If it's false don't emit anything. Although wall on the other hand cannot be passed through
    }

    /**
     * Is this object an AI?
     */
    isAi(): boolean {
        return this.ai.ai;
    }

    /**
     * STart the Ai instance
     * @param {PlaneObject} target STart targetting specific object.
     * @returns
     */
    start(target: PlaneObject) {
        if (!this.isAi()) return new TypeError(`${this.id} is not an AI.`);
        if (!(target instanceof PlaneObject))
            return new TypeError('Target must be typeof PlaneObject class.');
        this.ai.target = target;
        this.ai.running = true;
    }

    /**
     * Step 1 closer to the target.
     * @param {PlaneObject} target Override target (Switches to another target globally)
     */
    step(target?: PlaneObject) {
        target = target === undefined ? this.ai.target : target;
        if (!this.isAi()) return new TypeError(`${this.id} is not an AI.`);
        if (!this.ai.running) return new Error('AI has not been started.');
        this.ai.target = target;
        let newCoords = this.#calcNextStep(target.x, target.y);
        this.x = newCoords.x;
        this.y = newCoords.y;
    }

    /**
     * Stop running the AI
     * @returns void
     */
    stop() {
        if (!this.isAi()) return new TypeError(`${this.id} is not an AI.`);
        if (!this.ai.running) return new Error('AI has not been started.');
        this.ai.running = false;
    }

    /**
     * Calculate the next step towards a target position.
     * @param {number} targetX Target X coordinate
     * @param {number} targetY Target Y coordinate
     * @returns {{ x: number, y: number } | null} Object with next step's coordinates, or null if no path found
     */
    #calcNextStep(
        targetX: number,
        targetY: number
    ): { x: number; y: number } | null {
        const deltaX = Math.sign(targetX - this.x);
        const deltaY = Math.sign(targetY - this.y);

        if (deltaX === 0 && deltaY === 0) {
            return null; // Already at target
        }

        // Move in the direction that gets closer to the target
        const nextX = this.x + deltaX;
        const nextY = this.y + deltaY;

        return { x: nextX, y: nextY };
    }
}
