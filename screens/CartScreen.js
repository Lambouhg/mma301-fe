import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set()); // Trạng thái cho các sản phẩm được chọn
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
                newSelectedItems.delete(itemId); // Nếu đã chọn thì bỏ chọn
            } else {
                newSelectedItems.add(itemId); // Nếu chưa chọn thì chọn
            }
            return newSelectedItems; // Trả về tập hợp đã thay đổi
        });
    };
    
    const selectAllItems = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set()); // Bỏ chọn tất cả
        } else {
            const allItemIds = new Set(cartItems.map(item => item.productId._id));
            setSelectedItems(allItemIds); // Chọn tất cả
        }
    };

    // Hàm để tăng số lượng sản phẩm
    const incrementQuantity = (itemId) => {
        setCartItems((prevItems) => 
            prevItems.map(item => 
                item.productId._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Hàm để giảm số lượng sản phẩm
    const decrementQuantity = (itemId) => {
        setCartItems((prevItems) => 
            prevItems.map(item => 
                item.productId._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItemContainer}>
            <TouchableOpacity onPress={() => toggleSelectItem(item.productId._id)}>
                <ProductCard 
                    product={item.productId} 
                    isSelected={selectedItems.has(item.productId._id)} // Truyền trạng thái đã chọn
                    onPress={() => toggleSelectItem(item.productId._id)} // Gọi hàm toggleSelectItem
                />
            </TouchableOpacity>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.productId._id)} style={styles.quantityButton}>
                    <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.productId._id)} style={styles.quantityButton}>
                    <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => navigation.navigate('ProductDetail', { product: item.productId, refreshCart: fetchCartItems })}>
                <Text style={styles.detailsButtonText}>Chi tiết</Text>
            </TouchableOpacity>
        </View>
    );

    const createOrder = async () => {
        if (selectedItems.size === 0) {
            Alert.alert("Thông báo", "Không có sản phẩm nào được chọn để tạo đơn hàng.");
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
                paymentMethod: 'Credit Card', // Hoặc phương thức thanh toán khác
            });
            return response.data._id; // Trả về ID đơn hàng
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
        }
    };

    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity); // Giá sản phẩm nhân với số lượng
        }, 0);
    };

    const handleCheckout = async () => {
        const orderId = await createOrder(); // Gọi hàm tạo đơn hàng
        if (orderId) {
            navigation.navigate('Order', { orderId }); // Chuyển đến OrderScreen
        }
    };

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
            <TouchableOpacity style={styles.selectAllButton} onPress={selectAllItems}>
                <Text style={styles.selectAllButtonText}>
                    {selectedItems.size === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Mua hàng</Text>
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
    row: {
        justifyContent: 'flex-start',
    },
    checkoutButton: {
        backgroundColor: '#28a745', // Màu xanh cho nút thanh toán
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20, // Khoảng cách với danh sách sản phẩm
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectAllButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    selectAllButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cartItemContainer: {
        marginBottom: 10,
    },
    detailsButton: {
        marginTop: 5,
        padding: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityButton: {
        padding: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityText: {
        color: '#000',
        fontSize: 16,
    },
});

export default CartScreen;
