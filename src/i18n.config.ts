export const locales = ['ro', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

// Define the structure of translations for type safety
export interface Messages {
  common: {
    appTitle: string;
    loading: string;
    error: string;
    required: string;
    submit: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    view: string;
    back: string;
    next: string;
    previous: string;
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    forgotPassword: string;
    signIn: string;
    signInError: string;
    signInSuccess: string;
  };
  navigation: {
    dashboard: string;
    applications: string;
    newApplication: string;
    profile: string;
    settings: string;
    logout: string;
    admin: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    pendingApplications: string;
    approvedApplications: string;
    rejectedApplications: string;
    recentActivity: string;
  };
  applications: {
    title: string;
    list: string;
    new: string;
    status: string;
    id: string;
    applicantName: string;
    loanAmount: string;
    purpose: string;
    createdAt: string;
    actions: string;
    pending: string;
    approved: string;
    rejected: string;
    viewDetails: string;
    evaluate: string;
    all: string;
    noApplications: string;
  };
  applicationForm: {
    title: string;
    personalInfo: string;
    financialInfo: string;
    loanDetails: string;
    review: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    annualIncome: string;
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    yearsEmployed: string;
    monthlyExpenses: string;
    otherLoans: string;
    creditScore: string;
    bankruptcy: string;
    foreclosure: string;
    loanAmount: string;
    loanPurpose: string;
    loanTerm: string;
    collateral: string;
    collateralType: string;
    collateralValue: string;
    purpose: {
      home: string;
      auto: string;
      education: string;
      personal: string;
      business: string;
      debt_consolidation: string;
      other: string;
    };
    employment: {
      employed: string;
      self_employed: string;
      unemployed: string;
      retired: string;
    };
    reviewTitle: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
  };
  applicationDetails: {
    title: string;
    status: string;
    applicantInfo: string;
    financialInfo: string;
    loanInfo: string;
    evaluation: string;
    notes: string;
    addNote: string;
    noteAdded: string;
    evaluationScore: string;
    evaluationFactors: string;
    evaluationSummary: string;
    evaluationDate: string;
    runEvaluation: string;
    evaluationSuccess: string;
    evaluationError: string;
  };
  errors: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidDate: string;
    invalidNumber: string;
    minValue: string;
    maxValue: string;
    minLength: string;
    maxLength: string;
    passwordMismatch: string;
    serverError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
  };
} 