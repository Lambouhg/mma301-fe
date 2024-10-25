import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios"; // Nhớ cài đặt axios nếu bạn chưa có

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSendCode = async () => {
    try {
      const response = await axios.post(
        "https://mma301.onrender.com/users/forgot-password",
        { email } // Gửi email đến backend
      );
      Alert.alert("Thành công", response.data.message);
      navigation.navigate("Xác thực tài khoản", { email, mode: "forgotPassword" }); // Điều hướng tới màn xác thực
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra khi gửi mã xác thực. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
    <Image source={require("../assets/logo.png")} style={styles.logo} />
      <TextInput
        label="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSendCode} style={styles.button}>
        Gửi mã xác thực
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default ForgetPassword;
