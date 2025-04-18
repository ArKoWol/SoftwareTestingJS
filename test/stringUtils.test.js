import { expect } from 'chai';
import { capitalize, reverseString, isPalindrome } from '../stringUtils.js';

describe('stringUtils', () => {
	describe('capitalize', () => {
		it('should capitalize the first letter of a string', () => {
			expect(capitalize('hello')).to.equal('Hello');
		});

		it('should leave already capitalized strings unchanged', () => {
			expect(capitalize('Hello')).to.equal('Hello');
		});

		it('should handle single character strings', () => {
			expect(capitalize('a')).to.equal('A');
		});

		it('should handle empty strings', () => {
			expect(capitalize('')).to.equal('');
		});

		it('should throw an error if input is not a string', () => {
			expect(() => capitalize(null)).to.throw('Input must be a string');
			expect(() => capitalize(123)).to.throw('Input must be a string');
			expect(() => capitalize([])).to.throw('Input must be a string');
			expect(() => capitalize({})).to.throw('Input must be a string');
		});
	});

	describe('reverseString', () => {
		it('should reverse a string correctly', () => {
			expect(reverseString('hello')).to.equal('olleh');
		});

		it('should handle palindromes', () => {
			expect(reverseString('radar')).to.equal('radar');
		});

		it('should handle empty strings', () => {
			expect(reverseString('')).to.equal('');
		});

		it('should handle single character strings', () => {
			expect(reverseString('a')).to.equal('a');
		});

		it('should throw an error if input is not a string', () => {
			expect(() => reverseString(null)).to.throw('Input must be a string');
			expect(() => reverseString(123)).to.throw('Input must be a string');
			expect(() => reverseString([])).to.throw('Input must be a string');
			expect(() => reverseString({})).to.throw('Input must be a string');
		});
	});

	describe('isPalindrome', () => {
		it('should correctly identify palindromes', () => {
			expect(isPalindrome('radar')).to.be.true;
			expect(isPalindrome('level')).to.be.true;
			expect(isPalindrome('madam')).to.be.true;
		});

		it('should correctly identify non-palindromes', () => {
			expect(isPalindrome('hello')).to.be.false;
			expect(isPalindrome('world')).to.be.false;
		});

		it('should handle empty strings', () => {
			expect(isPalindrome('')).to.be.true;
		});

		it('should handle single character strings', () => {
			expect(isPalindrome('a')).to.be.true;
		});

		it('should throw an error if input is not a string', () => {
			expect(() => isPalindrome(null)).to.throw('Input must be a string');
			expect(() => isPalindrome(123)).to.throw('Input must be a string');
			expect(() => isPalindrome([])).to.throw('Input must be a string');
			expect(() => isPalindrome({})).to.throw('Input must be a string');
		});
	});
});