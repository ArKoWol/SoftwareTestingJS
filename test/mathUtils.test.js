import { expect } from 'chai';
import { add, subtract, multiply, divide } from '../mathUtils.js';

describe('mathUtils', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).to.equal(5);
    });

    it('should add a positive and a negative number correctly', () => {
      expect(add(5, -3)).to.equal(2);
    });

    it('should add two negative numbers correctly', () => {
      expect(add(-2, -3)).to.equal(-5);
    });

    it('should handle zero correctly', () => {
      expect(add(5, 0)).to.equal(5);
      expect(add(0, 5)).to.equal(5);
      expect(add(0, 0)).to.equal(0);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers correctly', () => {
      expect(subtract(5, 3)).to.equal(2);
    });

    it('should subtract a negative from a positive number correctly', () => {
      expect(subtract(5, -3)).to.equal(8);
    });

    it('should subtract a positive from a negative number correctly', () => {
      expect(subtract(-5, 3)).to.equal(-8);
    });

    it('should subtract two negative numbers correctly', () => {
      expect(subtract(-5, -3)).to.equal(-2);
    });

    it('should handle zero correctly', () => {
      expect(subtract(5, 0)).to.equal(5);
      expect(subtract(0, 5)).to.equal(-5);
      expect(subtract(0, 0)).to.equal(0);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(multiply(2, 3)).to.equal(6);
    });

    it('should multiply a positive and a negative number correctly', () => {
      expect(multiply(5, -3)).to.equal(-15);
    });

    it('should multiply two negative numbers correctly', () => {
      expect(multiply(-2, -3)).to.equal(6);
    });

    it('should handle zero correctly', () => {
      expect(multiply(5, 0)).to.equal(0);
      expect(multiply(0, 5)).to.equal(0);
      expect(multiply(0, 0)).to.equal(0);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers correctly', () => {
      expect(divide(6, 3)).to.equal(2);
    });

    it('should divide a positive by a negative number correctly', () => {
      expect(divide(6, -3)).to.equal(-2);
    });

    it('should divide a negative by a positive number correctly', () => {
      expect(divide(-6, 3)).to.equal(-2);
    });

    it('should divide two negative numbers correctly', () => {
      expect(divide(-6, -3)).to.equal(2);
    });

    it('should handle division by fractional numbers', () => {
      expect(divide(5, 2)).to.equal(2.5);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => divide(5, 0)).to.throw('Cannot divide by zero');
    });
  });
});
