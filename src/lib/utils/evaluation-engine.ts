import { LoanApplication } from '../types';
import { Recommendation, EvaluationCriteria, defaultEvaluationCriteria } from '../types/evaluation';

/**
 * Loan Application Evaluation Engine
 * 
 * This module provides functions for evaluating loan applications based on
 * various financial and risk factors.
 */

/**
 * Evaluation factor with score and explanation
 */
export interface EvaluationFactor {
  name: string;
  score: number;
  maxScore: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

/**
 * Complete evaluation result
 */
export interface EvaluationResult {
  score: number;
  maxScore: number;
  approved: boolean;
  factors: EvaluationFactor[];
  summary: string;
}

/**
 * Calculate a raw score for a loan application
 * @param application The loan application to evaluate
 * @returns A score from 0-100
 */
export function calculateScore(application: LoanApplication): number {
  // Weight factors
  const weights = {
    creditScore: 0.35,
    incomeToLoanRatio: 0.25,
    age: 0.10,
    loanTerm: 0.15,
    loanPurpose: 0.15
  };
  
  // Credit score factor (0-100)
  const creditScoreFactor = Math.min(100, Math.max(0, (application.creditScore - 300) / 5));
  
  // Income to loan ratio (higher ratio is better)
  const annualIncome = application.income;
  const incomeToLoanRatio = (annualIncome / application.loanAmount) * 10;
  const incomeToLoanFactor = Math.min(100, Math.max(0, incomeToLoanRatio * 20));
  
  // Age factor (prefer 25-65 range)
  const ageValue = application.applicantAge;
  let ageFactor = 0;
  if (ageValue < 18) {
    ageFactor = 0; // Too young
  } else if (ageValue < 25) {
    ageFactor = 60 + ((ageValue - 18) / 7) * 20; // 18-25: 60-80
  } else if (ageValue <= 60) {
    ageFactor = 80 + ((ageValue - 25) / 35) * 20; // 25-60: 80-100
  } else if (ageValue <= 75) {
    ageFactor = 100 - ((ageValue - 60) / 15) * 50; // 60-75: 100-50
  } else {
    ageFactor = 50 - ((ageValue - 75) / 25) * 50; // 75-100: 50-0
  }
  
  // Loan term factor (prefer 1-10 years)
  const loanTermYears = application.loanTerm / 12;
  let loanTermFactor = 0;
  if (loanTermYears <= 1) {
    loanTermFactor = 50 + (loanTermYears * 50); // 0-1 year: 50-100
  } else if (loanTermYears <= 5) {
    loanTermFactor = 100; // 1-5 years: 100
  } else if (loanTermYears <= 10) {
    loanTermFactor = 100 - ((loanTermYears - 5) / 5) * 20; // 5-10 years: 100-80
  } else if (loanTermYears <= 30) {
    loanTermFactor = 80 - ((loanTermYears - 10) / 20) * 30; // 10-30 years: 80-50
  } else {
    loanTermFactor = 50 - ((loanTermYears - 30) / 20) * 50; // >30 years: <50
  }
  
  // Loan purpose factor
  let loanPurposeFactor = 0;
  switch (application.purpose) {
    case 'home':
      loanPurposeFactor = 90; // Secured asset with value
      break;
    case 'business':
      loanPurposeFactor = 85; // Potential return on investment
      break;
    case 'auto':
      loanPurposeFactor = 80; // Secured but depreciating
      break;
    case 'education':
      loanPurposeFactor = 85; // Long-term income potential
      break;
    case 'debt_consolidation':
      loanPurposeFactor = 70; // Replacing existing debt
      break;
    default:
      loanPurposeFactor = 65; // Other/personal
  }
  
  // Calculate weighted score
  const score = (
    creditScoreFactor * weights.creditScore +
    incomeToLoanFactor * weights.incomeToLoanRatio +
    ageFactor * weights.age +
    loanTermFactor * weights.loanTerm +
    loanPurposeFactor * weights.loanPurpose
  );
  
  return score;
}

/**
 * Perform full evaluation of a loan application
 * @param application The loan application to evaluate
 * @returns Complete evaluation result with factors and recommendation
 */
export function evaluateApplication(application: LoanApplication): EvaluationResult {
  // Calculate the base score
  const score = calculateScore(application);
  const maxScore = 100;
  
  // Decision threshold
  const approvalThreshold = 65;
  const approved = score >= approvalThreshold;
  
  // Prepare detailed factors
  const factors: EvaluationFactor[] = [
    {
      name: "Credit Score",
      score: Math.min(100, Math.max(0, (application.creditScore - 300) / 5)),
      maxScore: 100,
      impact: application.creditScore >= 700 ? 'positive' : 
              application.creditScore >= 640 ? 'neutral' : 'negative',
      description: `Credit score of ${application.creditScore}`
    },
    {
      name: "Income to Loan Ratio",
      score: Math.min(100, Math.max(0, (application.income / application.loanAmount) * 10 * 20)),
      maxScore: 100,
      impact: (application.income / application.loanAmount) >= 0.5 ? 'positive' : 
              (application.income / application.loanAmount) >= 0.3 ? 'neutral' : 'negative',
      description: `Annual income is ${(application.income / application.loanAmount * 100).toFixed(1)}% of loan amount`
    },
    {
      name: "Loan Term",
      score: calculateLoanTermScore(application.loanTerm),
      maxScore: 100,
      impact: application.loanTerm <= 60 ? 'positive' : 
              application.loanTerm <= 120 ? 'neutral' : 'negative',
      description: `Loan term of ${(application.loanTerm / 12).toFixed(1)} years`
    },
    {
      name: "Loan Purpose",
      score: calculateLoanPurposeScore(application.purpose),
      maxScore: 100,
      impact: ['home', 'business', 'education'].includes(application.purpose) ? 'positive' : 'neutral',
      description: `Loan purpose: ${application.purpose.replace('_', ' ')}`
    }
  ];
  
  // Generate summary
  let summary = approved
    ? `Application APPROVED with a score of ${score.toFixed(1)}/${maxScore}. `
    : `Application REJECTED with a score of ${score.toFixed(1)}/${maxScore}. `;
    
  // Add factor insights
  const positiveFactors = factors.filter(f => f.impact === 'positive');
  const negativeFactors = factors.filter(f => f.impact === 'negative');
  
  if (positiveFactors.length > 0) {
    summary += `Positive factors include ${positiveFactors.map(f => f.name.toLowerCase()).join(', ')}. `;
  }
  
  if (negativeFactors.length > 0) {
    summary += `Areas of concern include ${negativeFactors.map(f => f.name.toLowerCase()).join(', ')}. `;
  }
  
  // Recommendations
  if (!approved) {
    summary += 'Recommendations: ';
    if (application.creditScore < 700) {
      summary += 'improve credit score, ';
    }
    if ((application.income / application.loanAmount) < 0.5) {
      summary += 'consider requesting a lower loan amount, ';
    }
    if (application.loanTerm > 120) {
      summary += 'consider a shorter loan term, ';
    }
    // Remove trailing comma and space
    summary = summary.replace(/,\s*$/, '.');
  }
  
  return {
    score,
    maxScore,
    approved,
    factors,
    summary
  };
}

/**
 * Calculate a score for the loan term
 */
function calculateLoanTermScore(loanTermMonths: number): number {
  const loanTermYears = loanTermMonths / 12;
  
  if (loanTermYears <= 1) {
    return 50 + (loanTermYears * 50); // 0-1 year: 50-100
  } else if (loanTermYears <= 5) {
    return 100; // 1-5 years: 100
  } else if (loanTermYears <= 10) {
    return 100 - ((loanTermYears - 5) / 5) * 20; // 5-10 years: 100-80
  } else if (loanTermYears <= 30) {
    return 80 - ((loanTermYears - 10) / 20) * 30; // 10-30 years: 80-50
  } else {
    return 50 - ((loanTermYears - 30) / 20) * 50; // >30 years: <50
  }
}

/**
 * Calculate a score for the loan purpose
 */
function calculateLoanPurposeScore(purpose: string): number {
  switch (purpose) {
    case 'home':
      return 90; // Secured asset with value
    case 'business':
      return 85; // Potential return on investment
    case 'auto':
      return 80; // Secured but depreciating
    case 'education':
      return 85; // Long-term income potential
    case 'debt_consolidation':
      return 70; // Replacing existing debt
    default:
      return 65; // Other/personal
  }
}

/**
 * Rule-based evaluation engine for loan applications
 */
export class EvaluationEngine {
  private criteria: EvaluationCriteria;

