// SIMPLE PASSWORD STRENGTH CHECKER - NO BACKEND NEEDED
export const checkPasswordStrength = async (password) => {
  // Simple check - no backend call
  if (!password || password.trim() === '') {
    return { strength: 'EMPTY', message: 'Enter a password' };
  }
  
  if (password.length < 8) {
    return { strength: 'WEAK', message: 'Password too short (min 8 characters)' };
  }
  
  // Check for different character types
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(password);
  
  let points = 0;
  if (hasUpper) points++;
  if (hasLower) points++;
  if (hasDigit) points++;
  if (hasSpecial) points++;
  if (password.length >= 12) points++;
  
  if (points >= 5) {
    return { strength: 'STRONG', message: 'Strong password! 🔒' };
  } else if (points >= 3) {
    return { strength: 'MEDIUM', message: 'Medium strength password' };
  } else {
    return { strength: 'WEAK', message: 'Weak password - add more character types' };
  }
};

// Simple function to get colors
export const getStrengthColor = (strength) => {
  if (strength === 'STRONG') return 'green';
  if (strength === 'MEDIUM') return 'orange';
  if (strength === 'WEAK') return 'red';
  if (strength === 'EMPTY') return 'gray';
  return 'gray';
};