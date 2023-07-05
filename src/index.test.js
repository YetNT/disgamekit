const expect = require('expect.js');
const { describe, it } = require('mocha');
const { Game, Plane, PlaneObject } = require('./index');

const testGameId = 'gameId';

/**
 * @type {Game}
 */
var game = new Game(testGameId);
game.start();
var plane = new Plane(game, 10, 10, 'empty');
var bag = new PlaneObject(plane, 2, 6, 'bag');
var apple = new PlaneObject(plane, 1, 1, 'apple');

var plane2 = new Plane(game, 10, 10, 'empty');
var apple2 = new PlaneObject(plane2, 1, 1, 'apple2');

describe('Game', () => {
    it('should have a started game', () => {
        expect(game.isGameOn()).to.be.true;
    });
});
describe('Plane', () => {
    describe('the actual plane', () => {
        it('should have a blank value of "empty"', () => {
            expect(plane.blank).to.be('empty');
        });
        describe('Plane Arrays', () => {
            it('should have an array length of 10 (Y-Axis) (Therefore there should be 10 X-Axis arrays. The next test might take a bit of time.)', () => {
                expect(plane.plane).to.have.length(10);
            });
            it('should have an inner array(s) with length(s) of 10 (X-Axis)', () => {
                plane.plane.forEach((X) => {
                    expect(X).to.have.length(10);
                });
            });
        });
        it('should contain empty', () => {
            expect(plane.plane[1][2]).to.contain('empty');
        });
    });
    describe('plane objects', () => {
        it('should be at x 2 and y 6', () => {
            expect(bag.x).to.be(2);
            expect(bag.y).to.be(6);
        });
        it('should make x equal the number of rows - 1, when a number bigger than the amount of columns is given', () => {
            bag.x = 23; // Invalid number as there are only 10 columns.
            expect(bag.x).to.be(plane.columns - 1);
        });
        it('should make y = 0, when the number of columns is a negative number.', () => {
            bag.y = -1;
            expect(bag.y).to.be(0);
        });
        it('should contain an ID of "bag"', () => {
            expect(bag.id).to.be('bag');
        });
    });
    describe('plane and plane object interactions', () => {
        it('should update the plane to have "bag" at x:2, y:6', () => {
            bag.x = 2;
            bag.y = 6;
            plane.update(bag);
            expect(plane.lookupCoords(2, 6)).to.be(bag.value);
        });
        it('should have "bag" at coordinates 2, 6', () => {
            expect(plane.lookupObj('bag')).to.be.eql({ x: 2, y: 6 });
        });
    });
    describe('events', () => {
        it('should emit a collision event as bag collides with apple.', () => {
            const expectedValue = apple;

            bag.on('collision', (i) => {
                expect(i).to.be(expectedValue);
            });

            bag.x = apple.x;
            bag.y = apple.y;
            plane.update(bag, apple);
        });
    });
    describe('final tests', () => {
        it('should end the game', () => {
            plane.clear();
            game.end();
            expect(game.isGameOn()).to.be(false); // game state function
            expect(game.var.gaming).to.be(false); // game state variable
        });
        it('should NOT update the plane, as the game has ended', () => {
            apple2.y = 2;
            apple2.x = 4;
            plane2.update(apple2);
            expect(plane2.lookupCoords(4, 2)).to.not.be(apple2.value);
            expect(plane2.lookupObj(apple2.id)).to.not.be.eql({ x: 4, y: 2 });
        });
    });
});
