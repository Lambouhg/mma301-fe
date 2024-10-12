// /screens/ProductDetailScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ProductDetailScreen = ({ route }) => {
    const { product } = route.params; // Get the product passed as a parameter

    // Function to handle adding the product to the cart
    const handleAddToCart = () => {
        // Implement your logic for adding to the cart
        Alert.alert('Thêm vào giỏ hàng', `${product.name} đã được thêm vào giỏ hàng!`);
    };

    // Function to handle the purchase action
    const handleBuyNow = () => {
        // Implement your logic for buying the product
        Alert.alert('Mua ngay', `Bạn đã mua ${product.name}!`);
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.description}>
                {product.description ? product.description : 'Không có mô tả cho sản phẩm này.'}
            </Text>

            {/* Footer with buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                    <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
                    <Text style={styles.buttonText}>Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        color: '#4CAF50',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;
