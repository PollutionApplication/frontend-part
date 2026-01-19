/**
 * ============================================================
 * File Name  : SignupScreen.js
 * Type       : React Native Screen Component
 *
 * PURPOSE:
 * ------------------------------------------------------------
 * This screen handles the complete user signup process:
 * 1. Collects user details (name, password, age, gender, email, mobile)
 * 2. Checks password strength via backend
 * 3. Sends OTP to mobile number
 * 4. Verifies OTP using backend API
 * 5. Allows signup ONLY after OTP verification
 *
 * IMPORTANT DESIGN DECISIONS:
 * ------------------------------------------------------------
 * - OTP verification is mandatory before signup
 * - OTP expires after 2 minutes
 * - Signup must be completed within 100 seconds after OTP verification
 * - Temporary in-memory storage is used ONLY for demo/testing
 * - otp         : Final verified OTP
 * - tempOtp     : Array to store each OTP digit (UI input)
 *
 * ============================================================
 */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import signupStyles from "../styles/SignupStyles";
import { postSignup } from "../Controller/SignupApi";
import { checkPasswordStrength, getStrengthColor } from "../Service/PasswordService";
import { sendOTP, verifyOTP } from "../Service/OtpService";
import Config from '../config';

// TEMPORARY DEMO STORAGE
let demoUsers = [];

