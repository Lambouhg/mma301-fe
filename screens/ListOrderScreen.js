import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';  // Sử dụng useAuth từ AuthContext
import { Card, Button } from 'react-native-paper';

const ListOrderScreen = () => {
  const { user } = useAuth();  // Lấy thông tin user từ AuthContext
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      fetchOrders();  // Gọi hàm lấy danh sách đơn hàng nếu người dùng đã đăng nhập
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Sử dụng user.id để lấy danh sách đơn hàng từ API
      const response = await axios.get(`https://mma301.onrender.com/orders/user/${user.id}`);
      
      // Sắp xếp đơn hàng theo ngày giảm dần để đơn hàng mới nhất ở trên cùng
      const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setError('Có lỗi xảy ra khi tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <Card 
      style={styles.orderCard} 
      onPress={() => navigation.navigate('OrderDetails', { order: item, user: user })}  // Truyền thông tin order và user
    >
      <Card.Content>
        <Text style={styles.orderTitle}>Đơn hàng #{item._id}</Text>
        <Text style={styles.orderDate}>Ngày: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>Tổng tiền: {item.totalPrice.toLocaleString()} VND</Text>

        {/* Kiểm tra nếu có thông tin shippingAddress thì hiển thị */}
        {item.shippingAddress ? (
          <Text style={styles.orderInfo}>
            Địa chỉ giao hàng: {item.shippingAddress.address}, {item.shippingAddress.city}, {item.shippingAddress.postalCode}, {item.shippingAddress.country}
          </Text>
        ) : (
          <Text style={styles.orderInfo}>Địa chỉ giao hàng: Chưa cung cấp</Text>
        )}

        {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
        <View style={styles.productList}>
          <Text style={styles.productListTitle}>Sản phẩm:</Text>
          {Array.isArray(item.orderItems) && item.orderItems.length > 0 ? (
            item.orderItems.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Text>{product.name} - Số lượng: {product.qty}</Text>
                <Text>Giá: {product.price.toLocaleString()} VND</Text>
              </View>
            ))
          ) : (
            <Text>Không có sản phẩm nào trong đơn hàng.</Text> // Handle case when there are no products
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('OrderDetails', { order: item, user: user })}>
          Xem Chi Tiết
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải danh sách đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>Bạn chưa có đơn hàng nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        refreshing={loading}
        onRefresh={fetchOrders}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 5,
  },
  productList: {
    marginTop: 10,
  },
  productListTitle: {
    fontWeight: 'bold',
  },
  productItem: {
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListOrderScreen;
