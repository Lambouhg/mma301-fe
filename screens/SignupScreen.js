import React, { useState } from "react"; 
import { View, StyleSheet, Alert, ImageBackground, ActivityIndicator } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password || !phoneNumber || !address) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (!/^\d{10,11}$/.test(phoneNumber)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      await signup(username, email, password, phoneNumber, address);
      Alert.alert("Đăng ký thành công!", "Hãy kiểm tra email của bạn để nhận mã xác thực tài khoản.");
      navigation.navigate("Xác thực tài khoản", { email, mode: "register" });
    } catch (error) {
      Alert.alert("Lỗi đăng ký!", error.message);
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
          <Card style={styles.card}>
            <TextInput
              label="Tên người dùng"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
            <TextInput
              label="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />
            <TextInput
              label="Số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              keyboardType="phone-pad"
            />
            <TextInput
              label="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="home" />}
            />
          </Card>

          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            labelStyle={styles.buttonText}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Đăng ký"}
          </Button>
          
          <Text
            style={styles.footerText}
            onPress={() => navigation.navigate("Đăng nhập")}
          >
            Bạn đã có tài khoản? Đăng nhập
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
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
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
    marginBottom: 8,
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

export default SignupScreen;
