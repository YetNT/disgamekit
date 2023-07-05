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

describe('Game', () => {
    it('should have a started game', () => {
        expect(game.isGameOn()).to.be.true;
    });
});
describe('Plane', () => {
    describe('the actual plane', () => {
        it('should have a blank value of "empty"', () => {
            expect(plane.blank).to.be.eql('empty');
        });
        it('should have an array length of 10', () => {
            expect(plane.plane).to.have.length(10);
        });
        it('should contain empty', () => {
            expect(plane.plane[1][2]).to.contain('empty');
        });
    });
    describe('plane objects', () => {
        it('should be at x 2 and y 6', () => {
            expect(bag.x).to.be.eql(2);
            expect(bag.y).to.be.eql(6);
        });
        it('should contain an ID of "bag"', () => {
            expect(bag.id).to.be.eql('bag');
        });
    });
    describe('plane and plane object interactions', () => {
        it('should update the plane to have "bag" at x:2, y:6', () => {
            plane.update(bag);
            expect(plane.lookupCoords(2, 6)).to.be.eql(bag.value);
        });
        it('should have "bag" at coordinates 2, 6', () => {
            expect(plane.lookupObj('bag')).to.be.eql({ x: 2, y: 6 });
        });
    });
});
