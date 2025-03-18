'use client';

import { useTranslations } from 'next-intl';

export function useTranslation() {
  const t = useTranslations();

  return {
    t,
    // Common translations
    common: {
      appTitle: t('common.appTitle'),
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
      admin: t('navigation.admin')
    }
  };
} 