import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Chip } from 'react-native-paper';

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

    // Update: Navigate to ProductDetailScreen on product press
    const renderProductCard = ({ item }) => {
        return (
            <ProductCard 
                product={item} 
                onPress={() => navigation.navigate('ProductDetail', { product: item })} // Navigate to product detail
            />
        );
    };

    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"]; // List of brands

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Chào mừng bạn đến với Shop!</Text>
                <Text style={styles.subtitle}>Khám phá sản phẩm tuyệt vời ngay bây giờ</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm sản phẩm..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Brands Section */}
            <View style={styles.brandsContainer}>
                {brands.map((brand) => (
                    <Chip key={brand} style={styles.brandChip}>
                        {brand}
                    </Chip>
                ))}
            </View>

            {/* Featured Products Section */}
            {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
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

            {/* Footer Section */}
            <View style={styles.footer}>
                <TouchableOpacity>
                    <Text style={styles.footerText}>Xem tất cả sản phẩm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    brandsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#FFCCCC',
        borderRadius: 10,
    },
    brandChip: {
        margin: 4,
    },
    row: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        color: '#666',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#007BFF',
    },
});

export default HomeScreen;
