import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.length > 0 ? product.sizes[0] : null
  );
  const productColors = product.colors || [];
  const [selectedColor, setSelectedColor] = useState(
    productColors.length > 0 ? productColors[0] : null
  );

  const addToCart = async () => {
    if (!user) {
      Alert.alert("Notice", "Please log in to add products to the cart.");
      return;
    }
    try {
      await axios.post(`https://project-sdn-be.onrender.com/cart/${user.id}`, {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
      Alert.alert("Success", "Product has been added to the cart!");
      setQuantity(1);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Unable to add product to the cart. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <AntDesign name="left" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <AntDesign name="hearto" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.infoCard}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand}</Text>
            {product.stock && (
              <View style={styles.stockBadge}>
                <Text style={styles.stockText}>{product.stock} in stock</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>
            {product.price?.toLocaleString("vi-VN").replace(",", ".")} VND
          </Text>
          {product.sizes?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sizesContainer}
              >
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.selectedSize,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.selectedSizeText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          {productColors.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Select Color</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorsContainer}
              >
                {productColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && styles.selectedColorText,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.detailsGrid}>
            {product.material && (
              <DetailItem
                icon="skin"
                label="Material"
                value={product.material}
              />
            )}
            {product.gender && (
              <DetailItem icon="user" label="Gender" value={product.gender} />
            )}
          </View>
          {product.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
      <BlurView intensity={100} style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <AntDesign name="minus" size={20} color="#333" />
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
            <AntDesign name="plus" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <AntDesign name={icon} size={20} color="#666" />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10, // Reduced padding
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerButton: {
    width: 36, // Reduced width and height
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: width,
    height: width * 1.1, // Adjusted height for a better fit
    resizeMode: "cover",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 16, // Reduced padding
    paddingBottom: 80, // Adjusted bottom padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6, // Reduced margin
  },
  brand: {
    fontSize: 18, // Slightly smaller font size
    color: "#666",
    fontWeight: "600",
  },
  stockBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8, // Reduced padding
    paddingVertical: 4, // Reduced padding
    borderRadius: 20,
  },
  stockText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 22, // Slightly smaller font size
    fontWeight: "700",
    color: "#333",
    marginBottom: 6, // Reduced margin
  },
  price: {
    fontSize: 18, // Slightly smaller font size
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 10, // Reduced margin
  },
  sectionTitle: {
    fontSize: 16, // Slightly smaller font size
    fontWeight: "600",
    color: "#333",
    marginBottom: 12, // Reduced margin
    marginTop: 10, // Adjusted margin
  },
  sizesContainer: {
    flexDirection: "row",
    marginBottom: 5, // Reduced margin
  },
  sizeButton: {
    width: 30, // Reduced size button width and height
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
    backgroundColor: "#f5f5f5",
  },
  selectedSize: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  sizeText: {
    fontSize: 14, // Slightly smaller font size
    color: "#333",
  },
  selectedSizeText: {
    color: "#fff",
  },
  colorsContainer: {
    flexDirection: "row",
    marginBottom: 20, // Reduced margin
  },
  colorButton: {
    paddingHorizontal: 16, // Reduced padding
    height: 35, // Adjusted height
    borderRadius: 10, // Adjusted border radius
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
    backgroundColor: "#f5f5f5",
  },
  selectedColor: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  colorText: {
    fontSize: 12, // Slightly smaller font size
    color: "#333",
  },
  selectedColorText: {
    color: "#fff",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10, // Reduced margin
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10, // Reduced margin
  },
  detailTextContainer: {
    marginLeft: 10, // Reduced margin
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  description: {
    fontSize: 14, // Slightly smaller font size
    color: "#666",
    lineHeight: 20, // Adjusted line height
    marginBottom: 20, // Reduced margin
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    padding: 12, // Reduced padding
    paddingBottom: 24, // Adjusted bottom padding
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    marginRight: 12,
  },
  quantityButton: {
    width: 36, // Reduced button size
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityInput: {
    width: 36, // Reduced input width
    textAlign: "center",
    fontSize: 14, // Slightly smaller font size
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    height: 45, // Reduced button height
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
};

export default ProductDetailScreen;
