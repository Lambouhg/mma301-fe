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
        `Đang chuyển hướng đến ứng dụng MoMo để thanh toán ${orderDetails.totalPrice.toFixed(
          2
        )} VND cho đơn hàng #${orderDetails._id}`,
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                // Send the payment request to your backend
                const response = await axios.post(
                  "https://apply-momo-to-order.onrender.com/payment", //
                  {
                    amount: orderDetails.totalPrice.toString(), // Send total as a string
                    orderInfo: `Thanh toán đơn hàng #${orderDetails._id}`, // Order info
                  }
                );

                // Check if the response contains the payUrl
                if (response.data && response.data.payUrl) {
                  const orderId = new Date().getTime().toString(); // Generate unique orderId

                  // Redirect the user to the payment URL (MoMo page)
                  await Linking.openURL(response.data.payUrl);

                  // Simulate successful payment
                  setTimeout(() => {
                    Alert.alert(
                      "Thanh toán thành công",
                      "Cảm ơn bạn đã sử dụng MoMo để thanh toán!",
                      [
                        {
                          text: "OK",
                          onPress: () =>
                            navigation.reset({
                              index: 0,
                              routes: [
                                { name: "Main", params: { screen: "Home" } },
                              ],
                            }),
                        },
                      ]
                    );
                  }, 2000);
                } else {
                  // If the response doesn't contain the payUrl, show an error
                  Alert.alert("Lỗi", "Không thể tạo liên kết thanh toán");
                }
              } catch (error) {
                console.error("Payment error:", error);
                Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý thanh toán");
              }
            },
          },
        ]
      );
    } else if (paymentMethod === "cod") {
      Alert.alert(
        "Thanh toán khi nhận hàng",
        `Đơn hàng #${orderDetails._id
        } sẽ được thanh toán ${orderDetails.totalPrice.toFixed(
          2
        )} đ khi giao hàng.`,
        [
          {
            text: "Xác nhận",
            onPress: () => {
              Alert.alert(
                "Đặt hàng thành công",
                "Cảm ơn bạn đã đặt hàng. Vui lòng chuẩn bị tiền mặt khi nhận hàng.",
                [
                  {
                    text: "OK",
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
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>

      {/* Display order address info */}
      {userInfo && (
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Địa chỉ đơn hàng:</Text>
          <Text>Người nhận: {userInfo.username}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Text>Sđt: {userInfo.phoneNumber}</Text>
          <Text>Địa chỉ: {userInfo.address}</Text>
        </View>
      )}

      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
        <Text>Mã đơn hàng: #{orderDetails._id}</Text>

        <Text>Số lượng sản phẩm: {orderDetails.products.length}</Text>
        <Text style={styles.totalPrice}>
          Tổng tiền: {orderDetails.totalPrice.toLocaleString('vi-VN')} VND
        </Text>

      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.paymentMethodsTitle}>
          Chọn phương thức thanh toán
        </Text>

        <TouchableOpacity
          style={[
            styles.paymentMethod,
            paymentMethod === "momo" && styles.selectedPaymentMethod,
          ]}
          onPress={() => setPaymentMethod("momo")}
        >
          <Image
            source={{
              uri: "https://cdn2.fptshop.com.vn/unsafe/640x0/filters:quality(100)/2024_2_29_638448150533297863_tao-tai-khoan-momo.jpg",
            }}
            style={styles.paymentLogo}
          />
          <Text style={styles.paymentMethodText}>MoMo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethod,
            paymentMethod === "cod" && styles.selectedPaymentMethod,
          ]}
          onPress={() => setPaymentMethod("cod")}
        >
          <Icon
            name="cash-outline"
            size={40}
            color="#4caf50"
            style={styles.paymentLogo}
          />
          <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !paymentMethod && styles.disabledPayButton]}
        onPress={handlePayment}
        disabled={!paymentMethod}
      >
        <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderSummary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paymentMethods: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedPaymentMethod: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paymentMethodText: {
    fontSize: 16,
  },
  payButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledPayButton: {
    backgroundColor: "#ccc",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentScreen;
