import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Đảm bảo bạn đã cài đặt thư viện này

const PaymentScreen = ({ route, navigation }) => {
    const { orderDetails } = route.params;
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handlePayment = () => {
        if (paymentMethod === 'momo') {
          Alert.alert(
            "Thanh toán MoMo",
            `Đang chuyển hướng đến ứng dụng MoMo để thanh toán ${orderDetails.totalPrice.toFixed(2)} đ cho đơn hàng #${orderDetails._id}`,
            [
              {
                text: "OK",
                onPress: () => {
                  setTimeout(() => {
                    Alert.alert(
                      "Thanh toán thành công",
                      "Cảm ơn bạn đã sử dụng MoMo để thanh toán!",
                      [{ 
                        text: "OK", 
                        onPress: () => navigation.reset({
                          index: 0,
                          routes: [{ name: 'Main', params: { screen: 'Home' } }],
                        })
                      }]
                    );
                  }, 2000);
                }
              }
            ]
          );
        } else if (paymentMethod === 'cod') {
          Alert.alert(
            "Thanh toán khi nhận hàng",
            `Đơn hàng #${orderDetails._id} sẽ được thanh toán ${orderDetails.totalPrice.toFixed(2)} đ khi giao hàng.`,
            [
              {
                text: "Xác nhận",
                onPress: () => {
                  Alert.alert(
                    "Đặt hàng thành công",
                    "Cảm ơn bạn đã đặt hàng. Vui lòng chuẩn bị tiền mặt khi nhận hàng.",
                    [{ 
                      text: "OK", 
                      onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main', params: { screen: 'Home' } }],
                      })
                    }]
                  );
                }
              }
            ]
          );
        }
      };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Thanh toán</Text>

            <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
                <Text>Mã đơn hàng: #{orderDetails._id}</Text>
                <Text>Số lượng sản phẩm: {orderDetails.products.length}</Text>
                <Text style={styles.totalPrice}>Tổng tiền: {orderDetails.totalPrice.toFixed(2)} đ</Text>
            </View>

            <View style={styles.paymentMethods}>
                <Text style={styles.paymentMethodsTitle}>Chọn phương thức thanh toán</Text>

                <TouchableOpacity
                    style={[styles.paymentMethod, paymentMethod === 'momo' && styles.selectedPaymentMethod]}
                    onPress={() => setPaymentMethod('momo')}
                >
                    <Image
                        source={{ uri: 'https://cdn2.fptshop.com.vn/unsafe/640x0/filters:quality(100)/2024_2_29_638448150533297863_tao-tai-khoan-momo.jpg' }}
                        style={styles.paymentLogo}
                    />
                    <Text style={styles.paymentMethodText}>MoMo</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.paymentMethod, paymentMethod === 'cod' && styles.selectedPaymentMethod]}
                    onPress={() => setPaymentMethod('cod')}
                >
                    <Icon name="cash-outline" size={40} color="#4caf50" style={styles.paymentLogo} />
                    <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.payButton, !paymentMethod && styles.disabledPayButton]}
                onPress={handlePayment}
                disabled={!paymentMethod}
            >
                <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    orderSummary: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    paymentMethods: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    paymentMethodsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedPaymentMethod: {
        borderColor: '#007bff',
        backgroundColor: '#e6f2ff',
    },
    paymentLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    paymentMethodText: {
        fontSize: 16,
    },
    payButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledPayButton: {
        backgroundColor: '#ccc',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PaymentScreen;