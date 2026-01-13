import { signinUser } from '../Service/SigninService';

// Controller function to handle SIGNIN logic - MINIMAL VALIDATION
export const handleSignin = async (userData) => {
  try {
    // Only check if fields are not empty
    if (!userData.emailid || !userData.password) {
      throw new Error('EMAIL_PASSWORD_REQUIRED');
    }

    // Remove all format validations - allow any characters
    // This allows special symbols, numbers, uppercase, lowercase, etc.

    // Call the signin service
   const result = await signinUser ({
    emailid : userData.emailid ,
    password: userData.password
   });
   return result ; 
  } catch (error) {
    console.error('Signin controller error:', error);
    throw error;
  }
};