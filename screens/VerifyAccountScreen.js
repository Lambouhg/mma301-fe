import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const VerifyAccountScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const { verifyCode } = useAuth();
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      const response = await verifyCode(email, code);
      if (response.success) {
        Alert.alert(
          "Xác thực thành công",
          "Tài khoản của bạn đã được xác thực, hãy đăng nhập và mua hàng!"
        );
        navigation.navigate("Đăng nhập");
      } else {
        throw new Error(
          "Mã xác thực không hợp lệ. Vui lòng nhập lại!",
          response.success
        );
      }
    } catch (error) {
      Alert.alert("Lỗi xác thực", "Mã xác thực không đúng, vui lòng nhập lại!");
    }
  };

  return (
    <View style={styles.container}>
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
});

export default VerifyAccountScreen;
