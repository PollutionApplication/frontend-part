import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import signinStyles from "../styles/SigninStyles";
import { handleSignin } from "../Controller/SigninController";


export default function SigninScreen({ navigation }) {
  // STATE VARIABLES - REMOVE mobilenumber for signin
  const [password, setPassword] = useState("");
  const [emailid, setEmailid] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear form function
  const clearForm = () => {
    setPassword("");
    setEmailid("");
    setErrors({});
  };

  // Toggle password visibility
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // Input change handlers
  const handleEmailChange = (text) => {
    setEmailid(text);
    if (errors.emailid) setErrors({ ...errors, emailid: "" });
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  // Check if signin button should be disabled
  const isSigninDisabled = () => {
    return isLoading || !password || !emailid.trim();
  };

  // MAIN SIGNIN HANDLER - UPDATED
  const handleSigninPress = async () => {
    if (isLoading) return;

    // Clear previous errors
    setErrors({});

    // Basic frontend validation
    let newErrors = {};

    if (!emailid.trim()) {
      newErrors.emailid = "Please enter email ID";
    }

    if (!password) {
      newErrors.password = "Please enter password";
    }

    // If validation errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call controller - only email and password for signin
      const result = await handleSignin({
        password,
        emailid
      });

      console.log("Signin successful:", result);

      // Success handling
      Alert.alert(
        "Success",
        "Login successful!",
        [{
          text: "OK", onPress: () => {
            clearForm();
            navigation.navigate("Home");
          }
        }]
      );

    } catch (error) {
      console.error("Signin error:", error);

      // Handle different error types
      let errorMessage = "Login failed. Please try again.";

      switch (error.message) {
        case 'INVALID_CREDENTIALS':
          errorMessage = "Invalid email or password.";
          setErrors({
            emailid: "Invalid credentials",
            password: "Invalid credentials"
          });
          break;
        case 'USER_NOT_FOUND':
          errorMessage = "No account found with this email.";
          setErrors({ emailid: "Account not found" });
          break;
        case 'NETWORK_ERROR':
          errorMessage = "Network error. Please check your connection and server.";
          break;
        case 'EMAIL_PASSWORD_REQUIRED':
          errorMessage = "Email and password are required.";
          break;
        case 'INVALID_EMAIL':
          errorMessage = "Please enter a valid email address.";
          setErrors({ emailid: "Invalid email format" });
          break;
        default:
          errorMessage = error.message || "Login failed. Please try again.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={signinStyles.container}>
      {/* Page Title */}
      <Text style={signinStyles.title}>Sign In</Text>

      {/* EMAIL FIELD */}
      <TextInput
        style={[signinStyles.input, errors.emailid && signinStyles.inputError]}
        placeholder="Email, Username, or Mobile"
        keyboardType="email-address"
        autoCapitalize="none"
        value={emailid}
        onChangeText={handleEmailChange}
        placeholderTextColor="#666"
      />
      {errors.emailid && <Text style={signinStyles.errorText}>{errors.emailid}</Text>}

      {/* PASSWORD FIELD */}
      <View style={signinStyles.passwordContainer}>
        <TextInput
          style={signinStyles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={signinStyles.eyeButton}
          onPress={toggleShowPassword}
        >
          <Text style={signinStyles.eyeText}>
            {showPassword ? "HIDE" : "SHOW"}
          </Text>
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={signinStyles.errorText}>{errors.password}</Text>}

      {/* SIGNIN BUTTON */}
      <TouchableOpacity
        style={[
          signinStyles.button,
          isSigninDisabled() && signinStyles.buttonDisabled
        ]}
        onPress={handleSigninPress}
        disabled={isSigninDisabled()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={signinStyles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* SIGNUP LINK */}
      <TouchableOpacity
        style={signinStyles.linkButton}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={signinStyles.linkText}>
          Don't have an account? <Text style={signinStyles.linkBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      {/* SERVER INFORMATION */}
      <Text style={signinStyles.demoInfo}>
        Server: 192.168.1.5:1006
      </Text>
    </ScrollView>
  );
}