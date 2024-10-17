import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditPasswordScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateNewPassword = (password) => {
        const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!validateNewPassword(newPassword)) {
            Alert.alert(
                "Error",
                "New password must be at least 6 characters long, contain at least one uppercase letter and one number."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New password and confirmation password do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                'https://mma301.onrender.com/users/editPass', 
                { password: currentPassword, newPassword }, 
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );
            Alert.alert("Success", response.data.message);
            navigation.goBack();
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert("Error", "Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
            />

            <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />
            {loading ? (
                <ActivityIndicator animating={true} />
            ) : (
                <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                    Change Password
                </Button>
            )}
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

export default EditPasswordScreen;
