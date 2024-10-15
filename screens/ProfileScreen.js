import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileScreen = ({ navigation, route }) => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    // Kiểm tra xem có flag updated không để refresh lại dữ liệu
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
                    <Title style={styles.title}>Profile</Title>
                    <Paragraph>Username: {profileData.username}</Paragraph>
                    <Paragraph>Email: {profileData.email}</Paragraph>
                    <Paragraph>Phone Number: {profileData.phoneNumber}</Paragraph>
                    <Paragraph>Address: {profileData.address}</Paragraph>
                    <Paragraph>Account Created: {new Date(profileData.createdAt).toLocaleDateString()}</Paragraph>
                    <Button 
                        mode="contained" 
                        onPress={() => navigation.navigate('EditProfile', { profileData })} 
                        style={styles.editButton}
                    >
                        Edit Profile
                    </Button>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
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
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#4caf50',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5252',
    },
});

export default ProfileScreen;
