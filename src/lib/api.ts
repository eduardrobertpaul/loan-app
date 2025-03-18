/**
 * API utility functions for data fetching
 * In a real application, these would make actual API calls to the server
 */

import { LoanApplication } from './types';

// Mock data for simulation
const MOCK_APPLICATIONS: LoanApplication[] = [
  {
    id: '1',
    applicantName: 'John Doe',
    applicantAge: 35,
    income: 75000,
    creditScore: 720,
    loanAmount: 250000,
    loanTerm: 360, // 30 years in months
    purpose: 'home',
    status: 'approved',
    createdAt: '2024-03-10T12:00:00Z',
  },
  {
    id: '2',
    applicantName: 'Jane Smith',
    applicantAge: 28,
    income: 60000,
    creditScore: 680,
    loanAmount: 35000,
    loanTerm: 60, // 5 years in months
    purpose: 'auto',
    status: 'pending',
    createdAt: '2024-03-15T09:30:00Z',
  },
];

// Simulate API delay
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all loan applications
export const fetchApplications = async (): Promise<LoanApplication[]> => {
  await simulateDelay();
  return [...MOCK_APPLICATIONS];
};

// Fetch a single loan application by ID
export const fetchApplicationById = async (id: string): Promise<LoanApplication> => {
  await simulateDelay();
  const application = MOCK_APPLICATIONS.find(app => app.id === id);
  
  if (!application) {
    throw new Error(`Application with ID ${id} not found`);
  }
  
  return { ...application };
};

// Create a new loan application
export const createApplication = async (data: Omit<LoanApplication, 'id' | 'status' | 'createdAt'>): Promise<LoanApplication> => {
  await simulateDelay();
  
  const newApplication: LoanApplication = {
    ...data,
    id: `app-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  // In a real app, this would be persisted to a database
  MOCK_APPLICATIONS.push(newApplication);
  
  return newApplication;
};

// Update an existing loan application
export const updateApplication = async (id: string, data: Partial<LoanApplication>): Promise<LoanApplication> => {
  await simulateDelay();
  
  const index = MOCK_APPLICATIONS.findIndex(app => app.id === id);
  
  if (index === -1) {
    throw new Error(`Application with ID ${id} not found`);
  }
  
  const updatedApplication = {
    ...MOCK_APPLICATIONS[index],
    ...data,
  };
  
  // Update in mock data (in a real app, this would update a database record)
  MOCK_APPLICATIONS[index] = updatedApplication;
  
  return updatedApplication;
};

// Delete a loan application
export const deleteApplication = async (id: string): Promise<void> => {
  await simulateDelay();
  
  const index = MOCK_APPLICATIONS.findIndex(app => app.id === id);
  
  if (index === -1) {
    throw new Error(`Application with ID ${id} not found`);
  }
  
  // Remove from mock data (in a real app, this would delete from a database)
  MOCK_APPLICATIONS.splice(index, 1);
}; 