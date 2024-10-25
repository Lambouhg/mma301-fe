import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Text, Appbar, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const SignupScreen = ({ navigation }) => {
  const { signup, verifyCode } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      console.log("Signup Data:", { username, email, password });
      const response = await signup(username, email, password);
      Alert.alert(
        "Đăng ký thành công!",
        "Hãy kiểm tra email của bạn để nhận mã xác thực tài khoản."
      );
      navigation.navigate("Xác thực tài khoản", { email, mode: "register" });
    } catch (error) {
      Alert.alert("Lỗi đăng ký!", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Card style={styles.card}>
          <TextInput
            label="Tên người dùng"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
          />
        </Card>

        <Button mode="contained" onPress={handleSignup} style={styles.button}>
          Đăng ký
        </Button>
        <Text
          style={styles.footerText}
          onPress={() => navigation.navigate("Đăng nhập")}
        >
          Bạn đã có tài khoản? Đăng nhập
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  card: {
    padding: 8,
    borderRadius: 8,
    elevation: 5,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
  },
  footerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#007BFF",
  },
});

export default SignupScreen;
