import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from "react-native";
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (profileData) {
      setEditedData({
        username: profileData.username || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
      });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [profileData]);

  const validateField = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case 'username':
        if (!value || value.trim().length === 0) {
          newErrors.username = "Tên người dùng không được để trống";
        } else if (value.trim().length < 3) {
          newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
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
        } else if (value.trim().length < 10) {
          newErrors.address = "Vui lòng nhập địa chỉ chi tiết hơn";
        } else {
          delete newErrors.address;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleUpdate = async () => {
    Object.keys(editedData).forEach(field => {
      validateField(field, editedData[field]);
    });

    if (Object.keys(errors).length > 0) {
      Alert.alert(
        "Thông tin chưa hợp lệ",
        Object.values(errors).join("\n"),
        [{ text: "Đã hiểu", style: "default" }]
      );
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
        "Thành công ✓",
        "Thông tin của bạn đã được cập nhật",
        [{ 
          text: "OK",
          onPress: () => navigation.navigate("Tôi", { updated: true }),
          style: "default"
        }]
      );
    } catch (error) {
      Alert.alert(
        "Không thể cập nhật",
        "Vui lòng kiểm tra kết nối và thử lại",
        [{ text: "Đã hiểu", style: "default" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label,
    value,
    field,
    icon,
    options = {}
  ) => (
    <Surface style={styles.inputContainer} elevation={1}>
      <TextInput
        label={label}
        value={value}
        onChangeText={(text) => {
          setEditedData({ ...editedData, [field]: text });
          validateField(field, text);
        }}
        mode="flat"
        style={[styles.input, errors[field] && styles.inputError]}
        error={errors[field]}
        left={<TextInput.Icon icon={icon} color="#000" />}
        disabled={options.disabled}
        multiline={options.multiline}
        keyboardType={options.keyboardType}
      />
      {errors[field] && (
        <Text style={styles.errorText}>
          {errors[field]}
        </Text>
      )}
    </Surface>
  );
  
  // Sửa lại phần renderLoadingOverlay
  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <Surface style={styles.loadingCard}>
        <MaterialCommunityIcons 
          name="loading" 
          size={40} 
          color="#6200ee"
        />
        <Text style={styles.loadingText}>Đang cập nhật...</Text>
      </Surface>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <Surface style={styles.avatarSurface} elevation={4}>
              <Avatar.Image
                size={120}
                source={{ uri: `https://ui-avatars.com/api/?name=${editedData.username}&background=random&size=200` }}
              />
              <IconButton
                icon="camera"
                size={24}
                style={styles.editAvatarButton}
                color="#fff"
                onPress={() => Alert.alert(
                  "Thông báo",
                  "Tính năng đang phát triển",
                  [{ text: "Đã hiểu" }]
                )}
              />
            </Surface>
            <Text style={styles.avatarHint}>Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện</Text>
          </View>

          <Surface style={styles.formContainer} elevation={2}>
            {renderInputField("Tên người dùng", editedData.username, "username", "account")}
            {renderInputField("Email", editedData.email, "email", "email", { disabled: true })}
            {renderInputField("Số điện thoại", editedData.phoneNumber, "phoneNumber", "phone", { keyboardType: "phone-pad" })}
            {renderInputField("Địa chỉ", editedData.address, "address", "map-marker", { multiline: true })}
          </Surface>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleUpdate}
              style={styles.updateButton}
              contentStyle={styles.buttonContent}
              loading={loading}
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              contentStyle={styles.buttonContent}
              disabled={loading}
            >
              Hủy thay đổi
            </Button>
          </View>
        </Animated.View>
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

  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarSurface: {
    borderRadius: 60,
    padding: 4,
    backgroundColor: '#fff',
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 4,
  },
  avatarHint: {
    marginTop: 16,
    color: '#666',
    fontSize: 12,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#B00020', // Material Design error color
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  buttonContainer: {
    padding: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  updateButton: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#6200ee',
  },
  cancelButton: {
    borderRadius: 8,
    borderColor: '#6200ee',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default EditProfileScreen;