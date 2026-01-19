/**
 * styles.js
 * -----------
 * This file contains all UI styling for the Signup Screen
 * including inputs, buttons, OTP modal, password strength,
 * gender/age rows, and verification states.
 *
 * Centralizing styles here helps maintain consistency,
 * readability, and easy updates in the future.
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  /**
   * Main container for the entire screen
   * - flexGrow: 1 ensures ScrollView content fills screen
   * - justifyContent: 'center' centers content vertically
   */
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    justifyContent: 'center',
  },

  /**
   * Main screen title (e.g., "Signup")
   * Displayed at the top of the screen
   */
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    alignSelf: 'center',
  },

  /**
   * Common input field style
   * Used for name, mobile number, email, etc.
   */
  input: {
    backgroundColor: '#C0C0C0',
    borderBottomWidth: 2,
    borderBottomColor: '#888',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },

  /**
   * Generic button style
   * Used when a reusable primary button is required
   */
  button: {
    backgroundColor: '#001f54',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 5,
  },

  /* Text inside generic button */
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  /**
   * Disabled button style
   * Used when form validation fails
   */
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
    opacity: 0.6,
  },

  /**
   * SEND OTP Button style
   * Specifically for sending OTP to mobile
   */
  sendOtpButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  /* Text inside Send OTP button */
  sendOtpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /**
   * SIGNUP Button style
   * Used to submit signup form after OTP verification
   */
  signupButton: {
    backgroundColor: '#001f54',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  /* * Signup button text*/
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /**
   * AGE selection row
   * Displays age label and picker/selector
   */
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },

  /* Age label text */
  ageLabel: {
    fontSize: 16,
    color: '#000',
  },

  /**
   * GENDER selection row
   * Contains radio buttons (Male/Female/Other)
   */
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },

  /*Gender label text*/
  genderLabel: {
    fontSize: 16,
    color: '#000',
  },

  /* Wrapper for gender radio options*/
  genderOptionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },

  /* Individual radio option (circle + label)*/
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Radio button outer circle*/
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },

  /* Applied when radio option is selected*/
  selectedRadio: {
    backgroundColor: '#001f54',
  },

  /* Radio label text*/
  radioLabel: {
    fontSize: 16,
    color: '#000',
  },

  /* Error text displayed below inputs*/
  errorText: {
    color: '#001f54',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -5,
  },

  /**
   * Password input container
   * Includes password field + eye button
   */
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    borderBottomWidth: 2,
    borderBottomColor: '#888',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
  },

  /* Password input field*/
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingVertical: 10,
  },

  /*Eye (show/hide password) button*/
  eyeButton: {
    padding: 5,
  },

  /*Eye button text*/
  eyeText: {
    color: '#001f54',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Applied when input has validation error*/
  inputError: {
    borderBottomColor: '#FF0000',
    backgroundColor: '#C0C0C0',
  },

  /* Password strength container*/
  strengthContainer: {
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  /* Password strength text*/
  strengthText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Small demo/help info text*/
  demoInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

  /* OTP modal background overlay*/
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* OTP modal main container*/
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },

  /*OTP modal title */
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

    /*OTP modal subtitle text */
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },

    /*  OTP timer container */

  timerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },

  /* OTP timer text*/
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },

  /* Warning color when OTP time is low*/
  timerWarning: {
    color: '#f44336',
  },

  /*OTP input boxes container*/
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '100%',
  },

  /* Individual OTP digit input*/
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },

  /* OTP verify button*/
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Resend OTP button*/
  resendButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },

  resendButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },

  /* Close modal button*/
  closeButton: {
    padding: 10,
  },

  closeButtonText: {
    color: '#666',
    fontSize: 14,
  },

  /* OTP verified success container*/
  verifiedContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },

  verifiedText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  verifiedSubtext: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },

  changeOtpButton: {
    alignSelf: 'flex-start',
    padding: 5,
  },

  changeOtpText: {
    color: '#2196F3',
    fontSize: 12,
  },

  /* Informational note container*/
  noteContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    marginTop: 10,
  },

  noteTitle: {
    color: '#856404',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  noteText: {
    color: '#856404',
    fontSize: 12,
    lineHeight: 18,
  },

  /*Password strength helper colors*/
  strengthStrong: { color: '#4CAF50' },
  strengthMedium: { color: '#FF9800' },
  strengthWeak: { color: '#F44336' },
  strengthEmpty: { color: '#666' },
});
