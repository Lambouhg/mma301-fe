import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon

const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (route.params?.updated) {
            fetchProfile();
        }
    }, [route.params]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://mma301.onrender.com/users/profile', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProfileData(response.data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            Alert.alert("Error", "Failed to fetch profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
        Alert.alert('Logged out successfully');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!profileData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Unable to fetch profile data.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Profile Information</Title>
                    <Paragraph style={styles.profileInfo}>
                        <Icon name="person" size={18} color="#007bff" /> Username: {profileData.username}
                    </Paragraph>
                    <Paragraph style={styles.profileInfo}>
                        <Icon name="email" size={18} color="#007bff" /> Email: {profileData.email}
                    </Paragraph>
                    <Paragraph style={styles.profileInfo}>
                        <Icon name="phone" size={18} color="#007bff" /> Phone Number: {profileData.phoneNumber}
                    </Paragraph>
                    <Paragraph style={styles.profileInfo}>
                        <Icon name="home" size={18} color="#007bff" /> Address: {profileData.address}
                    </Paragraph>
                    <Paragraph style={styles.profileInfo}>
                        <Icon name="calendar-today" size={18} color="#007bff" /> Account Created: {new Date(profileData.createdAt).toLocaleDateString()}
                    </Paragraph>
                    <Button 
                        mode="contained" 
                        onPress={() => navigation.navigate('EditProfile', { profileData })} 
                        style={styles.editButton}
                        icon="pencil" 
                    >
                        Edit Profile
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={() => navigation.navigate('EditPassword')} 
                        style={styles.editPasswordButton}
                        icon="lock-outline"
                    >
                        Edit Password
                    </Button>
                </Card.Content>
            </Card>
            <Button 
                mode="contained" 
                onPress={handleLogout} 
                style={styles.logoutButton}
                icon="logout"
            >
                Logout
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    profileInfo: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#4caf50',
    },
    editPasswordButton: {
        marginTop: 10,
        backgroundColor: '#1976d2',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5252',
    },
});

export default ProfileScreen;
