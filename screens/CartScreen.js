import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

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
            const response = await axios.get(`https://mma301.onrender.com/cart/${user.id}`);
            setCartItems(response.data.products || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            Alert.alert('Error', 'Failed to load cart items. Please try again.');
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
            const allItemIds = new Set(cartItems.map(item => item.productId._id));
            setSelectedItems(allItemIds);
        }
    };

    const incrementQuantity = async (itemId) => {
        const updatedItem = cartItems.find(item => item.productId._id === itemId);
        if (updatedItem) {
            const newQuantity = updatedItem.quantity + 1;

            // Update quantity in state
            setCartItems((prevItems) => 
                prevItems.map(item => 
                    item.productId._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

            // Send request to update quantity on server
            try {
                await axios.put(`https://mma301.onrender.com/cart/${user.id}/${itemId}/update`, {
                    quantity: newQuantity,
                });
            } catch (error) {
                console.error('Error updating quantity:', error);
                Alert.alert('Error', 'Failed to update quantity. Please try again.');
            }
        }
    };
    
    const decrementQuantity = async (itemId) => {
        const updatedItem = cartItems.find(item => item.productId._id === itemId);
        if (updatedItem && updatedItem.quantity > 1) {
            const newQuantity = updatedItem.quantity - 1;

            // Update quantity in state
            setCartItems((prevItems) => 
                prevItems.map(item => 
                    item.productId._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

            // Send request to update quantity on server
            try {
                await axios.put(`https://mma301.onrender.com/cart/${user.id}/${itemId}/update`, {
                    quantity: newQuantity,
                });
            } catch (error) {
                console.error('Error updating quantity:', error);
                Alert.alert('Error', 'Failed to update quantity. Please try again.');
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
                    name={selectedItems.has(item.productId._id) ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color="#007bff"
                />
            </TouchableOpacity>
            <ProductCard 
                product={item.productId} 
                isSelected={selectedItems.has(item.productId._id)}
                onPress={() => navigation.navigate('ProductDetail', { product: item.productId, refreshCart: fetchCartItems })}
            />
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.productId._id)} style={styles.quantityButton}>
                    <MaterialIcons name="remove" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.productId._id)} style={styles.quantityButton}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const createOrder = async () => {
        if (selectedItems.size === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để tạo đơn hàng.");
            return;
        }

        const selectedCartItems = cartItems.filter(item => selectedItems.has(item.productId._id));

        try {
            const response = await axios.post('https://mma301.onrender.com/orders', {
                userId: user.id,
                products: selectedCartItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                })),
                totalPrice: calculateTotalPrice(selectedCartItems),
                paymentMethod: 'Credit Card',
            });
            return response.data._id;
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
        }
    };

    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        const orderId = await createOrder();
        if (orderId) {
            navigation.navigate('Order', { orderId });
        }
    };

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ Hàng của Bạn</Text>
            {cartItems.length === 0 ? (
                <View style={styles.centeredContainer}>
                    <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                    <TouchableOpacity 
                        style={styles.shopNowButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity style={styles.selectAllButton} onPress={selectAllItems}>
                        <MaterialIcons 
                            name={selectedItems.size === cartItems.length ? "check-box" : "check-box-outline-blank"} 
                            size={24} 
                            color="#fff" 
                        />
                        <Text style={styles.selectAllButtonText}>
                            {selectedItems.size === cartItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </Text>
                    </TouchableOpacity>
                    <FlatList 
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.productId._id}
                        contentContainerStyle={styles.listContainer}
                    />
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Mua hàng</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa', // Slightly light background for better contrast
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginVertical: 20,
    },
    shopNowButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    shopNowButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginBottom: 20,
    },
    selectAllButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    selectButton: {
        marginRight: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityText: {
        fontSize: 18,
        color: '#333',
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default CartScreen;
