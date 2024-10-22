import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const VerifyAccountScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const { verifyCode } = useAuth();
    const [code, setCode] = useState('');

    const handleVerify = async () => {
        try {
            const response = await verifyCode(email, code);
            if (response.success) {
                Alert.alert('Verification Successful', 'Your account is now verified.');
                navigation.navigate('Login');
            } else {
                throw new Error('Invalid verification code. Please try again.', response.success); // Ném lỗi để xử lý ở khối catch
            }
        } catch (error) {
            Alert.alert('Verification Failed', error.message || 'An error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Verification Code"
                value={code}
                onChangeText={setCode}
                mode="outlined"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleVerify} style={styles.button}>
                Verify
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
});

export default VerifyAccountScreen;
