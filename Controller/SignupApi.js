const API_BASE_URL = 'http://192.168.1.4:1006/api'; // Your MacBook IP

// Function to check if backend is available
const checkBackendConnection = async () => {
  try {
    // Test the new test endpoint
    const response = await fetch(`${API_BASE_URL}/signup/test`, {
      method: 'GET',
    });
    
    console.log('Backend connection test - Status:', response.status);
    return response.ok; // Returns true if status is 200-299
    
  } catch (error) {
    console.log('Backend is not available:', error.message);
    return false;
  }
};

// POST: create user
export const postSignup = async (userData) => {
  try {
    console.log('Starting API call to:', `${API_BASE_URL}/signup/post`);
    
    // Check if backend is reachable using the test endpoint
    const isBackendReachable = await checkBackendConnection();
    
    if (!isBackendReachable) {
      throw new Error('NETWORK_ERROR');
    }

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
      
      // Check for duplicate errors
      if (response.status === 400 || response.status === 409) {
        throw new Error('DUPLICATE_ENTRY');
      }
      
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Signup successful:', result);
    return result;

  } catch (error) {
    console.error('Signup API error:', error);
    
    // Handle network errors - show friendly message
    if (error.message.includes('Network request failed') || 
        error.message.includes('Failed to fetch') ||
        error.message === 'NETWORK_ERROR') {
      throw new Error('NETWORK_ERROR');
    }
    
    throw error;
  }
};