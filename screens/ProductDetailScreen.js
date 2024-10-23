import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    if (!user) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng."
      );
      return;
    }

    try {
      const response = await axios.post(
        `https://mma301.onrender.com/cart/${user.id}`,
        {
          productId: product._id,
          quantity,
        }
      );
      Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
      // Optional: Clear quantity after adding to cart
      setQuantity(1);
    } catch (error) {
      console.error(error); // Log error for debugging
      Alert.alert(
        "Lỗi",
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>
          {product.price
            .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            .replace("₫", "VND")}
        </Text>

        <View style={styles.detailsContainer}>
          <DetailItem icon="trademark" text={`Thương hiệu: ${product.brand}`} />
          <DetailItem icon="skin" text={`Chất liệu: ${product.material}`} />
          <DetailItem icon="user" text={`Giới tính: ${product.gender}`} />
          <DetailItem
            icon="profile"
            text={`Kích cỡ: ${product.sizes.join(", ")}`}
          />
          <DetailItem icon="database" text={`Color: ${product.colors}`} />
          <DetailItem
            icon="database"
            text={`Còn lại: ${product.stock} sản phẩm`}
          />
        </View>

        <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <AntDesign name="minus" size={20} color="#007BFF" />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={String(quantity)}
            keyboardType="numeric"
            onChangeText={(text) => setQuantity(Math.max(1, Number(text) || 1))}
          />
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <AntDesign name="plus" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DetailItem = ({ icon, text }) => (
  <View style={styles.detailItem}>
    <AntDesign name={icon} size={20} color="#666" style={styles.detailIcon} />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 20,
    color: "#333",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 5,
    padding: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 50,
    textAlign: "center",
    marginHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
