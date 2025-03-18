import { calculateScore, evaluateApplication } from '../evaluation-engine';
import { LoanApplication } from '../../types';
import '@testing-library/jest-dom';

// Mock loan applications for testing
const goodApplication: LoanApplication = {
  id: 'test-good-1',
  applicantName: 'John Good',
  applicantAge: 35,
  income: 80000,
  creditScore: 750,
  loanAmount: 150000,
  loanTerm: 60, // 5 years
  purpose: 'home',
  status: 'pending',
  createdAt: new Date().toISOString()
};

const averageApplication: LoanApplication = {
  id: 'test-avg-1',
  applicantName: 'Mary Average',
  applicantAge: 27,
  income: 50000,
  creditScore: 680,
  loanAmount: 120000,
  loanTerm: 120, // 10 years
  purpose: 'auto',
  status: 'pending',
  createdAt: new Date().toISOString()
};

const poorApplication: LoanApplication = {
  id: 'test-poor-1',
  applicantName: 'Bob Poor',
  applicantAge: 22,
  income: 35000,
  creditScore: 580,
  loanAmount: 150000,
  loanTerm: 240, // 20 years
  purpose: 'personal',
  status: 'pending',
  createdAt: new Date().toISOString()
};

describe('Evaluation Engine - calculateScore', () => {
  test('should return a numeric score', () => {
    const score = calculateScore(goodApplication);
    expect(typeof score).toBe('number');
    expect(score).not.toBeNaN();
  });

  test('should return a score between 0 and 100', () => {
    const score1 = calculateScore(goodApplication);
    const score2 = calculateScore(averageApplication);
    const score3 = calculateScore(poorApplication);
    
    expect(score1).toBeGreaterThanOrEqual(0);
    expect(score1).toBeLessThanOrEqual(100);
    expect(score2).toBeGreaterThanOrEqual(0);
    expect(score2).toBeLessThanOrEqual(100);
    expect(score3).toBeGreaterThanOrEqual(0);
    expect(score3).toBeLessThanOrEqual(100);
  });

  test('good applications should score higher than average applications', () => {
    const goodScore = calculateScore(goodApplication);
    const avgScore = calculateScore(averageApplication);
    
    expect(goodScore).toBeGreaterThan(avgScore);
  });

  test('average applications should score higher than poor applications', () => {
    const avgScore = calculateScore(averageApplication);
    const poorScore = calculateScore(poorApplication);
    
    expect(avgScore).toBeGreaterThan(poorScore);
  });

  test('credit score should affect the overall score', () => {
    const baseApp = {...goodApplication};
    const goodCreditApp = {...baseApp, creditScore: 800};
    const poorCreditApp = {...baseApp, creditScore: 550};
    
    const goodCreditScore = calculateScore(goodCreditApp);
    const poorCreditScore = calculateScore(poorCreditApp);
    
    expect(goodCreditScore).toBeGreaterThan(poorCreditScore);
  });

  test('income to loan ratio should affect the overall score', () => {
    const baseApp = {...goodApplication};
    const highIncomeApp = {...baseApp, income: 200000, loanAmount: 100000};
    const lowIncomeApp = {...baseApp, income: 40000, loanAmount: 200000};
    
    const highIncomeScore = calculateScore(highIncomeApp);
    const lowIncomeScore = calculateScore(lowIncomeApp);
    
    expect(highIncomeScore).toBeGreaterThan(lowIncomeScore);
  });

  test('loan term should affect the overall score', () => {
    const baseApp = {...goodApplication};
    const shortTermApp = {...baseApp, loanTerm: 36}; // 3 years
    const longTermApp = {...baseApp, loanTerm: 300}; // 25 years
    
    const shortTermScore = calculateScore(shortTermApp);
    const longTermScore = calculateScore(longTermApp);
    
    expect(shortTermScore).toBeGreaterThan(longTermScore);
  });
});

describe('Evaluation Engine - evaluateApplication', () => {
  test('should return an evaluation result with expected properties', () => {
    const result = evaluateApplication(goodApplication);
    
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('maxScore');
    expect(result).toHaveProperty('approved');
    expect(result).toHaveProperty('factors');
    expect(result).toHaveProperty('summary');
    expect(Array.isArray(result.factors)).toBe(true);
    expect(typeof result.summary).toBe('string');
  });

  test('should approve good applications', () => {
    const result = evaluateApplication(goodApplication);
    expect(result.approved).toBe(true);
  });

  test('should reject poor applications', () => {
    const result = evaluateApplication(poorApplication);
    expect(result.approved).toBe(false);
  });

  test('factors should include credit score assessment', () => {
    const result = evaluateApplication(goodApplication);
    const creditScoreFactor = result.factors.find(f => f.name === 'Credit Score');
    
    expect(creditScoreFactor).toBeDefined();
    expect(creditScoreFactor?.impact).toBe('positive');
  });

  test('factors should include income to loan ratio assessment', () => {
    const result = evaluateApplication(goodApplication);
    const incomeFactor = result.factors.find(f => f.name === 'Income to Loan Ratio');
    
    expect(incomeFactor).toBeDefined();
  });

  test('factors should include loan term assessment', () => {
    const result = evaluateApplication(goodApplication);
    const loanTermFactor = result.factors.find(f => f.name === 'Loan Term');
    
    expect(loanTermFactor).toBeDefined();
  });

  test('rejected applications should include recommendations', () => {
    const result = evaluateApplication(poorApplication);
    
    expect(result.approved).toBe(false);
    expect(result.summary).toContain('Recommendations');
  });

  test('summary should mention positive factors for good applications', () => {
    const result = evaluateApplication(goodApplication);
    
    expect(result.summary).toContain('Positive factors');
  });

  test('summary should mention areas of concern for poor applications', () => {
    const result = evaluateApplication(poorApplication);
    
    expect(result.summary).toContain('Areas of concern');
  });
}); 