import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Surface, Avatar, useTheme, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditProfileScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { profileData } = route.params;
  const theme = useTheme();
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateField = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case 'username':
        if (!value || value.trim().length === 0) {
          newErrors.username = "Tên người dùng không được để trống";
        } else {
          delete newErrors.username;
        }
        break;
      case 'phoneNumber':
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!value || value.trim().length === 0) {
          newErrors.phoneNumber = "Số điện thoại không được để trống";
        } else if (!phoneRegex.test(value)) {
          newErrors.phoneNumber = "Số điện thoại không hợp lệ";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      case 'address':
        if (!value || value.trim().length === 0) {
          newErrors.address = "Địa chỉ không được để trống";
        } else {
          delete newErrors.address;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleUpdate = async () => {
    // Validate all fields
    Object.keys(editedData).forEach(field => {
      validateField(field, editedData[field]);
    });

    if (Object.keys(errors).length > 0) {
      let errorMessage = Object.values(errors).join("\n");
      Alert.alert("Lỗi xác thực", errorMessage);
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
      
      Alert.alert(
        "Thành công",
        "Hồ sơ của bạn đã được cập nhật thành công",
        [{ text: "OK", onPress: () => navigation.navigate("Tôi", { updated: true }) }]
      );
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật hồ sơ. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <Surface style={styles.loadingCard}>
        <MaterialCommunityIcons name="loading" size={40} color={theme.colors.primary} />
        <Text style={styles.loadingText}>Đang cập nhật...</Text>
      </Surface>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Surface style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          color="#fff"
        />
        <Text style={styles.headerText}>Chỉnh sửa hồ sơ</Text>
      </Surface>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={{ uri: "https://ui-avatars.com/api/?name=" + editedData.username }}
          />
          <IconButton
            icon="camera"
            size={20}
            style={styles.editAvatarButton}
            onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
          />
        </View>

        <Surface style={styles.formContainer}>
          <TextInput
            label="Tên người dùng"
            value={editedData.username}
            onChangeText={(text) => {
              setEditedData({ ...editedData, username: text });
              validateField('username', text);
            }}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            error={errors.username}
            helperText={errors.username}
          />

          <TextInput
            label="Email"
            value={editedData.email}
            style={styles.input}
            mode="outlined"
            disabled
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Số điện thoại"
            value={editedData.phoneNumber}
            onChangeText={(text) => {
              setEditedData({ ...editedData, phoneNumber: text });
              validateField('phoneNumber', text);
            }}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="phone" />}
            error={errors.phoneNumber}
            helperText={errors.phoneNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Địa chỉ"
            value={editedData.address}
            onChangeText={(text) => {
              setEditedData({ ...editedData, address: text });
              validateField('address', text);
            }}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker" />}
            error={errors.address}
            helperText={errors.address}
            multiline
          />
        </Surface>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUpdate}
            style={styles.updateButton}
            loading={loading}
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
          >
            Hủy bỏ
          </Button>
        </View>
      </ScrollView>

      {loading && renderLoadingOverlay()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    elevation: 4,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 16,
  },
  updateButton: {
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default EditProfileScreen;