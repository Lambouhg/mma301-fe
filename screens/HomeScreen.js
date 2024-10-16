import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Chip } from 'react-native-paper';
import ChatIcon from '../components/ChatIcon';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://mma301.onrender.com/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProductCard = ({ item }) => {
        return (
            <ProductCard 
                product={item} 
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
        );
    };

    const handleChatPress = () => {
        navigation.navigate('ChatSupport');
    };

    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Our Store!</Text>
                <Text style={styles.subtitle}>Discover amazing products now</Text>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Brands Section with Horizontal Scroll */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.brandsContainer}
            >
                {brands.map((brand) => (
                    <Chip key={brand} style={styles.brandChip}>
                        {brand}
                    </Chip>
                ))}
            </ScrollView>

            {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <ChatIcon onPress={handleChatPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    brandsContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
        height: 60,
        alignItems: 'center', 
    },
    brandChip: {
        marginRight: 10,
        backgroundColor: '#d9f7ff',
        paddingVertical: 8,
        borderRadius: 15,
        elevation: 2,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    productCard: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: 10,
    },
    chatIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
    },
    footer: {
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#007bff',
    },
});

export default HomeScreen;
