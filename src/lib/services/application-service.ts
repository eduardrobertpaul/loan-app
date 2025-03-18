import { LoanApplication } from "@/lib/types";
import { EvaluationEngine } from "@/lib/utils/evaluation-engine";

// Mock database for development - would be replaced with proper DB in production
let applications: LoanApplication[] = [
  {
    id: '1',
    applicant: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, CA 90210',
      dateOfBirth: '1985-06-15',
      employmentStatus: 'employed',
      employerName: 'Acme Corporation',
      jobTitle: 'Software Developer',
      yearsEmployed: 4,
    },
    financial: {
      income: 75000,
      monthlyExpenses: 2500,
      otherLoans: 500,
      creditScore: 720,
      bankruptcies: 0,
      existingProperties: 1,
    },
    loan: {
      amount: 25000,
      purpose: 'Home Renovation',
      term: 5,
      collateral: 'yes',
      collateralType: 'Home Equity',
      collateralValue: 150000,
    },
    status: 'pending',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-15T10:30:00Z',
    notes: [
      { id: '1', text: 'Initial application received', author: 'System', createdAt: '2023-03-15T10:30:00Z' },
      { id: '2', text: 'Credit check complete', author: 'Jane Smith', createdAt: '2023-03-16T14:22:00Z' },
    ],
  },
  // More sample applications can be added here
];

// Interface for filtering applications
interface GetApplicationsOptions {
  status?: string;
  applicantId?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Get all applications with optional filtering
 */
export async function getApplications(options: GetApplicationsOptions = {}): Promise<LoanApplication[]> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filtered = [...applications];
  
  // Apply filters
  if (options.status) {
    filtered = filtered.filter(app => app.status === options.status);
  }
  
  if (options.applicantId) {
    filtered = filtered.filter(app => app.applicant.id === options.applicantId);
  }
  
  if (options.minAmount) {
    filtered = filtered.filter(app => app.loan.amount >= options.minAmount!);
  }
  
  if (options.maxAmount) {
    filtered = filtered.filter(app => app.loan.amount <= options.maxAmount!);
  }
  
  return filtered;
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(id: string): Promise<LoanApplication | null> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const application = applications.find(app => app.id === id);
  return application || null;
}

/**
 * Create a new application
 */
export async function createApplication(application: LoanApplication): Promise<LoanApplication> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate a UUID for the new application (simple version for demo)
  const newId = (applications.length + 1).toString();
  
  // Add system note
  const notes = application.notes || [];
  notes.push({
    id: '1',
    text: 'Application submitted',
    author: 'System',
    createdAt: new Date().toISOString(),
  });
  
  // Run evaluation engine
  const evaluationEngine = new EvaluationEngine();
  const recommendation = evaluationEngine.evaluateApplication(application);
  
  // Create the new application with generated ID
  const newApplication: LoanApplication = {
    ...application,
    id: newId,
    notes,
    evaluationScore: recommendation.score,
    decisionReason: recommendation.message,
  };
  
  // Add to "database"
  applications.push(newApplication);
  
  return newApplication;
}

/**
 * Update an existing application
 */
export async function updateApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication | null> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the application with new values, preserving existing ones
  const updatedApplication: LoanApplication = {
    ...applications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // If financial or loan details changed, re-evaluate the application
  if (updates.financial || updates.loan) {
    const evaluationEngine = new EvaluationEngine();
    const recommendation = evaluationEngine.evaluateApplication(updatedApplication);
    
    updatedApplication.evaluationScore = recommendation.score;
    // Only update decision reason if status wasn't manually set by a user
    if (!updates.status) {
      updatedApplication.decisionReason = recommendation.message;
    }
  }
  
  // Update in "database"
  applications[index] = updatedApplication;
  
  return updatedApplication;
}

/**
 * Delete an application
 */
export async function deleteApplication(id: string): Promise<boolean> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const initialLength = applications.length;
  applications = applications.filter(app => app.id !== id);
  
  return applications.length < initialLength;
}

/**
 * Add a note to an application
 */
export async function addApplicationNote(
  applicationId: string, 
  note: { text: string; author: string; }
): Promise<LoanApplication | null> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const application = await getApplicationById(applicationId);
  
  if (!application) {
    return null;
  }
  
  const notes = application.notes || [];
  const newNote = {
    id: (notes.length + 1).toString(),
    text: note.text,
    author: note.author,
    createdAt: new Date().toISOString(),
  };
  
  notes.push(newNote);
  
  return updateApplication(applicationId, { 
    notes, 
    updatedAt: new Date().toISOString() 
  });
}

/**
 * Process an application (approve or reject)
 */
export async function processApplication(
  applicationId: string,
  decision: 'approved' | 'rejected',
  reviewerName: string,
  comments?: string
): Promise<LoanApplication | null> {
  const application = await getApplicationById(applicationId);
  
  if (!application) {
    return null;
  }
  
  // Add note about the decision
  const notes = application.notes || [];
  notes.push({
    id: (notes.length + 1).toString(),
    text: `Application ${decision}${comments ? `: ${comments}` : ''}`,
    author: reviewerName,
    createdAt: new Date().toISOString(),
  });
  
  // Update application status and reviewer info
  return updateApplication(applicationId, {
    status: decision,
    notes,
    reviewedBy: reviewerName,
    reviewedAt: new Date().toISOString(),
  });
} 