  constructor(criteria: Partial<EvaluationCriteria> = {}) {
    // Merge default criteria with any custom criteria provided
    this.criteria = { ...defaultEvaluationCriteria, ...criteria };
  }

  /**
   * Main function to evaluate a loan application
   */
  public evaluateApplication(application: LoanApplication): Recommendation {
    // Start with a base score of 500 (on a scale of 0-1000)
    let score = 500;
    const factors: Recommendation['factors'] = [];

    // Calculate various metrics needed for evaluation
    const dti = this.calculateDTI(application);
    const loanToIncomeRatio = application.loanAmount / application.income;
    const loanToValueRatio = application.collateral === 'yes' && application.collateralValue 
      ? (application.loanAmount / application.collateralValue) * 100 
      : undefined;
    
    // Credit Score Assessment
    const creditScoreImpact = this.evaluateCreditScore(application.creditScore);
    score += creditScoreImpact.points;
    factors.push({
      name: 'Credit Score',
      impact: creditScoreImpact.impact,
      description: creditScoreImpact.description
    });
    
    // Income Assessment
    const incomeImpact = this.evaluateIncome(application.income);
    score += incomeImpact.points;
    factors.push({
      name: 'Income',
      impact: incomeImpact.impact,
      description: incomeImpact.description
    });

    // Debt-to-Income Ratio Assessment
    const dtiImpact = this.evaluateDTI(dti);
    score += dtiImpact.points;
    factors.push({
      name: 'Debt-to-Income Ratio',
      impact: dtiImpact.impact,
      description: dtiImpact.description
    });

    // Loan-to-Income Ratio Assessment
    const ltiImpact = this.evaluateLoanToIncomeRatio(loanToIncomeRatio);
    score += ltiImpact.points;
    factors.push({
      name: 'Loan-to-Income Ratio',
      impact: ltiImpact.impact,
      description: ltiImpact.description
    });

    // Loan-to-Value Ratio Assessment (if collateral is provided)
    if (loanToValueRatio !== undefined) {
      const ltvImpact = this.evaluateLoanToValueRatio(loanToValueRatio);
      score += ltvImpact.points;
      factors.push({
        name: 'Loan-to-Value Ratio',
        impact: ltvImpact.impact,
        description: ltvImpact.description
      });
    } else {
      // No collateral penalty
      score -= 50;
      factors.push({
        name: 'Collateral',
        impact: 'negative',
        description: 'No collateral provided for the loan'
      });
    }

    // Employment Stability Assessment
    if (application.employmentStatus === 'employed' || application.employmentStatus === 'self-employed') {
      const employmentImpact = this.evaluateEmploymentStability(application.yearsEmployed || 0);
      score += employmentImpact.points;
      factors.push({
        name: 'Employment Stability',
        impact: employmentImpact.impact,
        description: employmentImpact.description
      });
    } else {
      // Unemployment/retirement impact
      score -= 100;
      factors.push({
        name: 'Employment Status',
        impact: 'negative',
        description: `Applicant is ${application.employmentStatus}, which presents higher risk`
      });
    }

    // Bankruptcy history assessment
    if (application.bankruptcies && application.bankruptcies > 0) {
      score += this.criteria.bankruptcyImpact * application.bankruptcies;
      factors.push({
        name: 'Bankruptcy History',
        impact: 'negative',
        description: `Applicant has ${application.bankruptcies} previous bankruptcies`
      });
    }

    // Ensure score is within bounds (0-1000)
    score = Math.max(0, Math.min(1000, score));

    // Determine recommendation based on final score
    let status: Recommendation['status'];
    let message: string;

    if (score >= 700) {
      status = 'Approve';
      message = 'This application meets our criteria for approval.';
    } else if (score >= 500) {
      status = 'Review';
      message = 'This application requires manual review by a loan officer.';
    } else {
      status = 'Decline';
      message = 'This application does not meet our minimum criteria.';
    }

    return {
      status,
      message,
      score,
      factors
    };
  }

