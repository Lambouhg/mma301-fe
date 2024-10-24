import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditProfileScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { profileData } = route.params;
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData) {
      setEditedData({
        username: profileData.username || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
      });
    }
  }, [profileData]);

  const handleUpdate = async () => {
    let errors = {};

    // Validate Username
    if (!editedData.username || editedData.username.trim().length === 0) {
      errors.username = "Tên người dùng không hợp lệ";
    }

    // Validate Phone Number
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!editedData.phoneNumber || editedData.phoneNumber.trim().length === 0) {
      errors.phoneNumber = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(editedData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    // Validate Address
    if (!editedData.address || editedData.address.trim().length === 0) {
      errors.address = "Địa chỉ không được để trống";
    }

    // Nếu có lỗi thì hiển thị alert và return
    if (Object.keys(errors).length > 0) {
      let errorMessage = Object.values(errors).join("\n");
      Alert.alert("Validation Error", errorMessage);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "https://mma301.onrender.com/users/profile",
        editedData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Alert.alert("Thành công", "Hồ sơ đã được cập nhật.");

      // Điều hướng trở về ProfileScreen và refresh dữ liệu
      navigation.navigate("Tôi", { updated: true });
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật hồ sơ không thành công.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Tên người dùng"
        value={editedData.username}
        onChangeText={(text) =>
          setEditedData({ ...editedData, username: text })
        }
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={editedData.email}
        onChangeText={(text) => setEditedData({ ...editedData, email: text })}
        style={styles.input}
        disabled
      />
      <TextInput
        label="Số điện thoại"
        value={editedData.phoneNumber}
        onChangeText={(text) =>
          setEditedData({ ...editedData, phoneNumber: text })
        }
        style={styles.input}
      />
      <TextInput
        label="Địa chỉ"
        value={editedData.address}
        onChangeText={(text) => setEditedData({ ...editedData, address: text })}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleUpdate}
        style={styles.updateButton}
      >
        Cập nhật hồ sơ
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
      >
        Hủy bỏ
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#2196f3",
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default EditProfileScreen;
