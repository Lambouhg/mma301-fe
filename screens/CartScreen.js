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
            if (error.response && error.response.status === 404) {
                console.warn('Cart not found for user:', user.id);
                setCartItems([]); // Treat as an empty cart
            } else {
                console.error('Error fetching cart items:', error);
                Alert.alert('Error', 'Failed to load cart items. Please try again.');
            }
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

    const incrementQuantity = (itemId) => {
        setCartItems((prevItems) => 
            prevItems.map(item => 
                item.productId._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrementQuantity = (itemId) => {
        setCartItems((prevItems) => 
            prevItems.map(item => 
                item.productId._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
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
                            {selectedItems.size === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </Text>
                    </TouchableOpacity>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.productId._id}
                        contentContainerStyle={styles.listContainer}
                    />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>
                            Tổng cộng ({selectedItems.size} sản phẩm): 
                            ${calculateTotalPrice(cartItems.filter(item => selectedItems.has(item.productId._id))).toFixed(2)}
                        </Text>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Mua hàng</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
    },
    emptyText: {
        fontSize: 20,
        color: '#666',
        marginTop: 16,
    },
    shopNowButton: {
        marginTop: 24,
        backgroundColor: '#007bff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopNowButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 16,
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectAllButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        padding: 12,
        elevation: 2,
    },
    selectButton: {
        marginRight: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    quantityButton: {
        backgroundColor: '#007bff',
        borderRadius: 4,
        padding: 4,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartScreen;