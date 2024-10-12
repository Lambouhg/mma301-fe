import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native'; // Thêm import này

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchCartItems = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://mma301.onrender.com/cart/${user.id}`);
            setCartItems(response.data.products || []);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCartItems(); // Fetch cart items when the screen is focused
        }, [user])
    );

    const renderCartItem = ({ item }) => (
        <ProductCard 
            product={item.productId} 
            onPress={() => navigation.navigate('ProductDetail', { product: item.productId, refreshCart: fetchCartItems })} 
        />
    );

    if (loading) {
        return (
            <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.emptyText}>Đang tải giỏ hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ Hàng của Bạn</Text>
            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.productId._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                />
            )}
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
    row: {
        justifyContent: 'flex-start',
    },
});

export default CartScreen;
5