export default function SignupScreen({ navigation }) {
  // STATE VARIABLES
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [emailid, setEmailid] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 'EMPTY',
    message: 'Enter a password'
  });
  const [checkingStrength, setCheckingStrength] = useState(false);

  // NEW STATE FOR OTP FLOW
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(120);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [tempOtp, setTempOtp] = useState(["", "", "", "", "", ""]);

  const otpInputRefs = useRef([]);

  //  Helper functions
  const checkIfEmailExists = (email) => {
    return demoUsers.some(user => user.emailid === email);
  };

  const checkIfMobileExists = (mobile) => {
    return demoUsers.some(user => user.mobilenumber === mobile);
  };

  const checkDuplicates = (email, mobile) => {
    const emailExists = checkIfEmailExists(email);
    const mobileExists = checkIfMobileExists(mobile);

    return {
      emailExists: emailExists,
      mobileExists: mobileExists,
      bothExist: emailExists && mobileExists
    };
  };

  const ageOptions = [
    "5-10", "11-20", "21-30", "31-40",
    "41-50", "51-60", "61-70", "71+"
  ];

  const checkIfUserExists = (email, mobile) => {
    return demoUsers.some(user =>
      user.emailid === email || user.mobilenumber === mobile
    );
  };

  const clearForm = () => {
    setName("");
    setPassword("");
    setConfirmpassword("");
    setAge("");
    setGender("");
    setEmailid("");
    setMobilenumber("");
    setOtp("");
    setErrors({});
    setPasswordStrength({ strength: 'EMPTY', message: 'Enter a password' });
    setCheckingStrength(false);

    // Reset OTP state
    setOtpSent(false);
    setSendingOtp(false);
    setVerifyingOtp(false);
    setOtpVerified(false);
    setTimer(120);
    setShowOTPModal(false);
    setTempOtp(["", "", "", "", "", ""]);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Timer effect
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  //  Handle Send OTP button click
  const handleSendOtp = async () => {
    // First, check if mobile number is entered
    if (!mobilenumber.trim()) {
      Alert.alert("Error", "Please enter mobile number first");
      return;
    }

    // Check mobile number format (basic check - 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobilenumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    // For testing
    const testMobile = mobilenumber === '9999999999' ? '8142268525' : mobilenumber;
    setSendingOtp(true);

    try {
      // Call backend API to send OTP
      const result = await sendOTP(testMobile);

      Alert.alert(
        "OTP Sent",
        `OTP has been sent to ${testMobile}. Please verify within 2 minutes.`,
        [{ text: "OK" }]
      );

      // Set OTP sent state and start timer
      setOtpSent(true);
      setTimer(120);
      setShowOTPModal(true);
      setOtpVerified(false);
      setOtp(""); // Clear previous OTP

    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  //  Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...tempOtp];
    newOtp[index] = value;
    setTempOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        otpInputRefs.current[index + 1]?.focus();
      }, 10);
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0) {
      setTimeout(() => {
        otpInputRefs.current[index - 1]?.focus();
      }, 10);
    }
  };

  //  Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = tempOtp.join('');

    console.log('=== OTP VERIFICATION DEBUG ===');
    console.log('OTP entered:', otpString);
    console.log('Mobile from state:', mobilenumber);
    console.log('Config API URL:', Config.API_BASE_URL);

    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter 6-digit OTP");
      return;
    }

    // For testing
    const testMobile = mobilenumber === '9999999999' ? '8142268525' : mobilenumber;
    console.log('Mobile after conversion:', testMobile);

    setVerifyingOtp(true);

    try {
      const result = await verifyOTP(testMobile, otpString);

      if (result.verified) {
        Alert.alert("Success", result.message || "Mobile number verified successfully!");

        // Set OTP state for signup
        setOtp(otpString);
        setOtpVerified(true);
        setShowOTPModal(false);

        // Show important timing message
        Alert.alert(
          "Important Note",
          "✓ OTP verified successfully!\n\n⚠️ IMPORTANT: \n• You must complete signup within 100 seconds\n• Use the same OTP in signup form\n• Session expires in 10 minutes",
          [{ text: "Got it!" }]
        );
      } else {
        Alert.alert("Error", result.message || "Invalid OTP");
        // Clear OTP on error
        setTempOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  //  Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Resend OTP
  const handleResendOtp = async () => {
    await handleSendOtp();
    setTempOtp(["", "", "", "", "", ""]);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Password strength check via backend
  const handlePasswordChange = async (text) => {
    setPassword(text);
    setCheckingStrength(true);

    try {
      console.log("Checking password strength via backend for:", text);

      const response = await fetch(`${Config.API_BASE_URL}/signup/check-password-strength`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: text }),
      });

      console.log("Backend response status:", response.status);

      if (!response.ok) {
        throw new Error("Backend returned " + response.status);
      }

      const result = await response.json();
      console.log("Password strength result:", result);
      setPasswordStrength(result);

    } catch (error) {
      console.error("Password strength check error:", error);
    } finally {
      setCheckingStrength(false);
    }
  };

  const handleEmailChange = (text) => {
    setEmailid(text);
    if (errors.emailid) {
      setErrors(prev => ({ ...prev, emailid: "" }));
    }
  };

  const handleMobileChange = (text) => {
    setMobilenumber(text);
    if (errors.mobilenumber) {
      setErrors(prev => ({ ...prev, mobilenumber: "" }));
    }

    // Reset OTP state if mobile number changes
    if (otpSent || otpVerified) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setTempOtp(["", "", "", "", "", ""]);
      setShowOTPModal(false);
    }
  };

  const isSignupDisabled = () => {
    return (
      isLoading ||
      !name.trim() ||
      !password ||
      !confirmpassword ||
      !age ||
      !gender ||
      !emailid.trim() ||
      !mobilenumber.trim() ||
      !otpVerified ||
      password !== confirmpassword
    );
  };

  //  Main signup handler
  const handleSignup = async () => {
    if (isLoading) return;

    let newErrors = {};

    // Simple form validation
    if (!name.trim()) newErrors.name = "Please enter name";
    if (!password) newErrors.password = "Please enter password";
    if (!confirmpassword) newErrors.confirmpassword = "Please enter confirm password";
    if (password && password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }
    if (!age) newErrors.age = "Please select age";
    if (!gender) newErrors.gender = "Please select gender";
    if (!emailid.trim()) newErrors.emailid = "Please enter email ID";
    if (!mobilenumber.trim()) newErrors.mobilenumber = "Please enter mobile number";
    if (!otpVerified) newErrors.otp = "Please verify OTP first";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Duplicate check
    const duplicates = checkDuplicates(emailid, mobilenumber);
    if (duplicates.bothExist) {
      Alert.alert("Account Exists", "Both email and mobile already registered!");
      return;
    }
    if (duplicates.emailExists) {
      Alert.alert("Email Exists", "This email is already registered!");
      return;
    }
    if (duplicates.mobileExists) {
      Alert.alert("Mobile Exists", "This mobile number is already registered!");
      return;
    }

    setIsLoading(true);

    try {
      // For testing
      const testMobile = mobilenumber === '9999999999' ? '8142268525' : mobilenumber;

      const result = await postSignup({
        name,
        password,
        confirmpassword,
        age,
        gender,
        emailid,
        mobilenumber: testMobile,
        otp,
      });

      console.log("Backend response:", result);

      // Save to demo data
      demoUsers.push({
        name,
        emailid,
        mobilenumber: testMobile,
        age,
        gender,
        signupDate: new Date().toISOString(),
      });

      Alert.alert("Success", "Signup successful!", [
        {
          text: "OK",
          onPress: () => {
            clearForm();
            navigation.navigate("Home");
          }
        },
      ]);

    } catch (error) {
      console.error("Signup error:", error);

      if (error.message === "Invalid OTP! Please enter correct OTP." ||
        error.message.includes("Invalid OTP")) {
        Alert.alert(
          "OTP Expired",
          "The OTP has expired or is invalid. Please:\n\n1. Send new OTP\n2. Verify again\n3. Complete signup within 100 seconds"
        );
        setOtpVerified(false);
        setOtpSent(true);
        setShowOTPModal(true);
        setTimer(120);
      } else {
        Alert.alert("Error", error.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //  OTP Modal Component
  const renderOTPModal = () => (
    <Modal
      visible={showOTPModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowOTPModal(false)}
    >
      <View style={signupStyles.modalOverlay}>
        <View style={signupStyles.modalContent}>
          <Text style={signupStyles.modalTitle}>Verify OTP</Text>

          <Text style={signupStyles.modalSubtitle}>
            Enter 6-digit OTP sent to {mobilenumber === '9999999999' ? '8142268525' : mobilenumber}
          </Text>

          {/* Timer */}
          <View style={signupStyles.timerContainer}>
            <Text style={[signupStyles.timerText, timer < 30 && signupStyles.timerWarning]}>
              ⏰ Expires in: {formatTime(timer)}
            </Text>
          </View>

          {/* OTP Inputs */}
          <View style={signupStyles.otpContainer}>
            {tempOtp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) otpInputRefs.current[index] = ref;
                }}
                style={signupStyles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              signupStyles.modalButton,
              verifyingOtp && signupStyles.buttonDisabled
            ]}
            onPress={handleVerifyOtp}
            disabled={verifyingOtp}
          >
            <Text style={signupStyles.modalButtonText}>
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          {/* Resend Button */}
          <TouchableOpacity
            style={signupStyles.resendButton}
            onPress={handleResendOtp}
            disabled={timer > 0 || sendingOtp}
          >
            <Text style={signupStyles.resendButtonText}>
              {sendingOtp ? "Sending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            style={signupStyles.closeButton}
            onPress={() => setShowOTPModal(false)}
          >
            <Text style={signupStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // OTP Status Display (if verified)
  const renderOTPStatus = () => {
    if (otpVerified) {
      return (
        <View style={signupStyles.verifiedContainer}>
          <Text style={signupStyles.verifiedText}>✓ Mobile Verified</Text>
          <Text style={signupStyles.verifiedSubtext}>
            Complete signup within 100 seconds
          </Text>
          <TouchableOpacity
            onPress={() => setShowOTPModal(true)}
            style={signupStyles.changeOtpButton}
          >
            <Text style={signupStyles.changeOtpText}>Change OTP</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (otpSent && !otpVerified) {
      return (
        <TouchableOpacity
          style={signupStyles.changeOtpButton}
          onPress={() => setShowOTPModal(true)}
        >
          <Text style={signupStyles.changeOtpText}>
            Enter/Verify OTP ({formatTime(timer)} remaining)
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <ScrollView contentContainerStyle={signupStyles.container}>
      <Text style={signupStyles.title}>Sign Up</Text>

      <TextInput
        style={[signupStyles.input, errors.name && signupStyles.inputError]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={signupStyles.errorText}>{errors.name}</Text>}

      {/* Password field */}
      <View style={signupStyles.passwordContainer}>
        <TextInput
          style={[signupStyles.passwordInput, errors.password && signupStyles.inputError]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity
          style={signupStyles.eyeButton}
          onPress={toggleShowPassword}
        >
          <Text style={signupStyles.eyeText}>
            {showPassword ? "HIDE" : "SHOW"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={signupStyles.strengthContainer}>
        {checkingStrength ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#001f54" />
            <Text style={[signupStyles.strengthText, { marginLeft: 8 }]}>
              Checking strength...
            </Text>
          </View>
        ) : (
          <Text
            style={[
              signupStyles.strengthText,
              { color: getStrengthColor(passwordStrength.strength) },
            ]}
          >
            {passwordStrength.message}
          </Text>
        )}
      </View>

      {errors.password && <Text style={signupStyles.errorText}>{errors.password}</Text>}

      {/* Confirm Password */}
      <View style={signupStyles.passwordContainer}>
        <TextInput
          style={[signupStyles.passwordInput, errors.confirmpassword && signupStyles.inputError]}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmpassword}
          onChangeText={setConfirmpassword}
        />
        <TouchableOpacity
          style={signupStyles.eyeButton}
          onPress={toggleShowConfirmPassword}
        >
          <Text style={signupStyles.eyeText}>
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </Text>
        </TouchableOpacity>
      </View>
      {errors.confirmpassword && (
        <Text style={signupStyles.errorText}>{errors.confirmpassword}</Text>
      )}

      {/* AGE */}
      <View style={signupStyles.ageRow}>
        <Text style={signupStyles.ageLabel}>Age</Text>
        <Picker
          selectedValue={age}
          onValueChange={(itemValue) => setAge(itemValue)}
          style={{ flex: 1, color: "#000" }}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Select Age" value="" />
          {ageOptions.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
      {errors.age && <Text style={signupStyles.errorText}>{errors.age}</Text>}

      {/* GENDER */}
      <View style={signupStyles.genderRow}>
        <Text style={signupStyles.genderLabel}>Gender</Text>
        <View style={signupStyles.genderOptionsWrapper}>
          {["Male", "Female", "Other"].map((option) => (
            <TouchableOpacity
              key={option}
              style={signupStyles.radioOption}
              onPress={() => setGender(option)}
            >
              <View
                style={[
                  signupStyles.radioCircle,
                  gender === option && signupStyles.selectedRadio,
                ]}
              />
              <Text style={signupStyles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {errors.gender && <Text style={signupStyles.errorText}>{errors.gender}</Text>}

      {/* EMAIL */}
      <TextInput
        style={[signupStyles.input, errors.emailid && signupStyles.inputError]}
        placeholder="Email ID"
        keyboardType="email-address"
        value={emailid}
        onChangeText={handleEmailChange}
      />
      {errors.emailid && <Text style={signupStyles.errorText}>{errors.emailid}</Text>}

      {/* MOBILE */}
      <TextInput
        style={[signupStyles.input, errors.mobilenumber && signupStyles.inputError]}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobilenumber}
        onChangeText={handleMobileChange}
        maxLength={10}
      />
      {errors.mobilenumber && (
        <Text style={signupStyles.errorText}>{errors.mobilenumber}</Text>
      )}

      {/* OTP Status or Send OTP Button */}
      {renderOTPStatus()}

      {!otpSent && !otpVerified && (
        <TouchableOpacity
          style={[
            signupStyles.button,
            { backgroundColor: "#4CAF50", marginBottom: 10 }
          ]}
          onPress={handleSendOtp}
          disabled={sendingOtp || !mobilenumber.trim()}
        >
          <Text style={signupStyles.buttonText}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </Text>
        </TouchableOpacity>
      )}

      {errors.otp && <Text style={signupStyles.errorText}>{errors.otp}</Text>}

      {/* SIGNUP BUTTON */}
      <TouchableOpacity
        style={[
          signupStyles.button,
          isSignupDisabled() && signupStyles.buttonDisabled,
        ]}
        onPress={handleSignup}
        disabled={isSignupDisabled()}
      >
        <Text style={signupStyles.buttonText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* Important Note */}
      <View style={signupStyles.noteContainer}>
        <Text style={signupStyles.noteTitle}>⚠️ Important:</Text>
        <Text style={signupStyles.noteText}>
          • Complete signup within 100 seconds after OTP verification{"\n"}
          • Use same OTP for signup{"\n"}
          • Session expires in 10 minutes{"\n"}
          • For testing: Use 9999999999 (auto-converts to 8142268525)
        </Text>
      </View>

      <Text style={signupStyles.demoInfo}>Server: {Config.API_BASE_URL}</Text>

      {/* OTP Modal */}
      {renderOTPModal()}
    </ScrollView>
  );
}