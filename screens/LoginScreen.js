import React, { useState } from "react";
import { View, StyleSheet, Alert, ImageBackground, ActivityIndicator } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Lỗi đăng nhập", error.message);
    } finally {
      setLoading(false);
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
        <Text style={styles.subtitle}>Chào mừng bạn trở lại!!</Text>
          <Card style={styles.card}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              onSubmitEditing={() => passwordInput.focus()}
            />
            <TextInput
              ref={(input) => {
                passwordInput = input;
              }}
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              onSubmitEditing={handleLogin}
            />
            <Text
              style={styles.forgetPasswordText}
              onPress={() => navigation.navigate("Quên mật khẩu")}
            >
              Quên mật khẩu?
            </Text>
          </Card>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            labelStyle={styles.buttonText}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Đăng nhập"}
          </Button>
          
          <Text
            style={styles.footerText}
            onPress={() => navigation.navigate("Đăng ký")}
          >
            Bạn chưa có tài khoản? Đăng ký
          </Text>
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
  container: {
    padding: 15,
    marginHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6200ea",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 8,
    borderRadius: 8,
    elevation: 5,
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  forgetPasswordText: {
    color: "#6200ea",
    alignSelf: "flex-end",
    marginBottom: 15,
    fontSize: 14,
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
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#6200ea",
  },
});

export default LoginScreen;
