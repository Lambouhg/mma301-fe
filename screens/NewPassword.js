import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, Text } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const NewPasswordScreen = ({ route, navigation }) => {
  const { resetPassword } = useAuth();
  const { email } = route.params; // Nhận email từ params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const theme = useTheme();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp, vui lòng kiểm tra lại!");
      return;
    }

    try {
      const response = await resetPassword(email, newPassword);
      if (response.success) {
        Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công.");
        navigation.navigate("Đăng nhập");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={styles.subtitle}>Vui lòng nhập mật khẩu mới của bạn</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color={theme.colors.primary} />
        <TextInput
          label="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon name="lock" />}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color={theme.colors.primary} />
        <TextInput
          label="Xác nhận mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon name="lock" />}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
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
    backgroundColor: "#f7f8fc",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default NewPasswordScreen;
