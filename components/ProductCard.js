// /components/ProductCard.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress }) => {
    const imageUrl = product.imageUrl ? product.imageUrl : 'https://via.placeholder.com/100'; // Đường dẫn đến hình ảnh mặc định

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
                <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        margin: 5, // Khoảng cách giữa các thẻ sản phẩm
        padding: 10,
        flex: 1, // Thẻ có thể mở rộng để chiếm toàn bộ không gian
        maxWidth: '30%', // Thay đổi chiều rộng để có 3 cột
        height: 250, // Chiều cao cố định
    },
    image: {
        width: '100%',
        height: 110, // Giữ chiều cao cố định cho hình ảnh
        borderRadius: 10,
    },
    info: {
        marginTop: 10, // Giảm khoảng cách giữa các thành phần
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center', // Căn giữa tiêu đề
        overflow: 'hidden', // Ẩn nội dung tràn ra
    },
    price: {
        fontSize: 14,
        color: '#4CAF50',
        marginVertical: 5,
        textAlign: 'center', // Căn giữa giá
    },
    description: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        overflow: 'hidden', // Ẩn nội dung tràn ra
    },
});

export default ProductCard;
