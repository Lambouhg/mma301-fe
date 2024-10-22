import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
    const { signup, verifyCode } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            console.log('Signup Data:', { username, email, password });
            const response = await signup(username, email, password);
            Alert.alert('Signup Successful!', 'Please check your email for the verification code.');
            navigation.navigate('VerifyAccount', { email });
        } catch (error) {
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Sign Up" />
            </Appbar.Header>
            <View style={styles.innerContainer}>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleSignup} style={styles.button}>
                    Sign Up
                </Button>
                <Text style={styles.footerText} onPress={() => navigation.navigate('Login')}>
                    Already have an account? Login
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
    footerText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#007BFF',
    },
});

export default SignupScreen;
