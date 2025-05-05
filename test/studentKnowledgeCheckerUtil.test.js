import { expect } from 'chai';
import checkStudentKnowledge from '../studentKnowledgeCheckerUtil.js';

describe('studentKnowledgeCheckerUtil', () => {
  describe('checkStudentKnowledge', () => {
    it('should return true when all answers are correct', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return false when at least one answer is incorrect', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'wrong answer',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when student has fewer answers than expected', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when student has more answers than expected', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
        question4: 'answer4',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when questions have different keys', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        wrongQuestion: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should handle empty objects', () => {
      expect(checkStudentKnowledge({}, {})).to.be.true;
    });
  });
});
