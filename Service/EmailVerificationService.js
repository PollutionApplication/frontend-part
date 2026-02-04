import Config from "../config";

export const verifyEmailExistence = async (email) => {
  try {
    console.log('=== EMAIL VERIFICATION ===');
    console.log('Email to verify:', email);
    
    // Validate email
    if (!email || email.trim() === '') {
      return {
        success: false,
        verified: false,
        message: 'Email is required',
        email: email,
        status: 'EMPTY'
      };
    }
    
    const emailLower = email.toLowerCase().trim();
    
    // Check if it's Gmail
    if (!emailLower.endsWith('@gmail.com')) {
      return {
        success: false,
        verified: false,
        message: 'Only Gmail addresses are allowed (@gmail.com)',
        email: email,
        status: 'NOT_GMAIL'
      };
    }
    
    // Prepare request
    const requestBody = { email: emailLower };
    
    const response = await fetch(`${Config.API_BASE_URL}/signup/emailexistence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return {
        success: false,
        verified: false,
        message: `Server error: ${response.status}`,
        email: email,
        status: 'HTTP_ERROR',
        statusCode: response.status
      };
    }
    
    const result = await response.json();
    console.log('Success response:', result);
    
    return result;
    
  } catch (error) {
    console.error('Email verification error:', error);
    
    return {
      success: false,
      verified: false,
      message: error.message || 'Unable to verify email',
      email: email,
      status: 'ERROR'
    };
  }
};