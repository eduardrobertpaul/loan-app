import { create } from 'zustand';

// Define types for our application state
interface LoanApplication {
  id: string;
  applicantName: string;
  applicantAge: number;
  income: number;
  creditScore: number;
  loanAmount: number;
  loanTerm: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AppState {
  // Application state
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setApplications: (applications: LoanApplication[]) => void;
  addApplication: (application: LoanApplication) => void;
  updateApplication: (id: string, data: Partial<LoanApplication>) => void;
  setCurrentApplication: (application: LoanApplication | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

// Initial state
const initialState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
};

// Create the store
export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  // Actions
  setApplications: (applications) => set({ applications }),
  
  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, application],
    })),
  
  updateApplication: (id, data) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...data } : app
      ),
    })),
  
  setCurrentApplication: (application) => set({ currentApplication: application }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  resetStore: () => set(initialState),
})); 