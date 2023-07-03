const EventEmitter = require('events');
const Game = require('./Game');

class Plane extends EventEmitter {
    blank;
    plane;
    constructor(game, rows, columns, blank = null) {
        super();
        this.game = game;
        this.rows = rows;
        this.columns = columns;
        this.plane = this.#createGrid(blank);
        this.blank = blank;
    }

    #createGrid(blank) {
        /*
        Creates placeholder grid, 
        This grid alone without any of the other functions 
        would have it's origin at the top left.
        This is obviously because the y axis is just the plane array
        and the x axis is a nested array.
        */
        const grid = [];
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.columns; j++) {
                row.push(blank);
            }
            grid.push(row);
        }
        return grid;
    }

    objects = {
        ids: [],
        objects: {},
    };

    #reverseYAxis(y) {
        /*
        Function that reverses the y input so that the grid's origin is at the bottom left.
        Yes it is zero indexed, because Javascript is the bomb and it makes sense with actual
        graphs.
        */
        return this.plane.length - y - 1;
    }

    #add(x, y, object) {
        this.plane[this.#reverseYAxis(y)][x] = object.value;
    }

    #remove(x, y) {
        this.plane[this.#reverseYAxis(y)][x] = this.blank;
    }

    lookupObj(inputValue) {
        for (const id in this.objects.objects) {
            const object = this.objects.objects[id];
            if (object.id === inputValue) {
                return { x: object.x, y: object.y };
            }
        }
        return null; // Return null if no matching object is found
    }

    /**
     *
     * @param {number} x X Coordinate
     * @param {number} y Y Coordinate
     * @returns {string|undefined}
     */
    lookupCoords(x, y) {
        let out = this.plane[this.#reverseYAxis(y)][x];
        return out === this.blank ? undefined : out;
    }

    /**
     * Clears the entire grid, removing every object. (Preserves object coordinates)
     */
    clear() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.plane[i][j] = this.blank;
            }
        }
    }

    /**
     *
     * @param  {...PlaneObject} arr Objects to be updated on plane
     */
    update(...arr) {
        if (this.game.var.gaming == false) return;
        this.clear();
        for (const obj of arr) {
            if (obj.x < 0 || obj.y < 0) {
                throw new RangeError(
                    'Invalid coordinates. x and y must be non-negative numbers. ([0, 0] is the bottom left corner.)'
                );
            }

            for (const existingObj of Object.values(this.objects.objects)) {
                if (
                    existingObj.x === obj.x &&
                    existingObj.y === obj.y &&
                    existingObj.id !== obj.id
                ) {
                    // Collision detected
                    if (!obj.detectCollision) {
                        throw new Error(
                            'Collision detected. Cannot add object at the same coordinates as an existing object.'
                        );
                    } else {
                        // Non-collision case
                        this.emit('collide');
                    }
                }
            }

            if (this.objects.ids.includes(obj.id) == true) {
                this.#remove(obj.x, obj.y);
            }

            this.#add(obj.x, obj.y, obj);
            this.objects.objects[obj.id] = obj;
            this.objects.ids.push(obj.id);
        }
    }

    /**
     *
     * @param {string} row Split rows, default is null (assumes you use emojis for planes.)
     * @param {string} column Split columns, default is a line break.
     * @returns String with output plane.
     */
    return(row = '', column = '\n') {
        return this.plane.map((subArray) => subArray.join(row)).join(column);
    }
}

/**
 * An object to be represented on a plane
 * @class
 */
class PlaneObject {
    /**
     *
     * @param {number} x X coordinate, origin is (0) (top left hand corner) [Not zero idnexed]
     * @param {number} y Y coordinate, origin is (0) (top left hand corner) [Not zero indexed]
     * @param {string} id A unique object ID
     * @param {string} value An emoji for said object to display on the plane. Defaults to objectID
     * @param {boolean} detectCollision Detect collision on other Objects.
     */
    constructor(x, y, id, value = `${id}`, detectCollision = true) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.detectCollision = detectCollision;
        this.value = value;
    }
    // make a sperate function to update all plane positions and draw them.like updatePlane()
}

module.exports = { Plane, PlaneObject };
