import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditPasswordScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateNewPassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!validateNewPassword(newPassword)) {
      Alert.alert(
        "Lỗi",
        "Mật khẩu mới ít nhất phải 6 ký tự, không chứa ký tự đặc biệt"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "https://mma301.onrender.com/users/editPass",
        { password: currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Alert.alert("Thành công.", "Đổi mật khẩu thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert(
        "Lỗi",
        "Cập nhật mật khẩu không thành công, vui lòng thử lại. "
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <Button
          mode="contained"
          onPress={handleChangePassword}
          style={styles.button}
        >
          Đổi mật khẩu
        </Button>
      )}
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

export default EditPasswordScreen;
