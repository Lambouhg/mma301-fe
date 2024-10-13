import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const OrderScreen = ({ route, navigation }) => {
    const { orderId } = route.params; // Nhận orderId từ tham số
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProductDetails = async (productIds) => {
        const productDetailsPromises = productIds.map(productId =>
            axios.get(`https://mma301.onrender.com/products/${productId}`) // API để lấy thông tin sản phẩm
        );
        const productDetailsResponses = await Promise.all(productDetailsPromises);
        return productDetailsResponses.map(response => response.data);
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`https://mma301.onrender.com/orders/${orderId}`);
            console.log(response.data); // In dữ liệu ra console

            // Lấy thông tin chi tiết sản phẩm
            const productsWithDetails = await fetchProductDetails(response.data.products.map(item => item.productId));
            // Ghép thông tin sản phẩm với thông tin đơn hàng
            const productsWithFullDetails = response.data.products.map((item, index) => ({
                ...item,
                productId: productsWithDetails[index], // Thay thế bằng thông tin sản phẩm đầy đủ
            }));

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

    const renderProductDetail = ({ item }) => {
        const productPrice = item.productId.price; // Lưu giá sản phẩm từ productId
        const totalProductPrice = productPrice * item.quantity; // Tính tổng giá cho từng sản phẩm
        return (
            <View style={styles.productContainer}>
                <Image source={{ uri: item.productId.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{item.productId.name}</Text>
                    <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                    <Text style={styles.productPrice}>Giá: {totalProductPrice.toFixed(2)} đ</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.emptyText}>Đang tải đơn hàng...</Text>
            </View>
        );
    }

    if (!orderDetails) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy đơn hàng.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết đơn hàng #{orderDetails._id}</Text>
            <FlatList
                data={orderDetails.products}
                renderItem={renderProductDetail}
                keyExtractor={(item) => item.productId._id}
            />
            <Text style={styles.totalPrice}>Tổng tiền: {orderDetails.totalPrice.toFixed(2)} đ</Text>
            {/* Thêm nút thanh toán nếu cần */}
            <TouchableOpacity style={styles.paymentButton} onPress={() => {/* Logic thanh toán */}}>
                <Text style={styles.paymentButtonText}>Thanh toán</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productQuantity: {
        fontSize: 16,
    },
    productPrice: {
        fontSize: 16,
        color: '#28a745',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'right',
    },
    paymentButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OrderScreen;
