import React, { useState } from "react";
import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
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
    <ImageBackground
      source={{
        uri: "https://img.lovepik.com/background/20211029/medium/lovepik-canvas-shoe-wallpaper-background-image_400288297.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.container}>
    <View style={styles.innerContainer}>
    <Card style={styles.card}>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Nhập email để lấy mã xác thực</Text>
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
  card: {
    padding: 8,
    borderRadius: 8,
    elevation: 5,
    width: "100%",
  },
  input: {
    marginBottom: 5,
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
});

export default ForgetPassword;
