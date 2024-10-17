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
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedGender, setSelectedGender] = useState('');

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

    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
    const sizes = [38, 39, 40, 41, 42, 43]; // Example sizes
    const colors = ["Red", "Blue", "Green", "Black", "White"]; // Example colors
    const genders = ["male", "female", "unisex"];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
        const matchesSize = selectedSize ? product.sizes.includes(selectedSize) : true;
        const matchesColor = selectedColor ? product.colors.includes(selectedColor) : true;
        const matchesGender = selectedGender ? product.gender === selectedGender : true;

        return matchesSearch && matchesBrand && matchesSize && matchesColor && matchesGender;
    });

    const renderProductCard = ({ item }) => (
        <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        />
    );

    const handleChatPress = () => {
        navigation.navigate('ChatSupport');
    };

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

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                {/* Brands Filter */}
                {brands.map(brand => (
                    <Chip
                        key={brand}
                        style={selectedBrand === brand ? styles.selectedChip : styles.brandChip}
                        onPress={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                    >
                        {brand}
                    </Chip>
                ))}

                {/* Sizes Filter */}
                {sizes.map(size => (
                    <Chip
                        key={size}
                        style={selectedSize === size ? styles.selectedChip : styles.sizeChip}
                        onPress={() => setSelectedSize(selectedSize === size ? '' : size)}
                    >
                        {size}
                    </Chip>
                ))}

                {/* Colors Filter */}
                {colors.map(color => (
                    <Chip
                        key={color}
                        style={selectedColor === color ? styles.selectedChip : styles.colorChip}
                        onPress={() => setSelectedColor(selectedColor === color ? '' : color)}
                    >
                        {color}
                    </Chip>
                ))}

                {/* Gender Filter */}
                {genders.map(gender => (
                    <Chip
                        key={gender}
                        style={selectedGender === gender ? styles.selectedChip : styles.genderChip}
                        onPress={() => setSelectedGender(selectedGender === gender ? '' : gender)}
                    >
                        {gender}
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
        marginLeft: 10,
        fontSize: 16,
    },
    filtersContainer: {
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
    selectedChip: {
        backgroundColor: '#007bff',
        color: '#fff',
    },
    sizeChip: {
        marginRight: 10,
        backgroundColor: '#d9f7ff',
        paddingVertical: 8,
        borderRadius: 15,
        elevation: 2,
    },
    colorChip: {
        marginRight: 10,
        backgroundColor: '#d9f7ff',
        paddingVertical: 8,
        borderRadius: 15,
        elevation: 2,
    },
    genderChip: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
    },
});

export default HomeScreen;
