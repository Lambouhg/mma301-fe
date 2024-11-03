import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ListOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(order);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderDetails) fetchOrderDetails();
    fetchProfile();
  }, [order]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://mma301.onrender.com/orders/${order.id}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOrderDetails(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải thông tin chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://mma301.onrender.com/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfileData(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải thông tin chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Không tìm thấy thông tin đơn hàng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
      <Text>Mã đơn hàng: {orderDetails.id}</Text>
      <Text>Ngày đặt hàng: {orderDetails.date}</Text>
      <Text>Tổng tiền: {orderDetails.totalPrice.toLocaleString('vi-VN')} VND</Text>
      <Text>Phương thức thanh toán: {orderDetails.paymentMethod}</Text>
      <Text>
        Trạng thái đơn hàng:{" "}
        <Text style={styles.statusText(orderDetails.status)}>{orderDetails.status}</Text>
      </Text>

      <Text style={styles.sectionTitle}>Thông tin người đặt hàng</Text>
      {profileData ? (
        <>
          <Text>Tên người đặt: {profileData.username}</Text>
          <Text>Email: {profileData.email}</Text>
          <Text>Số điện thoại: {profileData.phoneNumber}</Text>
          <Text>Địa chỉ: {profileData.address}</Text>
        </>
      ) : (
        <Text>Đang tải thông tin người đặt hàng...</Text>
      )}

      <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
<FlatList
  data={orderDetails.products}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chi tiết sản phẩm", { product: item })}
      style={styles.productItem}
    >
      <View style={styles.productRow}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text>Giá: {item.price.toLocaleString('vi-VN')} VND</Text>
          <Text>Số lượng: {item.quantity}</Text>
          <Text>Thương hiệu: {item.brand}</Text>
          <Text>Danh mục: {item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },
  productItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statusText: (status) => ({
    color: status === "Completed" ? "green" : status === "Pending" ? "orange" : "red",
    fontWeight: "bold",
  }),
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  errorText: {
    color: "red",
  },
  emptyText: {
    color: "#555",
  },
});

export default ListOrderDetailScreen;