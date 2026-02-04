

/**
 * ============================================================
 * File Name   : OtpService.js
 * Location    : Service/otpService.js
 * Purpose     : 
 *   This service handles all OTP (One-Time Password) related
 *   API calls such as:
 *     1. Sending OTP to a mobile number
 *     2. Verifying OTP entered by the user
 *
 * Why this file exists:
 *   - To separate API logic from UI components
 *   - To centralize OTP-related backend communication
 *   - To make the code reusable and easy to maintain
 *
 * Debug Note:
 *   This version contains extensive console logs to help
 *   diagnose API issues during development or production debugging.
 * ============================================================
 */

import Config from '../config';

/**
 * Base URL of the backend API.
 * This value is taken from a centralized config file so that
 * it can be changed easily for different environments
 * (development, staging, production).
 */
const API_BASE_URL = Config.API_BASE_URL;

/**
 * ============================================================
 * Function Name : sendOTP
 * Purpose       :
 *   Sends an OTP to the given mobile number by calling
 *   the backend API.
 *
 * Parameters    :
 *   @param {string} mobileNumber - User's mobile number
 *
 * Returns       :
 *   @returns {Object} API response if OTP is sent successfully
 *
 * Throws        :
 *   Throws an error if the API request fails or server
 *   returns an error response.
 *
 * Flow Summary  :
 *   1. Build API URL
 *   2. Send POST request with mobile number
 *   3. Parse JSON response
 *   4. Handle success or failure
 * ============================================================
 */
export const sendOTP = async (mobileNumber) => {
    try {
        // Log the mobile number to which OTP is being sent
        console.log('Sending OTP to:', mobileNumber);

        // Log which API base URL is being used
        console.log('Using API URL:', API_BASE_URL);

        // Construct the full endpoint URL
        const url = `${API_BASE_URL}/signup/send-otp`;
        console.log('Full URL:', url);

        // Make the POST API call to send OTP
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // Inform server that request body is JSON
                'Content-Type': 'application/json',
            },
            // Send mobile number as JSON payload
            body: JSON.stringify({ mobileNumber }),
        });

        // Log HTTP status code (e.g., 200, 400, 500)
        console.log('Response status:', response.status);

        // Parse server response JSON
        const result = await response.json();
        console.log('Response data:', result);

        // If HTTP response is not successful, throw an error
        if (!response.ok) {
            throw new Error(result.message || 'Failed to send OTP');
        }

        // OTP sent successfully
        console.log('OTP sent successfully');
        return result;

    } catch (error) {
        // Catch and log any error (network, parsing, server)
        console.error('OTP sending error:', error);
        throw error;
    }
};

/**
 * ============================================================
 * Function Name : verifyOTP
 * Purpose       :
 *   Verifies the OTP entered by the user by calling
 *   the backend verification API.
 *
 * Parameters    :
 *   @param {string} mobileNumber - User's mobile number
 *   @param {string} otpCode      - OTP entered by the user
 *
 * Returns       :
 *   @returns {Object} API response if OTP verification succeeds
 *
 * Throws        :
 *   - "INVALID_OTP" if OTP is wrong
 *   - Generic error for other server or network issues
 *
 * Special Notes :
 *   - Response is first read as text and then parsed as JSON
 *     to safely handle invalid or malformed server responses.
 * ============================================================
 */
export const verifyOTP = async (mobileNumber, otpCode) => {
    try {
        // Log OTP verification attempt
        console.log('Verifying OTP:', { mobileNumber, otpCode });

        // Log API base URL
        console.log('Using API URL:', API_BASE_URL);

        // Construct the verification endpoint URL
        const url = `${API_BASE_URL}/signup/verify-otp`;
        console.log('Full URL:', url);

        /**
         * Request payload sent to backend.
         * Explicit key mapping is used for clarity.
         */
        const requestBody = {
            mobileNumber: mobileNumber,
            otp: otpCode
        };

        console.log('Request body:', JSON.stringify(requestBody));

        // Send OTP verification request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Log response details for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        /**
         * Read response as text first.
         * This avoids crashes if server returns non-JSON data.
         */
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
            // Attempt to parse response text as JSON
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            throw new Error('Invalid server response format');
        }

        console.log('Parsed response:', result);

        // Handle unsuccessful HTTP response
        if (!response.ok) {

            // Handle specific "Invalid OTP" error
            if (result.message && result.message.includes('Invalid OTP')) {
                throw new Error('INVALID_OTP');
            }

            // Generic server error
            throw new Error(result.message || `Server error: ${response.status}`);
        }

        // OTP verification successful
        console.log('OTP verification successful');
        return result;

    } catch (error) {
        // Log error reason clearly
        console.error('OTP verification error:', error.message);
        throw error;
    }
};