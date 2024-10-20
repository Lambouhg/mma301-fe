import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const OrderDetailsScreen = ({ route }) => {
  const { order, user } = route.params;  // Lấy thông tin order và user từ route

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Thông tin Đơn hàng" />
        <Card.Content>
          <Text style={styles.detailText}>Mã đơn hàng: {order._id}</Text>
          <Text style={styles.detailText}>Ngày đặt hàng: {new Date(order.date).toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Tổng tiền: {order.totalPrice.toLocaleString()} USD</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Thông tin Người dùng" />
        <Card.Content>
          <Text style={styles.detailText}>Tên người dùng: {user.name}</Text>
          <Text style={styles.detailText}>Email: {user.email}</Text>
          <Text style={styles.detailText}>Số điện thoại: {user.phone}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  card: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default OrderDetailsScreen;
