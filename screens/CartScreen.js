// /screens/CartScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Fetch the cart items from the backend API
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('https://mma301.onrender.com/cart/{userId}');
                setCartItems(response.data.products); // Assuming products are stored in cart
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    const renderCartItem = ({ item }) => (
        <ProductCard product={item.productId} onPress={() => console.log(item.productId.name)} />
    );

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
                    numColumns={2} // Display 2 products per row
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
