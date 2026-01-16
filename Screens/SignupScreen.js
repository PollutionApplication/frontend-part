import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import signupStyles from "../styles/SignupStyles";
import { postSignup } from "../Controller/SignupApi";
import { checkPasswordStrength, getStrengthColor } from "../Service/PasswordService";
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
  const [otpSent, setOtpSent] = useState(false); // To track if OTP was sent
  const [sendingOtp, setSendingOtp] = useState(false); // To show loading for OTP button

  // ✅ Helper functions
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
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // ✅ NEW FUNCTION: Handle Send OTP button click
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
    // Show loading
    setSendingOtp(true);
    // Simulate API call delay (2 seconds)
    setTimeout(() => {
      // In real app, you would call your OTP sending API here
      // For demo, we'll just show success
      Alert.alert(
        "OTP Sent",
        "OTP has been sent to your mobile number. Please check and enter it below.",
        [{ text: "OK" }]
      );

      // Mark OTP as sent and show OTP field
      setOtpSent(true);
      setSendingOtp(false);

      // For demo, auto-fill a dummy OTP (remove in production)
      setOtp("123456");
    }, 2000);
  };
  // ✅ Password strength check via backend
  const handlePasswordChange = async (text) => {
    setPassword(text);
    setCheckingStrength(true);

    try {
      console.log("Checking password strength via backend for:", text);

      // ✅ For Android Emulator, use 10.0.2.2 instead of your local IP
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

      //  Alert.alert("Password Check", result.message);
      setPasswordStrength(result);

    } catch (error) {
      console.error("Password strength check error:", error);
    } finally {
      setCheckingStrength(false);
    }
  };

  const handleEmailChange = (text) => {
    setEmailid(text);
    if (errors.emailid) setErrors({ ...errors, emailid: "" });
  };

  const handleMobileChange = (text) => {
    setMobilenumber(text);
    if (errors.mobilenumber) setErrors({ ...errors, mobilenumber: "" });
    // Reset OTP sent state if mobile number changes
    if (otpSent) {
      setOtpSent(false);
      setOtp("");
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
      // Check OTP only if it was sent
      (otpSent && !otp.trim()) ||
      password !== confirmpassword
    );
  };

  // ✅ Main signup handler
  const handleSignup = async () => {
    if (isLoading) return;

    let newErrors = {};

    // Simple form validation
    if (!name.trim()) newErrors.name = "Please enter name";
    if (!password) newErrors.password = "Please enter password";
    if (!confirmpassword) newErrors.confirmpassword = "Please enter confirm password";
    if (password && password !== confirmpassword)
      newErrors.confirmpassword = "Passwords do not match";
    if (!age) newErrors.age = "Please select age";
    if (!gender) newErrors.gender = "Please select gender";
    if (!emailid.trim()) newErrors.emailid = "Please enter email ID";
    if (!mobilenumber.trim()) newErrors.mobilenumber = "Please enter mobile number";
    // OTP validation - only check if OTP was sent
    if (otpSent && !otp.trim()) newErrors.otp = "Please enter OTP";
    if (!otpSent) newErrors.otp = "Please send OTP first";

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
      const result = await postSignup({
        name,
        password,
        confirmpassword,
        age,
        gender,
        emailid,
        mobilenumber,
        otp,
      });

      console.log("Backend response:", result);

      // Save to demo data
      demoUsers.push({
        name,
        emailid,
        mobilenumber,
        age,
        gender,
        signupDate: new Date().toISOString(),
      });

      Alert.alert("Success", "Signup successful!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);

      clearForm();

    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Signup failed. Please check your server.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ COMPONENT RENDER (keep inside the function)
  return (
    <ScrollView contentContainerStyle={signupStyles.container}>
      <Text style={signupStyles.title}>Sign Up</Text>

      <TextInput
        style={signupStyles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={signupStyles.errorText}>{errors.name}</Text>}

      {/* Password field */}
      <View style={signupStyles.passwordContainer}>
        <TextInput
          style={signupStyles.passwordInput}
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
          style={signupStyles.passwordInput}
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
      />
      {errors.mobilenumber && (
        <Text style={signupStyles.errorText}>{errors.mobilenumber}</Text>
      )}
      {/* NEW: SEND OTP BUTTON */}
      <TouchableOpacity
        style={[
          signupStyles.button,
          { backgroundColor: "#4CAF50", marginBottom: 10 }
        ]}
        onPress={handleSendOtp}
        disabled={sendingOtp}
      >
        <Text style={signupStyles.buttonText}>
          {sendingOtp ? "Sending OTP..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
      {/* OTP FIELD - Only show if OTP was sent */}
      {otpSent && (
        <View>
          <TextInput
            style={signupStyles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          {errors.otp && <Text style={signupStyles.errorText}>{errors.otp}</Text>}

          {/* Optional: Add a resend OTP button */}
          <TouchableOpacity
            onPress={() => {
              setOtp("");
              handleSendOtp();
            }}
            style={{ alignSelf: 'flex-end', padding: 5 }}
          >
            <Text style={{ color: "#2196F3", fontSize: 14 }}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* SIGNUP BUTTON */}
      <TouchableOpacity
        style={[
          signupStyles.button,
          isSignupDisabled() && signupStyles.buttonDisabled,
        ]}
        onPress={handleSignup}
      >
        <Text style={signupStyles.buttonText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text style={signupStyles.demoInfo}>Server: 10.0.2.2:1006 (Emulator)</Text>

    </ScrollView>
  );
}