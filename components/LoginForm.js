// src/components/LoginForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://<YOUR_BACKEND_URL>/users/login', { email, password });
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('userId', response.data.userId);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Login Failed', error.response.data.message);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default LoginForm;
