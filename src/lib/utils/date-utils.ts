/**
 * Extracts date components from a date string
 * @param dateString - The date string in format YYYY-MM-DD
 * @returns Object with day, month, and year
 */
export function extractDate(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1, // Month is 0-indexed
    year: date.getFullYear(),
  };
}

/**
 * Formats a date string to a human-readable format
 * @param dateString - The date string in format YYYY-MM-DD
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Calculates age from date of birth
 * @param dateOfBirth - The date of birth string in format YYYY-MM-DD
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
} 