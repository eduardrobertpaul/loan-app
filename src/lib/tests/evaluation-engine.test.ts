import { evaluateApplication, calculateScore } from '../utils/evaluation-engine';
import { LoanApplication } from '../types';

describe('Evaluation Engine', () => {
  describe('calculateScore', () => {
    test('should calculate a higher score for higher income', () => {
      // Arrange
      const lowIncomeApplication = createTestApplication({ income: 30000 });
      const highIncomeApplication = createTestApplication({ income: 90000 });

      // Act
      const lowIncomeScore = calculateScore(lowIncomeApplication);
      const highIncomeScore = calculateScore(highIncomeApplication);

      // Assert
      expect(highIncomeScore).toBeGreaterThan(lowIncomeScore);
    });

    test('should calculate a higher score for higher credit score', () => {
      // Arrange
      const lowCreditApplication = createTestApplication({ creditScore: 550 });
      const highCreditApplication = createTestApplication({ creditScore: 750 });

      // Act
      const lowCreditScore = calculateScore(lowCreditApplication);
      const highCreditScore = calculateScore(highCreditApplication);

      // Assert
      expect(highCreditScore).toBeGreaterThan(lowCreditScore);
    });

    test('should calculate a lower score for higher loan amount to income ratio', () => {
      // Arrange
      const lowRatioApplication = createTestApplication({ 
        income: 80000,
        loanAmount: 40000  // 50% of income
      });
      const highRatioApplication = createTestApplication({ 
        income: 80000,
        loanAmount: 200000  // 250% of income
      });

      // Act
      const lowRatioScore = calculateScore(lowRatioApplication);
      const highRatioScore = calculateScore(highRatioApplication);

      // Assert
      expect(lowRatioScore).toBeGreaterThan(highRatioScore);
    });
  });

  describe('evaluateApplication', () => {
    test('should approve applications with high income and credit score', () => {
      // Arrange
      const strongApplication = createTestApplication({
        income: 120000,
        creditScore: 800,
        loanAmount: 50000
      });

      // Act
      const result = evaluateApplication(strongApplication);

      // Assert
      expect(result.approved).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(70);
    });

    test('should reject applications with low income and credit score', () => {
      // Arrange
      const weakApplication = createTestApplication({
        income: 25000,
        creditScore: 520,
        loanAmount: 100000
      });

      // Act
      const result = evaluateApplication(weakApplication);

      // Assert
      expect(result.approved).toBe(false);
      expect(result.score).toBeLessThan(50);
    });

    test('should include detailed factor analysis in evaluation result', () => {
      // Arrange
      const application = createTestApplication();

      // Act
      const result = evaluateApplication(application);

      // Assert
      expect(result.factors).toBeDefined();
      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.factors[0]).toHaveProperty('name');
      expect(result.factors[0]).toHaveProperty('score');
      expect(result.factors[0]).toHaveProperty('impact');
    });

    test('should include a human-readable summary in the evaluation', () => {
      // Arrange
      const application = createTestApplication();

      // Act
      const result = evaluateApplication(application);

      // Assert
      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });
});

// Helper function to create test applications with default values
function createTestApplication(overrides = {}): LoanApplication {
  return {
    id: 'test-id',
    applicantName: 'Test Applicant',
    applicantAge: 35,
    income: 60000,
    creditScore: 700,
    loanAmount: 120000,
    loanTerm: 60, // 5 years in months
    purpose: 'home',
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides
  };
} 