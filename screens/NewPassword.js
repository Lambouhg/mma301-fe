import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const NewPasswordScreen = ({ route, navigation }) => {
  const { resetPassword } = useAuth();
  const { email } = route.params; // Nhận email từ params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp, vui lòng kiểm tra lại!");
      return;
    }

    try {
      const response = await resetPassword(email, newPassword);
      if (response.success) {
        Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công.");
        navigation.navigate("Đăng nhập"); // Điều hướng tới màn hình đăng nhập
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message); // Hiển thị lỗi từ backend
    }
  };

  return (
    <View style={styles.container}>
    <Image source={require("../assets/logo.png")} style={styles.logo} />
      <TextInput
        label="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
        Đặt lại mật khẩu
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
    marginBottom: 10,
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

export default NewPasswordScreen;
