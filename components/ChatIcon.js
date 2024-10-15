// ChatIcon.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatIcon = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.chatIcon}>
            <Icon name="comments" size={30} color="#007bff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatIcon: {
        position: 'absolute',
        bottom: 80, // Adjust this value to position above the footer
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
});

export default ChatIcon;
