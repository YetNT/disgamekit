const EventEmitter = require('events');
const Game = require('./Game');

class Plane {
    blank;
    plane;
    #once = false;
    constructor(game, rows, columns, blank = null) {
        this.game = game;
        this.rows = rows;
        this.columns = columns;
        this.plane = this.#createGrid(blank);
        this.blank = blank;
    }

    #doOnce(func) {
        if (this.#once) {
            return;
        } else {
            func();
            this.#once = true;
        }
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

    #searchValue(objects, searchValue) {
        const foundEntry = Object.entries(objects).find(
            ([key, obj]) => obj.value === searchValue
        );
        return foundEntry ? foundEntry[1].id : null;
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
        let array = arr.reverse();
        const planeObjects = Object.values(this.objects.objects);

        this.clear();
        if (this.game.var.gaming == false && planeObjects.length != 0) {
            // If there are objects on the plane and the game has ended, send them to their origins.
            for (const obj of planeObjects) {
                this.#add(obj.origin.x, obj.origin.y, obj);
            }
            return;
        } else if (this.game.var.gaming == false) {
            return;
        }

        for (const obj of array) {
            for (const existingObj of planeObjects) {
                if (
                    existingObj.x === obj.x &&
                    existingObj.y === obj.y &&
                    existingObj.id !== obj.id
                ) {
                    // Collision detected
                    if (obj.detectCollision) {
                        let value =
                            this.plane[this.#reverseYAxis(existingObj.y)][
                                existingObj.x
                            ];
                        let collidedObj =
                            this.objects.objects[
                                this.#searchValue(this.objects.objects, value)
                            ];
                        obj.collide(collidedObj, obj);
                    }
                }
            }

            if (this.objects.ids.includes(obj.id) == true) {
                this.#remove(obj.x, obj.y);
            }

            this.#add(obj.x, obj.y, obj);
            this.objects.objects[obj.id] = obj;
            this.#doOnce(() => {
                this.objects.objects[obj.id].origin = {
                    x: obj.x,
                    y: obj.y,
                };
            });
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
class PlaneObject extends EventEmitter {
    /**
     *
     * @param {Plane} plane plane
     * @param {number} x X coordinate, origin is (0) (top left hand corner) [Not zero idnexed]
     * @param {number} y Y coordinate, origin is (0) (top left hand corner) [Not zero indexed]
     * @param {string} id A unique object ID
     * @param {string} value An emoji for said object to display on the plane. Defaults to objectID
     * @param {boolean} detectCollision Detect collision on other Objects.
     */
    constructor(plane, x, y, id, value = `${id}`, detectCollision = true) {
        super();
        this.plane = { c: plane.columns, r: plane.rows };
        this._x = x;
        this._y = y;
        this.id = id;
        this.detectCollision = detectCollision;
        this.value = value;
    }

    // -1 for 0 based indexing.

    set x(value) {
        let out = 0;
        if (value < 0) {
            out = value - value;
            this.collide('wall');
        } else if (value > this.plane.r - 1) {
            out = this.plane.r - 1;
            this.collide('wall');
        } else {
            out = value;
        }
        this._x = out;
    }

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
            this.collide('wall');
        } else {
            out = value;
        }
        this._y = out;
    }

    get y() {
        return this._y;
    }

    /**
     *
     * @param {object|string} what What collided with this object?
     * @param {PlaneObject} obj kjsadnjkdc lmao djsdoc
     */
    collide(what, obj) {
        if (this.detectCollision) {
            this.emit(
                'collision',
                what == 'wall' ? { id: 'wall', value: 'wall' } : what
            );
        } // If it's false don't emit anything. Although wall on the other hand cannot be passed through
    }
}

module.exports = { Plane, PlaneObject };
