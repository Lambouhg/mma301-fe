import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import { Text, ActivityIndicator, Button, Avatar } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user, route.params?.updated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://project-sdn-be.onrender.com/users/profile",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setProfileData(response.data);
    } catch (error) {
      Alert.alert("Thành ông", "Đăng xuất thành công");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          logout();
          navigation.navigate("Đăng nhập");
        },
        style: "destructive",
      },
    ]);
  };

  const ProfileItem = ({ icon, label, value }) => (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={styles.profileItem}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.profileItemContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không thể tải thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1557683316-973673baf926",
        }}
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay} />
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={styles.headerContent}
        >
          <Avatar.Text
            size={80}
            label={profileData.username.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.email}>{profileData.email}</Text>
        </Animated.View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <ProfileItem
          icon="phone"
          label="Số điện thoại"
          value={profileData.phoneNumber}
        />
        <ProfileItem icon="home" label="Địa chỉ" value={profileData.address} />
        <ProfileItem
          icon="calendar-today"
          label="Ngày tạo"
          value={new Date(profileData.createdAt).toLocaleDateString()}
        />

        <Animated.View
          entering={FadeInDown.delay(400)}
          style={styles.buttonGroup}
        >
          <Pressable
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("Chỉnh sửa hồ sơ", { profileData })
            }
          >
            <Icon name="edit" size={24} color="#007AFF" />
            <Text style={styles.buttonText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>

          <Pressable
            style={styles.passwordButton}
            onPress={() => navigation.navigate("Đổi mật khẩu")}
          >
            <Icon name="lock" size={24} color="#007AFF" />
            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#FF3B30" />
            <Text style={[styles.buttonText, { color: "#FF3B30" }]}>
              Đăng xuất
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerBackground: {
    height: 200,
    width: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerContent: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    backgroundColor: "#007AFF",
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,122,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#212529",
    fontWeight: "500",
  },
  buttonGroup: {
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
});

export default ProfileScreen;
