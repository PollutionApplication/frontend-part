import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import signupStyles from "../styles/SignupStyles";
import { postSignup } from "../Controller/SignupApi";

// TEMPORARY DEMO STORAGE
// =========================
// This is a simple in-memory storage for demonstration purposes.
// In a production app, replace this with AsyncStorage, SQLite, or backend database.
let demoUsers = [];

// SIGNUP SCREEN COMPONENT
// ==========================
/**
 * Main Signup Screen Component
 * 
 * Features:
 * - User registration form with validation
 * - Password visibility toggle
 * - Duplicate account prevention
 * - Network error handling
 * - Real device compatibility
 * 
 * Backend Integration:
 * - Connects to Spring Boot backend at 192.168.1.4:1006
 * - Handles both success and error responses
 * - Fallback to demo storage when backend unavailable
 */
export default function SignupScreen({ navigation }) {
  // STATE VARIABLES
  
  // Form field states
  const [name, setName] = useState("");                    // User's full name
  const [password, setPassword] = useState("");            // Password field
  const [confirmpassword, setConfirmpassword] = useState(""); // Password confirmation
  const [age, setAge] = useState("");                      // Selected age range
  const [gender, setGender] = useState("");                // Selected gender
  const [emailid, setEmailid] = useState("");              // Email address
  const [mobilenumber, setMobilenumber] = useState("");    // Mobile number
  const [otp, setOtp] = useState("");                      // OTP verification code
  
  // UI and validation states
  const [errors, setErrors] = useState({});                // Stores validation error messages
  const [isLoading, setIsLoading] = useState(false);       // Loading state during API calls
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);           // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  
  // CONSTANTS AND CONFIGURATION
  
  /**
   * Age range options for the dropdown picker
   * Format: "min-max" or "min+" for open-ended ranges
   */
  const ageOptions = [
    "5-10", "11-20", "21-30", "31-40", 
    "41-50", "51-60", "61-70", "71+"
  ];

  // HELPER FUNCTIONS
  
  /**
   * Checks if a user with the given email or mobile number already exists
   * @param {string} email - Email to check
   * @param {string} mobile - Mobile number to check
   * @returns {boolean} True if user exists, false otherwise
   */
  const checkIfUserExists = (email, mobile) => {
    return demoUsers.some(user => 
      user.emailid === email || user.mobilenumber === mobile
    );
  };

  /**
   * Clears all form fields and error messages
   * Called after successful signup
   */
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
  };

  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  /**
   * Handles email input changes and clears email-related errors
   * @param {string} text - New email value
   */
  const handleEmailChange = (text) => {
    setEmailid(text);
    if (errors.emailid) setErrors({ ...errors, emailid: "" });
  };

  /**
   * Handles mobile number input changes and clears mobile-related errors
   * @param {string} text - New mobile number value
   */
  const handleMobileChange = (text) => {
    setMobilenumber(text);
    if (errors.mobilenumber) setErrors({ ...errors, mobilenumber: "" });
  };

  /**
   * Determines if the signup button should be disabled
   * @returns {boolean} True if button should be disabled, false otherwise
   */
  const isSignupDisabled = () => {
    return isLoading ||                    // Disable during API calls
           !name.trim() ||                 // Name is required
           !password ||                    // Password is required
           !confirmpassword ||             // Confirm password is required
           !age ||                         // Age selection is required
           !gender ||                      // Gender selection is required
           !emailid.trim() ||              // Email is required
           !mobilenumber.trim() ||         // Mobile number is required
           !otp.trim() ||                  // OTP is required
           password !== confirmpassword;   // Passwords must match
  };

  // MAIN SIGNUP HANDLER
  
  /**
   * Handles the signup process when the user submits the form
   * Steps:
   * 1. Form validation
   * 2. Duplicate check in demo storage
   * 3. API call to backend
   * 4. Success/error handling
   */
  const handleSignup = async () => {
    // Prevent multiple simultaneous signup attempts
    if (isLoading) return;

    // STEP 1: FORM VALIDATION
    let newErrors = {};

    // Validate each required field
    if (!name.trim()) newErrors.name = "Please enter name";
    if (!password) newErrors.password = "Please enter password";
    if (password && password !== confirmpassword) 
      newErrors.confirmpassword = "Passwords do not match";
    if (!age) newErrors.age = "Please select age";
    if (!gender) newErrors.gender = "Please select gender";
    if (!emailid.trim()) newErrors.emailid = "Please enter email ID";
    if (!mobilenumber.trim()) newErrors.mobilenumber = "Please enter mobile number";
    if (!otp.trim()) newErrors.otp = "Please enter OTP";

    // If validation errors exist, display them and stop processing
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // STEP 2: DUPLICATE ACCOUNT CHECK (DEMO STORAGE)
    if (checkIfUserExists(emailid, mobilenumber)) {
      Alert.alert(
        "Account Already Exists", 
        "This email or mobile number is already registered!",
        [{ text: "OK" }]
      );
      setErrors({ 
        emailid: "Email already registered",
        mobilenumber: "Mobile number already registered"
      });
      return;
    }

    // STEP 3: API CALL TO BACKEND
    setIsLoading(true); // Show loading state

    try {
      // Send signup data to Spring Boot backend
      const result = await postSignup({
        name,
        password,
        confirmpassword,
        age,
        gender,
        emailid,
        mobilenumber,
        otp
      });

      console.log("Backend response:", result);
      
      // STEP 4: SUCCESS HANDLING
      
      // Save user to demo storage (fallback for demo purposes)
      const newUser = {
        name,
        emailid,
        mobilenumber,
        age,
        gender,
        signupDate: new Date().toISOString()
      };
      demoUsers.push(newUser);
      console.log("Saved to demo storage. Total users:", demoUsers.length);
      
      // Show success message and navigate to home screen
      Alert.alert(
        "Success", 
        "Signup successful! User saved to database.",
        [{ text: "OK", onPress: () => navigation.navigate("Home") }]
      );

      // Clear the form for next registration
      clearForm();

    } catch (error) {
      // ERROR HANDLING
      console.error("Signup error:", error);
      
      // Handle duplicate entry error from backend
      if (error.message === 'DUPLICATE_ENTRY') {
        Alert.alert(
          "Account Exists", 
          "This email or mobile number is already registered in our system!",
          [{ text: "OK" }]
        );
        setErrors({ 
          emailid: "Already registered in system",
          mobilenumber: "Already registered in system" 
        });
      } 
      // Handle network connectivity issues
      else if (error.message === 'NETWORK_ERROR') {
        Alert.alert(
          "Network Issue", 
          `Cannot connect to server. Please check:
1. Your MacBook is on same WiFi
2. Spring Boot is running on port 1006
3. Firewall is not blocking the connection`,
          [{ text: "OK" }]
        );
      } 
      // Handle all other errors
      else {
        Alert.alert("Error", "Signup failed. Please try again.");
      }
    } finally {
      // Always reset loading state, regardless of success or failure
      setIsLoading(false);
    }
  };

  // COMPONENT RENDER
  return (
    <ScrollView contentContainerStyle={signupStyles.container}>
      {/* Page Title */}
      <Text style={signupStyles.title}>Sign Up</Text>

      {/* NAME FIELD */}
      <TextInput
        style={signupStyles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={signupStyles.errorText}>{errors.name}</Text>}

      {/* PASSWORD FIELD WITH VISIBILITY TOGGLE */}
      <View style={signupStyles.passwordContainer}>
        <TextInput
          style={signupStyles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword} // Toggle between hidden/showing
          value={password}
          onChangeText={setPassword}
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
      {errors.password && <Text style={signupStyles.errorText}>{errors.password}</Text>}

      {/* CONFIRM PASSWORD FIELD WITH VISIBILITY TOGGLE */}
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
      {errors.confirmpassword && <Text style={signupStyles.errorText}>{errors.confirmpassword}</Text>}

      {/* AGE SELECTION DROPDOWN */}
      <View style={signupStyles.ageRow}>
        <Text style={signupStyles.ageLabel}>Age</Text>
        <Picker
          selectedValue={age}
          onValueChange={(itemValue) => setAge(itemValue)}
          style={{ flex: 1, color: '#000', textAlign: 'center' }}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Select Age" value="" />
          {ageOptions.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
      {errors.age && <Text style={signupStyles.errorText}>{errors.age}</Text>}

      {/* GENDER SELECTION RADIO BUTTONS */}
      <View style={signupStyles.genderRow}>
        <Text style={signupStyles.genderLabel}>Gender</Text>
        <View style={signupStyles.genderOptionsWrapper}>
          {["Male", "Female", "Other"].map((option) => (
            <TouchableOpacity
              key={option}
              style={signupStyles.radioOption}
              onPress={() => setGender(option)}
            >
              <View style={[
                signupStyles.radioCircle,
                gender === option && signupStyles.selectedRadio
              ]} />
              <Text style={signupStyles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {errors.gender && <Text style={signupStyles.errorText}>{errors.gender}</Text>}

      {/* EMAIL FIELD */}
      <TextInput
        style={[signupStyles.input, errors.emailid && signupStyles.inputError]}
        placeholder="Email ID"
        keyboardType="email-address"
        value={emailid}
        onChangeText={handleEmailChange}
      />
      {errors.emailid && <Text style={signupStyles.errorText}>{errors.emailid}</Text>}

      {/* MOBILE NUMBER FIELD */}
      <TextInput
        style={[signupStyles.input, errors.mobilenumber && signupStyles.inputError]}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobilenumber}
        onChangeText={handleMobileChange}
      />
      {errors.mobilenumber && <Text style={signupStyles.errorText}>{errors.mobilenumber}</Text>}

      {/* OTP FIELD */}
      <TextInput
        style={signupStyles.input}
        placeholder="OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      {errors.otp && <Text style={signupStyles.errorText}>{errors.otp}</Text>}

      {/* SIGNUP BUTTON */}
      <TouchableOpacity 
        style={[
          signupStyles.button, 
          isSignupDisabled() && signupStyles.buttonDisabled
        ]} 
        onPress={handleSignup}
        disabled={isSignupDisabled()}
      >
        <Text style={signupStyles.buttonText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* SERVER INFORMATION (FOR DEBUGGING) */}
      <Text style={signupStyles.demoInfo}>
        Server: 192.168.1.4:1006 (Your MacBook)
      </Text>
    </ScrollView>
  );
}