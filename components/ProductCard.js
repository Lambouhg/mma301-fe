import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const ProductCard = ({ product, isSelected, onPress }) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    style={[styles.card, isSelected ? styles.selectedCard : null]}
  >
    <Image source={{ uri: product.imageUrl }} style={styles.image} />
    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.price}>
      {product.price.toLocaleString('vi-VN')} VND
    </Text>
  </TouchableOpacity>
  
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#007bff",
    borderWidth: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  price: {
    color: "#28a745",
    fontSize: 14,
  },
});

export default ProductCard;
