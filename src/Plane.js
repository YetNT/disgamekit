const EventEmitter = require("events");

/**
 * A 2d plane
 * @class
 */
class Plane extends EventEmitter {
    /**
     *
     * @param {number} rows Amount of rows
     * @param {number} columns Amount of columns
     * @param {string} blank Replace blank space with something else.
     */
    constructor(rows, columns, blank = null) {
        super();
        this.rows = rows;
        this.columns = columns;
        this.plane = this.createGrid(blank);
        this.blank = blank;
    }

    createGrid(blank) {
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

    /**
     *
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @returns
     */
    elementAt(x, y) {
        return this.plane[this.#reverseYAxis(y)][x];
    }

    #reverseYAxis(y) {
        return this.plane.length - y - 1;
    }

    #add(x, y, object) {
        this.plane[this.#reverseYAxis(y)][x] = object.emoji;
    }

    #remove(x, y) {
        this.plane[this.#reverseYAxis(y)][x] = this.blank;
    }

    searchByEmoji(emoji) {}

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
        for (const obj of arr) {
            if (obj.x < 0 || obj.y < 0) {
                throw new RangeError(
                    "Invalid coordinates. x and y must be non-negative numbers. ([0, 0] is the bottom left corner.)"
                );
            }
            if (this.objects.ids.includes(obj.objectId) == true) {
                this.clear();
            }
            this.#add(obj.x, obj.y, obj);
            this.objects.objects[obj.objectId] = obj;
            this.objects.ids.push(obj.objectId);
        }
    }

    /**
     *
     * @param {string} row Split rows, default is null (assumes you use emojis for planes.)
     * @param {string} column Split columns, default is a line break.
     * @returns String with output plane.
     */
    return(row = "", column = "\n") {
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
     * @param {string} objectId A unique object ID
     * @param {string} emoji An emoji for said object. Defaults to objectID
     */
    constructor(x, y, objectId, emoji = `${objectId}`) {
        this.x = x;
        this.y = y;
        this.objectId = objectId;
        this.emoji = emoji;
    }
    // make a sperate function to update all plane positions and draw them.like updatePlane()
}

module.exports = { Plane, PlaneObject };
