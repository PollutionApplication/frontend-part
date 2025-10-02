// Service/signupService.js - Plain JavaScript version
import { postSignup } from "../Controller/SignupApi";

export const signupUser = async ({
  name,
  password,
  confirmpassword,
  age,
  gender,
  emailid,
  mobilenumber,
  otp
}) => {

  if (!name || !password || !confirmpassword) {
    throw new Error("Name and password are required");
  }

  const requestData = {
    username: name,
    password,
    confirmpassword,
    age: age,
    gender,
    emailid,
    mobilenumber,
    mobilenumbersignupverificationotp: otp
  };

  return await postSignup(requestData);
};