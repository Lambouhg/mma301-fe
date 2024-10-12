// /components/ProductCard.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress }) => {
    const imageUrl = product.imageUrl ? product.imageUrl : 'https://via.placeholder.com/100'; // Default image URL

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        margin: 5, // Space between product cards
        padding: 10,
        flex: 1, // Expands to occupy available space
        maxWidth: '50%', // Fits 2 cards in a row
        height: 200, // Reduced height to make the card more compact
    },
    image: {
        width: '100%',
        height: 100, // Adjusted height for image
        borderRadius: 10,
    },
    info: {
        marginTop: 8, // Adjusted spacing between image and text
        alignItems: 'center',
    },
    title: {
        fontSize: 16, // Slightly smaller font to fit within the compact card
        fontWeight: 'bold',
        textAlign: 'center',
    },
    price: {
        fontSize: 14,
        color: '#4CAF50',
        marginVertical: 4,
        textAlign: 'center',
    },
});

export default ProductCard;
