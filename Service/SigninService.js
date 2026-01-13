// Service function for SIGNIN (login existing user)
const API_BASE_URL = 'http://10.0.2.2:1006/api';

export const signinUser = async (userData) => {
  try {
    console.log('Starting SIGNIN API call...');

    // For signin, only send email or mobilenumber or password and password
    const requestData = {
      password: userData.password,
      emailidmobilenumberusername: userData.emailid
      // REMOVE mobilenumber for signin
    };

    console.log('Sending signin data:', requestData);

    const response = await fetch(`${API_BASE_URL}/signup/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Signin response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      
      console.log('Signin error response:', errorData);
      
      // Handle specific backend errors for SIGNIN
      if (response.status === 401) {
        throw new Error('INVALID_CREDENTIALS');
      } else if (response.status === 404) {
        throw new Error('USER_NOT_FOUND');
      }
      
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Signin successful:', result);
    return result;

  } catch (error) {
    console.error('Signin service error:', error);
    
    // Handle network errors
    if (error.message.includes('Network request failed') || 
        error.message.includes('Failed to fetch')) {
      throw new Error('NETWORK_ERROR');
    }
    
    throw error;
  }
};