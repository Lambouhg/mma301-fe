import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Text, ActivityIndicator, IconButton, Surface } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const EditPasswordScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateNewPassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.", [{ text: "Đã hiểu" }]);
      return;
    }

    if (!validateNewPassword(newPassword)) {
      Alert.alert(
        "Thông báo",
        "Mật khẩu mới cần:\n• Ít nhất 6 ký tự\n• Không chứa ký tự đặc biệt",
        [{ text: "Đã hiểu" }]
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu mới và mật khẩu xác nhận không khớp", [
        { text: "Đã hiểu" },
      ]);
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
      Alert.alert("Thành công", "Đổi mật khẩu thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Thông báo", "Cập nhật mật khẩu không thành công, vui lòng thử lại.", [
        { text: "Đã hiểu" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    label,
    value,
    onChangeText,
    showPassword,
    setShowPassword,
    icon
  ) => (
    <Surface style={styles.inputContainer} elevation={1}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="flat"
        theme={{
          colors: {
            primary: '#6200ee',
            underlineColor: 'transparent',
          },
        }}
        left={<TextInput.Icon icon={icon} />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
    </Surface>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.card} elevation={2}>
          <Text style={styles.title}>Đổi mật khẩu</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
          </Text>

          {renderPasswordInput(
            "Mật khẩu hiện tại",
            currentPassword,
            setCurrentPassword,
            showCurrentPassword,
            setShowCurrentPassword,
            "lock"
          )}

          {renderPasswordInput(
            "Mật khẩu mới",
            newPassword,
            setNewPassword,
            showNewPassword,
            setShowNewPassword,
            "lock-plus"
          )}

          {renderPasswordInput(
            "Xác nhận mật khẩu mới",
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            setShowConfirmPassword,
            "lock-check"
          )}

          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  input: {
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },
});

export default EditPasswordScreen;