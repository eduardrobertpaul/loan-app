'use client';

import { useTranslations } from 'next-intl';

export function useTranslation() {
  const t = useTranslations();

  return {
    t,
    // Common translations
    common: {
      appTitle: t('common.appTitle'),
      appDescription: t('common.appDescription'),
      loading: t('common.loading'),
      error: t('common.error'),
      required: t('common.required'),
      submit: t('common.submit'),
      cancel: t('common.cancel'),
      save: t('common.save'),
      edit: t('common.edit'),
      delete: t('common.delete'),
      view: t('common.view'),
      back: t('common.back'),
      next: t('common.next'),
      previous: t('common.previous')
    },
    // Auth translations
    auth: {
      login: t('auth.login'),
      logout: t('auth.logout'),
      email: t('auth.email'),
      password: t('auth.password'),
      forgotPassword: t('auth.forgotPassword'),
      signIn: t('auth.signIn'),
      signInError: t('auth.signInError'),
      signInSuccess: t('auth.signInSuccess')
    },
    // Navigation translations
    navigation: {
      dashboard: t('navigation.dashboard'),
      applications: t('navigation.applications'),
      newApplication: t('navigation.newApplication'),
      profile: t('navigation.profile'),
      settings: t('navigation.settings'),
      logout: t('navigation.logout'),
      admin: t('navigation.admin'),
      login: t('auth.login')
    },
    // Dashboard translations
    dashboard: {
      title: t('dashboard.title'),
      pendingApplications: t('dashboard.pendingApplications'),
      approvedApplications: t('dashboard.approvedApplications'),
      rejectedApplications: t('dashboard.rejectedApplications'),
      recentActivity: t('dashboard.recentActivity'),
      quickActions: t('dashboard.quickActions')
    },
    // Applications translations
    applications: {
      title: t('applications.title'),
      list: t('applications.list'),
      new: t('applications.new'),
      status: t('applications.status'),
      id: t('applications.id'),
      applicantName: t('applications.applicantName'),
      loanAmount: t('applications.loanAmount'),
      purpose: t('applications.purpose'),
      createdAt: t('applications.createdAt'),
      actions: t('applications.actions'),
      pending: t('applications.pending'),
      approved: t('applications.approved'),
      rejected: t('applications.rejected'),
      viewDetails: t('applications.viewDetails'),
      evaluate: t('applications.evaluate'),
      all: t('applications.all'),
      noApplications: t('applications.noApplications')
    },
    // Application Form translations
    applicationForm: {
      title: t('applicationForm.title'),
      personalInfo: t('applicationForm.personalInfo'),
      financialInfo: t('applicationForm.financialInfo'),
      loanDetails: t('applicationForm.loanDetails'),
      review: t('applicationForm.review'),
      firstName: t('applicationForm.firstName'),
      lastName: t('applicationForm.lastName'),
      email: t('applicationForm.email'),
      phone: t('applicationForm.phone'),
      dateOfBirth: t('applicationForm.dateOfBirth'),
      address: t('applicationForm.address'),
      annualIncome: t('applicationForm.annualIncome'),
      employmentStatus: t('applicationForm.employmentStatus'),
      monthlyExpenses: t('applicationForm.monthlyExpenses'),
      otherLoans: t('applicationForm.otherLoans'),
      creditScore: t('applicationForm.creditScore'),
      loanAmount: t('applicationForm.loanAmount'),
      loanPurpose: t('applicationForm.loanPurpose'),
      loanTerm: t('applicationForm.loanTerm'),
      collateral: t('applicationForm.collateral'),
      reviewTitle: t('applicationForm.reviewTitle'),
      submit: t('applicationForm.submit'),
      submitSuccess: t('applicationForm.submitSuccess'),
      submitError: t('applicationForm.submitError')
    },
    // Application Details translations
    applicationDetails: {
      title: t('applicationDetails.title'),
      status: t('applicationDetails.status'),
      applicantInfo: t('applicationDetails.applicantInfo'),
      financialInfo: t('applicationDetails.financialInfo'),
      loanInfo: t('applicationDetails.loanInfo'),
      evaluation: t('applicationDetails.evaluation'),
      notes: t('applicationDetails.notes'),
      addNote: t('applicationDetails.addNote'),
      evaluationScore: t('applicationDetails.evaluationScore'),
      evaluationFactors: t('applicationDetails.evaluationFactors'),
      evaluationSummary: t('applicationDetails.evaluationSummary'),
      runEvaluation: t('applicationDetails.runEvaluation')
    }
  };
} 