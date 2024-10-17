import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditAddressScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const { userInfo } = route.params; // Nhận thông tin người dùng từ route params
    const [username, setUsername] = useState(userInfo.username);
    const [address, setAddress] = useState(userInfo.address);
    const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
    const [loading, setLoading] = useState(false);

    const isValidPhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleUpdateAddress = async () => {
        if (!address || address.trim().length === 0) {
            Alert.alert("Lỗi", "Địa chỉ không được để trống.");
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put('https://mma301.onrender.com/users/updateAddress', {
                address,
                phoneNumber,
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            Alert.alert("Cập nhật thành công", response.data.message);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật địa chỉ. Vui lòng thử lại sau.");
            console.error("Error updating address:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chỉnh sửa địa chỉ nhận hàng</Text>

            <TextInput
                style={styles.input}
                value={username}
                placeholder="Tên người dùng"
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
            />

            <TextInput
                style={styles.input}
                value={phoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
            />
            
            <TextInput
                style={styles.input}
                value={address}
                placeholder="Nhập địa chỉ"
                onChangeText={setAddress}
            />

            <Button
                title="Lưu địa chỉ"
                onPress={handleUpdateAddress}
                disabled={loading}
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
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
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default EditAddressScreen;
