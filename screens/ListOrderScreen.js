import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const ListOrderScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://mma301.onrender.com/orders/user/${user.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const sortedOrders = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Mã đơn hàng: {item.id}</Text>
      <Text style={styles.orderDate}>Thời gian đặt hàng: {item.date}</Text>
      <Text style={styles.orderTotal}>
        Tổng tiền: {item.totalPrice.toLocaleString('vi-VN')} VND
      </Text>

      <Text style={styles.orderStatus}>
        Trạng thái:{" "}
        <Text style={styles.statusText(item.status)}>{item.status}</Text>
      </Text>
      <Text style={styles.productHeader}>Sản phẩm:</Text>
      {item.products.map((product) => (
        <Text key={product.id} style={styles.productName}>
          {product.name}
        </Text>
      ))}
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() =>
          navigation.navigate("Chi tiết đơn hàng", { order: item, user: user })
        }
      >
        <Text style={styles.detailButtonText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchOrders}
        contentContainerStyle={styles.flatListContent}
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
  flatListContent: {
    paddingBottom: 20,
  },
  orderItem: {
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
  orderId: {
    fontWeight: "bold",
    fontSize: 18,
  },
  orderDate: {
    color: "#777",
  },
  orderTotal: {
    fontWeight: "bold",
    color: "#007bff",
    fontSize: 16,
  },
  orderStatus: {
    marginTop: 5,
  },
  statusText: (status) => ({
    color:
      status === "Completed"
        ? "green"
        : status === "Pending"
          ? "orange"
          : "red",
    fontWeight: "bold",
  }),
  productHeader: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  productName: {
    paddingLeft: 10,
    color: "#333",
  },
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
  emptyText: {
    color: "#555",
  },
  errorText: {
    color: "red",
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffcc00",
    borderRadius: 5,
  },
  retryButtonText: {
    fontWeight: "bold",
  },
  shopNowButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  shopNowButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  detailButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  detailButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ListOrderScreen;
