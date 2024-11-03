import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get("window");

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

  const getStatusInfo = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "#E7F7EE",
          text: "#1D804B",
          icon: "check-circle",
          label: "Hoàn thành"
        };
      case "Pending":
        return {
          bg: "#FFF4E5",
          text: "#E07C00",
          icon: "clock-outline",
          label: "Đang xử lý"
        };
      default:
        return {
          bg: "#FFEBEB",
          text: "#D92D20",
          icon: "close-circle",
          label: "Đã hủy"
        };
    }
  };

  const renderOrderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() =>
          navigation.navigate("Chi tiết đơn hàng", { order: item, user: user })
        }
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Icon name="shopping" size={20} color="#1E293B" />
            <Text style={styles.orderId}>#{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Icon name={statusInfo.icon} size={16} color={statusInfo.text} />
            <Text style={[styles.statusText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color="#64748B" />
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="package-variant" size={16} color="#64748B" />
            <Text style={styles.productCount}>
              {item.products.length} sản phẩm
            </Text>
          </View>
        </View>

        <View style={styles.productsContainer}>
          {item.products.slice(0, 2).map((product) => (
            <View key={product.id} style={styles.productRow}>
              <Icon name="circle-small" size={16} color="#CBD5E1" />
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
            </View>
          ))}
          {item.products.length > 2 && (
            <TouchableOpacity style={styles.moreProductsButton}>
              <Text style={styles.moreProducts}>
                +{item.products.length - 2} sản phẩm khác
              </Text>
              <Icon name="chevron-right" size={16} color="#6366F1" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalPrice}>
              {item.totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <TouchableOpacity style={styles.viewDetailButton}>
            <Text style={styles.viewDetailText}>Xem chi tiết</Text>
            <Icon name="chevron-right" size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={48} color="#DC2626" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOrders}
        >
          <Icon name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="cart-outline" size={48} color="#64748B" />
        <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate("Trang chủ")}
        >
          <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 24,
  },
  orderItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderDate: {
    fontSize: 14,
    color: "#64748B",
  },
  productCount: {
    fontSize: 14,
    color: "#64748B",
  },
  productsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
  },
  moreProductsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  moreProducts: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
    marginRight: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalContainer: {
    gap: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366F1",
  },
  viewDetailButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
    marginRight: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#6366F1",
    borderRadius: 100,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  shopNowButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#6366F1",
    borderRadius: 100,
  },
  shopNowButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
});

export default ListOrderScreen;