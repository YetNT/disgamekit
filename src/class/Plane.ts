import { Game } from './Game';
import { PlaneObject } from './PlaneObject';

export class Plane {
    blank: string;
    plane: string[][];
    #once = false;
    game: Game;
    rows: number;
    columns: number;

    /**
     *
     * @param {Game} game Pass the game object
     * @param {number} rows Amount of rows
     * @param {number} columns Amount of columns
     * @param {string|null} blank The string that represents a default character in the plane.
     */
    constructor(game: Game, rows: number, columns: number, blank?: string) {
        this.game = game;
        this.rows = rows;
        this.columns = columns;
        this.plane = this.#createGrid(blank);
        this.blank = blank === undefined ? null : blank;
    }

    #createGrid(blank: string) {
        /*
        Creates placeholder grid, 
        This grid alone without any of the other functions 
        would have it's origin at the top left.
        This is obviously because the y axis is just the plane array
        and the x axis is a nested array.
        */
        const grid: string[][] = [];
        for (let i = 0; i < this.rows; i++) {
            const row: string[] = [];
            for (let j = 0; j < this.columns; j++) {
                row.push(blank);
            }
            grid.push(row);
        }
        return grid;
    }

    objects: {
        ids: string[];
        objects: { [id: string]: PlaneObject };
    } = {
        /**
         * ID's of objects cached on the plane.
         */
        ids: [],
        /**
         * some planeobjects defined by the ids
         */
        objects: {},
    };

    #reverseYAxis(y: number) {
        /*
        Function that reverses the y input so that the grid's origin is at the bottom left.
        Yes it is zero indexed, because Javascript is the bomb and it makes sense with actual
        graphs.
        */
        return this.plane.length - y - 1;
    }

    #add(x: number, y: number, object: PlaneObject) {
        this.plane[this.#reverseYAxis(y)][x] = object.value;
    }

    #remove(x: number, y: number) {
        this.plane[this.#reverseYAxis(y)][x] = this.blank;
    }

    #searchValue(objects: { [id: string]: PlaneObject }, searchValue: string) {
        const foundEntry = Object.entries(objects).find(
            ([key, obj]) => obj.value === searchValue
        );
        return foundEntry ? foundEntry[1].id : null;
    }

    /**
     *
     * @param {string} inputValue Lookup an objects id
     * @returns {object|null} {x:?, y:?}
     */
    lookupObj(inputValue: string): { x: number; y: number } | null {
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
    lookupCoords(x: number, y: number): string | undefined {
        let out: string = this.plane[this.#reverseYAxis(y)][x];
        return out === this.blank ? undefined : out;
    }

    /**
     * Clears the entire grid, removing every object. (Preserves object coordinates)
     */
    clear(): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.plane[i][j] = this.blank;
            }
        }
    }

    /**
     * Updates object positions on the plane. If provided : It will update/add to the plane If not provided : It will clear the plane of any objects.
     * @param  {...PlaneObject} arr Objects to be updated on plane
     */
    update(...arr: PlaneObject[]) {
        let array: PlaneObject[] = arr.reverse();
        const planeObjects: PlaneObject[] = Object.values(this.objects.objects);

        this.clear();
        if (this.game.var.gaming == false) {
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
                        obj.collide(collidedObj);
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
     * Returns the array.
     * @param {string} row Split rows, default is null (assumes you use emojis for planes.)
     * @param {string} column Split columns, default is a line break.
     * @returns String with output plane.
     */
    return(row?: string, column?: string): string {
        row = row === undefined ? '' : row;
        column = column === undefined ? '\n' : column;
        return this.plane.map((subArray) => subArray.join(row)).join(column);
    }
}
