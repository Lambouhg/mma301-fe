// src/components/SignupForm.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";

const SignupForm = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post("https://project-sdn-be.onrender.com/users/signup", {
        username,
        email,
        password,
      });
      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Xác thực tài khoản", { email });
    } catch (error) {
      Alert.alert("Signup Failed", error.response.data.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupForm;
