// ./config.js
export default {
  API_BASE_URL: 'http://10.0.2.2:1997/api',
  
  // Test method
  testApiConnection: async () => {
    try {
      
      // Test with email verification endpoint
      const Emailresponse = await fetch(`${this.API_BASE_URL}/signup/emailexistence`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: 'siddhardhadepu@gmail.com' }),
      });
      const EmailData = await Emailresponse.json();
      
      // Also test OTP endpoint
      const response = await fetch(`${this.API_BASE_URL}/signup/send-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ mobileNumber: '8142268525' }),
      });
      
      const data = await response.json();
      
      return { email: EmailData, otp: data };
      
    } catch (error) {
      return { error: error.message };
    }
  }
};