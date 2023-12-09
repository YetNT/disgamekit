import { EventEmitter } from 'events';
import { PlaneObject } from './PlaneObject';
import { Plane } from './Plane';

function boundConvert(
    XorY: 'x' | 'y',
    plane: { c: number; r: number },
    num: string
): number {
    let number = parseInt(num);
    let limit = XorY === 'x' ? plane.r - 1 : plane.c - 1;

    return Math.min(Math.max(number, 0), limit);
}
/**
 * A PlaneObject which can span multiple spaces.
 */
export class ComplexPlaneObject extends EventEmitter {
    private plane: { c: number; r: number };
    private objects: PlaneObject[] = [];
    private actualPlane: Plane;
    constructor(plane: Plane) {
        super();
        this.plane = { c: plane.columns, r: plane.rows };
        this.actualPlane = plane;
    }

    // Path will be like (9,8->2,6)

    /**
     * Draw a line or lines. (Use syntax `x1, y1 -> x2, y2` where x1 and y1 is the starting coordinates and x2 and y2 are the ending coordinates for said line.)
     * @param input Rest parameter of object represnting a single line
     */
    draw(
        ...input: /** Object represnting a singuar line */ {
            /** Emoji to use to display line */ value: string;
            /** Start and end points for the line. (x1, y1 -> x2, y2). Remove braces and replace with respective values.*/ path: string;
        }[]
    ): void {
        for (const e of input) {
            const value = e.value;
            const stringPath = e.path.replace(/\s/g, '');
            const pathArr = stringPath.split('');

            if (pathArr.includes('-') && pathArr.includes('>')) {
                pathArr.splice(pathArr.indexOf('-'), 2, '|');
            } else {
                throw new SyntaxError('Path must include `->` in string.');
            }
            const splitPath = pathArr
                .join('') // Combine the array elements into a single string
                .split('|') // Split by '|'
                .map((element) => element.split(',')); // Split each sub-element by ','

            let [[a, b], [c, d]] = splitPath;

            // if coords go out of bounds and convert to numbers
            let x1 = boundConvert('x', this.plane, a);
            let y1 = boundConvert('y', this.plane, b);
            let x2 = boundConvert('x', this.plane, c);
            let y2 = boundConvert('y', this.plane, d);

            // get array of paths.
            let currentPos = { x: x1, y: y1 };
            let targetPos = { x: x2, y: y2 };

            const path: number[][] = [];

            // Bresenham's Line Algorithm starts here
            const deltaX = Math.abs(targetPos.x - currentPos.x);
            const deltaY = Math.abs(targetPos.y - currentPos.y);
            const signX = currentPos.x < targetPos.x ? 1 : -1;
            const signY = currentPos.y < targetPos.y ? 1 : -1;
            let error = deltaX - deltaY;

            while (
                currentPos.x !== targetPos.x ||
                currentPos.y !== targetPos.y
            ) {
                let obj = new PlaneObject(
                    this.actualPlane,
                    currentPos.x,
                    currentPos.y,
                    `c${currentPos.x},${currentPos.y}`,
                    value,
                    false,
                    false
                );

                this.objects.push(obj);
                path.push([currentPos.x, currentPos.y]);
                const error2 = error * 2;

                if (error2 > -deltaY) {
                    error -= deltaY;
                    currentPos.x += signX;
                }

                if (error2 < deltaX) {
                    error += deltaX;
                    currentPos.y += signY;
                }
            }
            let obj = new PlaneObject(
                this.actualPlane,
                currentPos.x,
                currentPos.y,
                `c${currentPos.x},${currentPos.y}`,
                value,
                false,
                false
            );
            this.objects.push(obj);
            // Bresenham's Line Algorithm ends here
            path.push([targetPos.x, targetPos.y]);
        }
    }

    /**
     * Return an array of PlaneObjects which represent the line. (To use in Plane#update, use a rest parameter)
     * @returns Array of planeObjects
     */
    return(): PlaneObject[] {
        return this.objects;
    }
}
