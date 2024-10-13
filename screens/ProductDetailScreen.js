import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProductDetailScreen = ({ route }) => {
    const { product } = route.params; // Nhận thông tin sản phẩm từ params
    const { user } = useAuth(); // Nhận thông tin người dùng đã đăng nhập
    const [quantity, setQuantity] = useState(1); // Trạng thái cho số lượng sản phẩm

    const addToCart = async () => {
        if (!user) {
            Alert.alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        const dataToSend = {
            productId: product._id,
            quantity,
        };

        console.log("Adding to cart:", dataToSend); // Kiểm tra dữ liệu gửi đi

        try {
            const response = await axios.post(`https://mma301.onrender.com/cart/${user.id}`, dataToSend);
            console.log("Response from API:", response.data); // Kiểm tra phản hồi từ API
            Alert.alert("Sản phẩm đã được thêm vào giỏ hàng!", response.data.message);
        } catch (error) {
            console.error("Error adding to cart:", error); // In ra lỗi
            Alert.alert("Lỗi khi thêm vào giỏ hàng:", error.response?.data?.message || "Đã xảy ra lỗi.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.description}>{product.description}</Text>

            {/* Hiển thị số lượng tồn kho */}
            <Text style={styles.stock}>Còn lại: {product.stock} sản phẩm</Text>

            {/* Nhập số lượng */}
            <View style={styles.quantityContainer}>
                <Text>Số lượng:</Text>
                <TextInput
                    style={styles.quantityInput}
                    value={String(quantity)}
                    keyboardType="numeric"
                    onChangeText={text => setQuantity(Number(text) || 1)} // Đảm bảo số lượng luôn là số
                />
            </View>

            <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#28a745',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: 50,
        textAlign: 'center',
        marginLeft: 10,
    },
    addToCartButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    stock: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    
});

export default ProductDetailScreen;
