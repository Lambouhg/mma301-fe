import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://mma301.onrender.com/cart/${user.id}`
      );
      setCartItems(response.data.products || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCartItems([]);
      } else {
        console.error("Error fetching cart items:", error);
        Alert.alert("Error", "Failed to load cart items. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [user])
  );

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }
      return newSelectedItems;
    });
  };

  const selectAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      const allItemIds = new Set(cartItems.map((item) => item.productId._id));
      setSelectedItems(allItemIds);
    }
  };

  const incrementQuantity = async (itemId) => {
    const updatedItem = cartItems.find((item) => item.productId._id === itemId);
    if (updatedItem) {
      const newQuantity = updatedItem.quantity + 1;

      // Update quantity in state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Send request to update quantity on server
      try {
        await axios.put(
          `https://mma301.onrender.com/cart/${user.id}/${itemId}/update`,
          {
            quantity: newQuantity,
          }
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        Alert.alert("Error", "Failed to update quantity. Please try again.");
      }
    }
  };

  const decrementQuantity = async (itemId) => {
    const updatedItem = cartItems.find((item) => item.productId._id === itemId);
    if (updatedItem && updatedItem.quantity > 1) {
      const newQuantity = updatedItem.quantity - 1;

      // Update quantity in state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Send request to update quantity on server
      try {
        await axios.put(
          `https://mma301.onrender.com/cart/${user.id}/${itemId}/update`,
          {
            quantity: newQuantity,
          }
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        Alert.alert("Error", "Failed to update quantity. Please try again.");
      }
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => toggleSelectItem(item.productId._id)}
      >
        <MaterialIcons
          name={
            selectedItems.has(item.productId._id)
              ? "check-box"
              : "check-box-outline-blank"
          }
          size={24}
          color="#007bff"
        />
      </TouchableOpacity>
      <ProductCard
        product={item.productId}
        isSelected={selectedItems.has(item.productId._id)}
        onPress={() =>
          navigation.navigate("Chi tiết sản phẩm", {
            product: item.productId,
            refreshCart: fetchCartItems,
          })
        }
      />
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => decrementQuantity(item.productId._id)}
          style={styles.quantityButton}
        >
          <MaterialIcons name="remove" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => incrementQuantity(item.productId._id)}
          style={styles.quantityButton}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const createOrder = async () => {
    if (selectedItems.size === 0) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn ít nhất một sản phẩm để tạo đơn hàng."
      );
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.productId._id)
    );

    try {
      const response = await axios.post("https://mma301.onrender.com/orders", {
        userId: user.id,
        products: selectedCartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        totalPrice: calculateTotalPrice(selectedCartItems),
        paymentMethod: "Credit Card",
      });
      return response.data._id;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  const calculateTotalPrice = (items) => {
    return items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    const orderId = await createOrder();
    if (orderId) {
      navigation.navigate("Order", { orderId });
    }
  };
  const totalSelectedPrice = calculateTotalPrice(
    cartItems.filter((item) => selectedItems.has(item.productId._id))
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.centeredContainer}>
          <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={selectAllItems}
          >
            <MaterialIcons
              name={
                selectedItems.size === cartItems.length
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color="#fff"
            />
            <Text style={styles.selectAllButtonText}>
              {selectedItems.size === cartItems.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.productId._id}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPriceText}>
              Tổng: {totalSelectedPrice.toFixed(2)} VND
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Mua hàng</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    color: "#666",
    marginVertical: 20,
  },
  shopNowButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA07A",
    padding: 11,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectAllButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    fontWeight: "bold",
  },
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectButton: {
    marginRight: 15,
  },
  productCardContainer: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  quantityButton: {
    backgroundColor: "#FFA07A",
    padding: 8,
    borderRadius: 20,
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingBottom: 70,
  },
  totalPriceContainer: {
    flex: 1,
  },
  totalPriceLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalPriceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C0F14",
  },
  checkoutButton: {
    backgroundColor: "#FFA07A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default CartScreen;
