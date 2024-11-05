import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const OrderScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchProductDetails = async (productIds) => {
    const productDetailsPromises = productIds.map((productId) =>
      axios.get(`https://project-sdn-be.onrender.com/products/${productId}`)
    );
    const productDetailsResponses = await Promise.all(productDetailsPromises);
    return productDetailsResponses.map((response) => response.data);
  };

  const fetchOrderDetails = async () => {
    try {w
      const response = await axios.get(
        `https://project-sdn-be.onrender.com/orders/${orderId}`
      );

      if (!response.data.products || response.data.products.length === 0) {
        Alert.alert("Thông báo", "Không có sản phẩm trong đơn hàng.");
        setLoading(false);
        return;
      }

      const productsWithDetails = await fetchProductDetails(
        response.data.products.map((item) => item.productId)
      );

      const productsWithFullDetails = response.data.products.map(
        (item, index) => ({
          ...item,
          productId: productsWithDetails[index],
        })
      );

      setOrderDetails({ ...response.data, products: productsWithFullDetails });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const deleteOrder = async () => {
    try {
      await axios.delete(
        `https://project-sdn-be.onrender.com/orders/${orderId}`
      );
      navigation.navigate("Giỏ hàng");
      Alert.alert("Thông báo", "Đơn hàng đã bị hủy.");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBackAction = (e) => {
        e.preventDefault();
        Alert.alert(
          "Cảnh báo",
          "Nếu không thanh toán, đơn hàng sẽ bị hủy. Bạn có chắc chắn muốn thoát không?",
          [
            {
              text: "Không",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Có",
              onPress: () => {
                deleteOrder();
                navigation.dispatch(e.data.action);
              },
            },
          ],
          { cancelable: false }
        );
      };

      navigation.addListener("beforeRemove", handleBackAction);
      return () => navigation.removeListener("beforeRemove", handleBackAction);
    }, [navigation])
  );

  const renderProductDetail = ({ item }) => {
    const productPrice = item.productId.price;
    const totalProductPrice = productPrice * item.quantity;
    return (
      <View style={styles.productContainer}>
        <Image
          source={{ uri: item.productId.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.productId.name}</Text>
          <View style={styles.productDetails}>
            <View style={styles.quantityContainer}>
              <MaterialIcons name="shopping-basket" size={16} color="#666" />
              <Text style={styles.productQuantity}>{item.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>
              {totalProductPrice.toLocaleString("vi-VN")} 0VND
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      navigation.navigate("Thanh toán", { orderDetails });
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const OrderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.orderNumber}>Đơn hàng #{orderDetails?._id}</Text>
      <View style={styles.orderStatus}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Chờ thanh toán</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error-outline" size={48} color="#666" />
        <Text style={styles.emptyText}>Không tìm thấy đơn hàng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <OrderHeader />
        <FlatList
          data={orderDetails.products}
          renderItem={renderProductDetail}
          keyExtractor={(item) => item.productId._id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalPrice}>
              {orderDetails.totalPrice.toLocaleString("vi-VN")}₫
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              isProcessingPayment && styles.paymentButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialIcons
                  name="payment"
                  size={24}
                  color="#fff"
                  style={styles.paymentIcon}
                />
                <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF385C",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#FF385C",
    fontWeight: "500",
  },
  productList: {
    padding: 16,
  },
  productContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF385C",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF385C",
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: "#FF385C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonDisabled: {
    backgroundColor: "#ffb3c0",
  },
  paymentIcon: {
    marginRight: 8,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default OrderScreen;
