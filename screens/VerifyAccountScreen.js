import React, { useState } from "react";
import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const VerifyAccountScreen = ({ route, navigation }) => {
  const { email, mode } = route.params;
  const { verifyCode } = useAuth();
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    console.log("Mode:", mode); // Kiểm tra giá trị của mode
    try {
      const response = await verifyCode(email, code);
      if (response.success) {
        if (mode === "register") {
          Alert.alert(
            "Xác thực thành công",
            "Tài khoản của bạn đã được xác thực, hãy đăng nhập và mua hàng!"
          );
          navigation.navigate("Đăng nhập");
        } else if (mode === "forgotPassword") {
          navigation.navigate("Nhập mật khẩu mới", { email });
        }
      } else {
        throw new Error("Mã xác thực không hợp lệ. Vui lòng nhập lại!");
      }
    } catch (error) {
      Alert.alert("Lỗi xác thực", "Mã xác thực không đúng, vui lòng nhập lại!");
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
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Xác thực tài khoản</Text>
            <TextInput
              label="Nhập mã để xác thực tài khoản"
              value={code}
              onChangeText={setCode}
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleVerify} style={styles.button}>
            Xác thực
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
    marginTop: 5,
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
});

export default VerifyAccountScreen;
