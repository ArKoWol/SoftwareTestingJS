import { expect } from 'chai';
import {
	filterUsersByAge,
	sortUsersByName,
	findUserById,
	isEmailTaken
} from '../usersListUtils.js';

describe('usersListUtils', () => {
	// Test data
	const users = [
		{ id: 1, name: 'John', age: 25, email: 'john@example.com' },
		{ id: 2, name: 'Alice', age: 30, email: 'alice@example.com' },
		{ id: 3, name: 'Bob', age: 20, email: 'bob@example.com' },
		{ id: 4, name: 'Charlie', age: 35, email: 'charlie@example.com' }
	];

	describe('filterUsersByAge', () => {
		it('should filter users by age range', () => {
			const result = filterUsersByAge(users, 25, 32);
			expect(result).to.have.lengthOf(2);
			expect(result[0].name).to.equal('John');
			expect(result[1].name).to.equal('Alice');
		});

		it('should return empty array if no users match the age range', () => {
			const result = filterUsersByAge(users, 40, 50);
			expect(result).to.be.an('array').that.is.empty;
		});

		it('should handle edge cases where users are exactly at the age limits', () => {
			const result = filterUsersByAge(users, 20, 25);
			expect(result).to.have.lengthOf(2);
			expect(result[0].name).to.equal('John');
			expect(result[1].name).to.equal('Bob');
		});

		it('should throw an error if users is not an array', () => {
			expect(() => filterUsersByAge(null, 20, 30)).to.throw('Users must be an array');
			expect(() => filterUsersByAge({}, 20, 30)).to.throw('Users must be an array');
			expect(() => filterUsersByAge('users', 20, 30)).to.throw('Users must be an array');
		});

		it('should handle an empty array', () => {
			expect(filterUsersByAge([], 20, 30)).to.be.an('array').that.is.empty;
		});
	});

	describe('sortUsersByName', () => {
		it('should sort users by name alphabetically', () => {
			const result = sortUsersByName(users);
			expect(result).to.have.lengthOf(4);
			expect(result[0].name).to.equal('Alice');
			expect(result[1].name).to.equal('Bob');
			expect(result[2].name).to.equal('Charlie');
			expect(result[3].name).to.equal('John');
		});

		it('should not modify the original array', () => {
			const originalUsers = [...users];
			sortUsersByName(users);
			expect(users).to.deep.equal(originalUsers);
		});

		it('should throw an error if users is not an array', () => {
			expect(() => sortUsersByName(null)).to.throw('Users must be an array');
			expect(() => sortUsersByName({})).to.throw('Users must be an array');
			expect(() => sortUsersByName('users')).to.throw('Users must be an array');
		});

		it('should handle an empty array', () => {
			expect(sortUsersByName([])).to.be.an('array').that.is.empty;
		});
	});

	describe('findUserById', () => {
		it('should find a user by ID', () => {
			const result = findUserById(users, 2);
			expect(result).to.not.be.null;
			expect(result.name).to.equal('Alice');
		});

		it('should return null if user not found', () => {
			const result = findUserById(users, 999);
			expect(result).to.be.null;
		});

		it('should throw an error if users is not an array', () => {
			expect(() => findUserById(null, 1)).to.throw('Users must be an array');
			expect(() => findUserById({}, 1)).to.throw('Users must be an array');
			expect(() => findUserById('users', 1)).to.throw('Users must be an array');
		});

		it('should handle an empty array', () => {
			expect(findUserById([], 1)).to.be.null;
		});
	});

	describe('isEmailTaken', () => {
		it('should return true if email is taken', () => {
			expect(isEmailTaken(users, 'john@example.com')).to.be.true;
		});

		it('should return false if email is not taken', () => {
			expect(isEmailTaken(users, 'unknown@example.com')).to.be.false;
		});

		it('should be case sensitive when checking emails', () => {
			expect(isEmailTaken(users, 'JOHN@example.com')).to.be.false;
		});

		it('should throw an error if users is not an array', () => {
			expect(() => isEmailTaken(null, 'test@example.com')).to.throw('Users must be an array');
			expect(() => isEmailTaken({}, 'test@example.com')).to.throw('Users must be an array');
			expect(() => isEmailTaken('users', 'test@example.com')).to.throw('Users must be an array');
		});

		it('should handle an empty array', () => {
			expect(isEmailTaken([], 'test@example.com')).to.be.false;
		});
	});
});