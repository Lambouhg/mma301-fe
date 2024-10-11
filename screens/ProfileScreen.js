import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, ActivityIndicator, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('https://mma301.onrender.com/users/profile', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    // Handle logout function
    const handleLogout = () => {
        logout();
        navigation.navigate('Login'); // Navigate to Login screen after logout
        Alert.alert('Logged out successfully');
    };

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    // Error state if profile data is not available
    if (!profileData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Unable to fetch profile data.</Text>
            </View>
        );
    }

    // Render profile information
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Profile</Title>
                    <Paragraph>Username: {profileData.username}</Paragraph>
                    <Paragraph>Email: {profileData.email}</Paragraph>
                    <Paragraph>Account Created: {new Date(profileData.createdAt).toLocaleDateString()}</Paragraph>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        padding: 20,
        marginVertical: 20,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5252',
    },
});

export default ProfileScreen;
