import { expect } from 'chai';
import { findMax, findMin, removeDuplicates } from '../arrayUtils.js';

describe('arrayUtils', () => {
  describe('findMax', () => {
    it('should find the maximum value in an array', () => {
      expect(findMax([1, 2, 3, 4, 5])).to.equal(5);
    });

    it('should find the maximum value in an array with negative numbers', () => {
      expect(findMax([-5, -3, -1, -10])).to.equal(-1);
    });

    it('should return -Infinity for an empty array', () => {
      expect(findMax([])).to.equal(-Infinity);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => findMax(null)).to.throw('Input must be an array');
      expect(() => findMax(123)).to.throw('Input must be an array');
      expect(() => findMax('array')).to.throw('Input must be an array');
      expect(() => findMax({})).to.throw('Input must be an array');
    });
  });

  describe('findMin', () => {
    it('should find the minimum value in an array', () => {
      expect(findMin([1, 2, 3, 4, 5])).to.equal(1);
    });

    it('should find the minimum value in an array with negative numbers', () => {
      expect(findMin([-5, -3, -1, -10])).to.equal(-10);
    });

    it('should return Infinity for an empty array', () => {
      expect(findMin([])).to.equal(Infinity);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => findMin(null)).to.throw('Input must be an array');
      expect(() => findMin(123)).to.throw('Input must be an array');
      expect(() => findMin('array')).to.throw('Input must be an array');
      expect(() => findMin({})).to.throw('Input must be an array');
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate values from an array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 4, 4, 5])).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should handle an array with no duplicates', () => {
      expect(removeDuplicates([1, 2, 3, 4, 5])).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should handle an array with all identical elements', () => {
      expect(removeDuplicates([5, 5, 5, 5])).to.deep.equal([5]);
    });

    it('should handle an empty array', () => {
      expect(removeDuplicates([])).to.deep.equal([]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => removeDuplicates(null)).to.throw('Input must be an array');
      expect(() => removeDuplicates(123)).to.throw('Input must be an array');
      expect(() => removeDuplicates('array')).to.throw('Input must be an array');
      expect(() => removeDuplicates({})).to.throw('Input must be an array');
    });
  });
});
