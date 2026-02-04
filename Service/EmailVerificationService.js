import Config from "../config";

export const verifyEmailExistence = async (email) => {
  try {
   
    
    // Validate email
    if (!email || email.trim() === '') {
      throw new Error('Email is required');
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
    
    
    if (response.status === 403) {
      console.error('403 Forbidden - Check CORS or nginx configuration');
      return {
        success: false,
        verified: false,
        message: 'Server access forbidden. Please check server configuration.',
        email: email,
        status: 'FORBIDDEN',
        statusCode: 403
      };
    }
    
    if (response.status === 404) {
      console.error('404 Not Found - Endpoint does not exist');
      return {
        success: false,
        verified: false,
        message: 'Email verification endpoint not found. Check backend URL.',
        email: email,
        status: 'ENDPOINT_NOT_FOUND',
        statusCode: 404
      };
    }
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      
      // Try to parse as JSON
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Server returned ${response.status}`);
      } catch {
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('Success response:', result);
    
    return result;
    
  } catch (error) {
    console.error('Email verification error:', error);
    console.error('Error stack:', error.stack);
    
    return {
      success: false,
      verified: false,
      message: error.message || 'Unable to verify email. Please try again.',
      email: email,
      status: 'ERROR',
      error: error.message
    };
  }
};

// Optional: Add a simple connectivity test
export const testBackendConnectivity = async () => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/health` || `${Config.API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Connectivity test response:', response.status);
    return response.status === 200 || response.status === 404;
  } catch (error) {
    console.log('Connectivity test failed:', error.message);
    return false;
  }
};