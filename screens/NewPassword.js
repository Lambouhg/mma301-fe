import React, { useState } from "react";
import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { TextInput, Button, Text, Card, useTheme } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const NewPasswordScreen = ({ route, navigation }) => {
  const { resetPassword } = useAuth();
  const { email } = route.params;
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
    <ImageBackground
      source={{ uri: 'https://img.lovepik.com/background/20211029/medium/lovepik-canvas-shoe-wallpaper-background-image_400288297.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Card style={styles.card}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Đặt lại mật khẩu</Text>
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
      </Card>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
  },
  input: {
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    padding: 8,
    borderRadius: 8,
    elevation: 5,
    width: "100%",
  },
  button: {
    marginTop: 16,
    borderRadius: 25,
    paddingVertical: 8,
    backgroundColor: "#6200ea",
    shadowColor: "#6200ea",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
});

export default NewPasswordScreen;
