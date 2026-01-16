import Config from '../config';  // Import the config

const API_BASE_URL = Config.API_BASE_URL;  // Use from config

// POST: create user
export const postSignup = async (userData) => {
  try {
console.log('Using API URL from config:', API_BASE_URL);
    console.log('Starting API call to:', `${API_BASE_URL}/signup/post`);
    const requestData = {
      username: userData.name,
      password: userData.password,
      confirmpassword: userData.confirmpassword,
      age: userData.age,
      gender: userData.gender,
      emailid: userData.emailid,
      mobilenumber: userData.mobilenumber,
      mobilenumbersignupverificationotp: userData.otp
    };

    console.log('Sending data to backend:', JSON.stringify(requestData, null, 2));

    const response = await fetch(`${API_BASE_URL}/signup/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      
      console.log('Error response:', errorData);
      
      // ✅ CHECK FOR SPECIFIC BACKEND ERROR MESSAGES
      if (response.status === 400) {
        if (errorData.message && errorData.message.includes('Email already exists')) {
          throw new Error('EMAIL_EXISTS');
        } else if (errorData.message && errorData.message.includes('Mobile number already exists')) {
          throw new Error('MOBILE_EXISTS');
        } else {
          throw new Error('DUPLICATE_ENTRY');
        }
      }
      
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Signup successful:', result);
    return result;

  } catch (error) {
    console.error('Signup API error:', error);
    
    // Handle network errors
    if (error.message.includes('Network request failed') || 
        error.message.includes('Failed to fetch') ||
        error.message === 'NETWORK_ERROR') {
      throw new Error('NETWORK_ERROR');
    }
    
    throw error;
  }
};