  /**
   * Calculate Debt-to-Income ratio
   */
  private calculateDTI(application: LoanApplication): number {
    const monthlyIncome = application.income / 12;
    const monthlyDebt = application.monthlyExpenses + application.otherLoans;
    
    // For new loan, estimate monthly payment for DTI calculation
    let estimatedMonthlyPayment = 0;
    if (!application.monthlyPayment) {
      // Simple estimation - more sophisticated calculation would use proper amortization
      const monthlyInterestRate = 0.05 / 12; // Assume 5% annual interest rate
      const numberOfPayments = application.loanTerm * 12;
      estimatedMonthlyPayment = (application.loanAmount * monthlyInterestRate) / 
                           (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    } else {
      estimatedMonthlyPayment = application.monthlyPayment;
    }

    // Calculate DTI including the new loan payment
    return ((monthlyDebt + estimatedMonthlyPayment) / monthlyIncome) * 100;
  }

  /**
   * Evaluate credit score
   */
  private evaluateCreditScore(creditScore: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (creditScore >= 750) {
      return { 
        points: 200, 
        impact: 'positive', 
        description: 'Excellent credit score indicates strong financial responsibility'
      };
    } else if (creditScore >= 700) {
      return { 
        points: 150, 
        impact: 'positive', 
        description: 'Good credit score suggests responsible credit management'
      };
    } else if (creditScore >= this.criteria.minimumCreditScore) {
      return { 
        points: 75, 
        impact: 'neutral', 
        description: 'Fair credit score meets minimum requirements'
      };
    } else if (creditScore >= 600) {
      return { 
        points: -50, 
        impact: 'negative', 
        description: 'Below average credit score indicates potential credit issues'
      };
    } else {
      return { 
        points: -150, 
        impact: 'negative', 
        description: 'Poor credit score suggests significant credit problems'
      };
    }
  }

  /**
   * Evaluate income
   */
  private evaluateIncome(income: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (income >= 100000) {
      return { 
        points: 150, 
        impact: 'positive', 
        description: 'High income provides strong financial stability'
      };
    } else if (income >= 75000) {
      return { 
        points: 100, 
        impact: 'positive', 
        description: 'Above average income indicates good financial capability'
      };
    } else if (income >= 50000) {
      return { 
        points: 50, 
        impact: 'positive', 
        description: 'Moderate income meets standard requirements'
      };
    } else if (income >= this.criteria.minimumIncome) {
      return { 
        points: 0, 
        impact: 'neutral', 
        description: 'Income meets minimum requirements'
      };
    } else {
      return { 
        points: -100, 
        impact: 'negative', 
        description: 'Income below our minimum threshold'
      };
    }
  }

  /**
   * Evaluate Debt-to-Income ratio
   */
  private evaluateDTI(dti: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (dti <= 28) {
      return { 
        points: 150, 
        impact: 'positive', 
        description: 'Excellent debt-to-income ratio indicates significant repayment capacity'
      };
    } else if (dti <= 36) {
      return { 
        points: 100, 
        impact: 'positive', 
        description: 'Good debt-to-income ratio shows adequate repayment capacity'
      };
    } else if (dti <= this.criteria.maximumDtiRatio) {
      return { 
        points: 0, 
        impact: 'neutral', 
        description: 'Debt-to-income ratio is within acceptable limits'
      };
    } else {
      return { 
        points: -150, 
        impact: 'negative', 
        description: 'High debt-to-income ratio indicates potential repayment difficulties'
      };
    }
  }

  /**
   * Evaluate Loan-to-Income ratio
   */
  private evaluateLoanToIncomeRatio(ratio: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (ratio <= 1) {
      return { 
        points: 100, 
        impact: 'positive', 
        description: 'Excellent loan-to-income ratio indicates the loan is well within financial capacity'
      };
    } else if (ratio <= 2) {
      return { 
        points: 50, 
        impact: 'positive', 
        description: 'Good loan-to-income ratio shows the loan is reasonably proportional to income'
      };
    } else if (ratio <= this.criteria.maximumLoanToIncomeRatio) {
      return { 
        points: 0, 
        impact: 'neutral', 
        description: 'Loan-to-income ratio is within acceptable limits'
      };
    } else {
      return { 
        points: -100, 
        impact: 'negative', 
        description: 'High loan-to-income ratio suggests the loan may be too large relative to income'
      };
    }
  }

  /**
   * Evaluate Loan-to-Value ratio (for loans with collateral)
   */
  private evaluateLoanToValueRatio(ratio: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (ratio <= 50) {
      return { 
        points: 100, 
        impact: 'positive', 
        description: 'Low loan-to-value ratio indicates strong collateral coverage'
      };
    } else if (ratio <= 70) {
      return { 
        points: 50, 
        impact: 'positive', 
        description: 'Good loan-to-value ratio shows adequate collateral coverage'
      };
    } else if (ratio <= this.criteria.maximumLoanToValueRatio!) {
      return { 
        points: 0, 
        impact: 'neutral', 
        description: 'Loan-to-value ratio is within acceptable limits'
      };
    } else {
      return { 
        points: -100, 
        impact: 'negative', 
        description: 'High loan-to-value ratio indicates potential collateral insufficiency'
      };
    }
  }

  /**
   * Evaluate employment stability
   */
  private evaluateEmploymentStability(yearsEmployed: number): { points: number; impact: 'positive' | 'negative' | 'neutral'; description: string } {
    if (yearsEmployed >= 5) {
      return { 
        points: 100, 
        impact: 'positive', 
        description: 'Long-term employment indicates strong job stability'
      };
    } else if (yearsEmployed >= 3) {
      return { 
        points: 50, 
        impact: 'positive', 
        description: 'Good employment history shows reasonable job stability'
      };
    } else if (yearsEmployed >= this.criteria.minimumEmploymentYears) {
      return { 
        points: 0, 
        impact: 'neutral', 
        description: 'Employment history meets minimum requirements'
      };
    } else {
      return { 
        points: -50, 
        impact: 'negative', 
        description: 'Limited employment history suggests potential instability'
      };
    }
  }
} 