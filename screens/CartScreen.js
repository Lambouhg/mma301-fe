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
        `https://project-sdn-be.onrender.com/cart/${user.id}`
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
          `https://project-sdn-be.onrender.com/cart/${user.id}/${itemId}/update`,
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
          `https://project-sdn-be.onrender.com/cart/${user.id}/${itemId}/update`,
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

    // Kiểm tra tồn kho (stock) của sản phẩm
    const outOfStockItems = selectedCartItems.filter(
      (item) => item.productId.stock === 0
    );

    if (outOfStockItems.length > 0) {
      // Nếu có sản phẩm hết hàng
      const outOfStockNames = outOfStockItems
        .map((item) => item.productId.name)
        .join(", ");
      Alert.alert(
        "Thông báo",
        `Các sản phẩm sau đã hết hàng: ${outOfStockNames}. Vui lòng bỏ chọn hoặc kiểm tra lại sau.`
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://project-sdn-be.onrender.com/orders",
        {
          userId: user.id,
          products: selectedCartItems.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          totalPrice: calculateTotalPrice(selectedCartItems),
          paymentMethod: "Credit Card",
        }
      );
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

  const removeSelectedItems = async () => {
    if (selectedItems.size === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để xoá.");
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedItems).map((itemId) =>
          axios.delete(
            `https://project-sdn-be.onrender.com/cart/${user.id}/${itemId}`
          )
        )
      );

      // Cập nhật lại danh sách sản phẩm trong giỏ hàng
      setCartItems((prevItems) =>
        prevItems.filter((item) => !selectedItems.has(item.productId._id))
      );
      setSelectedItems(new Set()); // Bỏ chọn tất cả sản phẩm
      Alert.alert("Thông báo", "Xoá sản phẩm thành công.");
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể xoá sản phẩm. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.centeredContainer}>
          <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Trang chủ")}
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
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceText} numberOfLines={1}>
                Tổng: {totalSelectedPrice.toLocaleString("vi-VN")} VND
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeSelectedItems}
              >
                <MaterialIcons name="delete" size={18} color="#FFFFFF" />
                <Text style={styles.removeButtonText}>Xóa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <MaterialIcons name="shopping-cart" size={18} color="#FFFFFF" />
                <Text style={styles.checkoutButtonText}>Mua</Text>
              </TouchableOpacity>
            </View>
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
  removeButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    paddingHorizontal: 16,
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
    flex: 1, // Cho phép container giá tiền co giãn
    marginRight: 10,
  },

  totalPriceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0C0F14",
  },

  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  removeButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },

  checkoutButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default CartScreen;
