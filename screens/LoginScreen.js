import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Appbar, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigation.navigate('Main'); // Navigate to the Main tab navigator
        } catch (error) {
            Alert.alert('Login failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Login" />
            </Appbar.Header>
            <View style={styles.innerContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Image
                            source={require('../assets/logo.jpg')} // Replace with your logo
                            style={styles.logo}
                        />
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            style={styles.input}
                            onSubmitEditing={() => {
                                // Focus on the password input when the user presses enter
                                passwordInput.focus();
                            }}
                        />
                        <TextInput
                            ref={(input) => { passwordInput = input; }} // Create a reference for the password input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            mode="outlined"
                            style={styles.input}
                            onSubmitEditing={handleLogin} // Call handleLogin when user presses enter/done
                        />
                        <Button mode="contained" onPress={handleLogin} style={styles.button}>
                            Login
                        </Button>
                    </Card.Content>
                </Card>
                <Text style={styles.footerText} onPress={() => navigation.navigate('Signup')}>
                    Don't have an account? Sign Up
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
    card: {
        padding: 20,
        borderRadius: 8,
        elevation: 5,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
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

export default LoginScreen;
