import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const PaymentScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { orderDetails } = route.params;
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://mma301.onrender.com/users/profile",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        "Failed to fetch user information. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "momo") {
      Alert.alert(
        "Thanh toán MoMo",
        `Đang chuyển hướng đến ứng dụng MoMo để thanh toán ${orderDetails.totalPrice.toLocaleString('vi-VN')} VND cho đơn hàng #${orderDetails._id}`,
        [
          {
            text: "Tiếp tục",
            style: "default",
            onPress: async () => {
              try {
                const response = await axios.post(
                  "https://apply-momo-to-order.onrender.com/payment",
                  {
                    amount: orderDetails.totalPrice.toString(),
                    orderInfo: `Thanh toán đơn hàng #${orderDetails._id}`,
                  }
                );

                if (response.data?.payUrl) {
                  await Linking.openURL(response.data.payUrl);
                  setTimeout(() => {
                    Alert.alert(
                      "Thanh toán thành công ✓",
                      "Cảm ơn bạn đã sử dụng MoMo để thanh toán!",
                      [
                        {
                          text: "Về trang chủ",
                          style: "default",
                          onPress: () =>
                            navigation.reset({
                              index: 0,
                              routes: [{ name: "Main", params: { screen: "Home" } }],
                            }),
                        },
                      ]
                    );
                  }, 2000);
                } else {
                  Alert.alert("Lỗi", "Không thể tạo liên kết thanh toán");
                }
              } catch (error) {
                console.error("Payment error:", error);
                Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý thanh toán");
              }
            },
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]
      );
    } else if (paymentMethod === "cod") {
      Alert.alert(
        "Thanh toán khi nhận hàng",
        `Đơn hàng #${orderDetails._id} sẽ được thanh toán ${orderDetails.totalPrice.toLocaleString('vi-VN')} VND khi giao hàng.`,
        [
          {
            text: "Xác nhận",
            style: "default",
            onPress: () => {
              Alert.alert(
                "Đặt hàng thành công ✓",
                "Cảm ơn bạn đã đặt hàng. Vui lòng chuẩn bị tiền mặt khi nhận hàng.",
                [
                  {
                    text: "Về trang chủ",
                    style: "default",
                    onPress: () =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Main", params: { screen: "Home" } }],
                      }),
                  },
                ]
              );
            },
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {userInfo && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="location-outline" size={24} color="#007AFF" />
              <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.userName}>{userInfo.username}</Text>
              <Text style={styles.userInfo}>{userInfo.phoneNumber}</Text>
              <Text style={styles.userInfo}>{userInfo.email}</Text>
              <Text style={styles.address}>{userInfo.address}</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="cart-outline" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Chi tiết đơn hàng</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.orderId}>Đơn hàng #{orderDetails._id}</Text>
            <View style={styles.orderDetail}>
              <Text style={styles.orderLabel}>Số lượng sản phẩm</Text>
              <Text style={styles.orderValue}>{orderDetails.products.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderDetail}>
              <Text style={styles.totalLabel}>Tổng tiền</Text>
              <Text style={styles.totalValue}>
                {orderDetails.totalPrice.toLocaleString('vi-VN')} VND
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="wallet-outline" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          </View>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "momo" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("momo")}
            >
              <Image
                source={{
                  uri: "https://cdn2.fptshop.com.vn/unsafe/640x0/filters:quality(100)/2024_2_29_638448150533297863_tao-tai-khoan-momo.jpg",
                }}
                style={styles.paymentLogo}
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>MoMo</Text>
                <Text style={styles.paymentDesc}>Thanh toán qua ví MoMo</Text>
              </View>
              {paymentMethod === "momo" && (
                <Icon name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cod" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("cod")}
            >
              <View style={styles.codLogoContainer}>
                <Icon name="cash-outline" size={24} color="#4CAF50" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Tiền mặt</Text>
                <Text style={styles.paymentDesc}>Thanh toán khi nhận hàng</Text>
              </View>
              {paymentMethod === "cod" && (
                <Icon name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, !paymentMethod && styles.disabledButton]}
          onPress={handlePayment}
          disabled={!paymentMethod}
        >
          <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#1a1a1a",
  },
  cardContent: {
    paddingHorizontal: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  userInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  orderDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: "#666",
  },
  orderValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginBottom: 12,
  },
  selectedPaymentOption: {
    backgroundColor: "#e3f2fd",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  paymentLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  codLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 13,
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginVertical: 24,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});

export default PaymentScreen;