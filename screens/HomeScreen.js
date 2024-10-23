import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { Chip } from "react-native-paper";
import ChatIcon from "../components/ChatIcon";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://mma301.onrender.com/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
  const categories = [
    "Sneakers",
    "Running Shoes",
    "Formal Shoes",
    "Boots",
    "Slippers",
  ]; // Example categories

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  const renderProductCard = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() =>
        navigation.navigate("Chi tiết sản phẩm", { product: item })
      }
    />
  );

  const handleChatPress = () => {
    navigation.navigate("Hỗ trợ");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Chào mừng bạn đến với cửa hàng của chúng tôi
        </Text>
        <Text style={styles.subtitle}>
          Khám phá những sản phẩm tuyệt vời ngay bây giờ
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tên sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {brands.map((brand) => (
          <Chip
            key={brand}
            style={
              selectedBrand === brand ? styles.selectedChip : styles.brandChip
            }
            onPress={() =>
              setSelectedBrand(selectedBrand === brand ? "" : brand)
            }
          >
            {brand}
          </Chip>
        ))}

        {/* Categories Filter */}
        {categories.map((category) => (
          <Chip
            key={category}
            style={
              selectedCategory === category
                ? styles.selectedChip
                : styles.categoryChip
            }
            onPress={() =>
              setSelectedCategory(selectedCategory === category ? "" : category)
            }
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm.</Text>
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
    backgroundColor: "#ffffff",
    padding: 10,
    paddingBottom: 30,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 60,
    alignItems: "center",
  },

  brandChip: {
    marginRight: 10,
    backgroundColor: "#d9f7ff",
    paddingVertical: 8,
    borderRadius: 15,
    elevation: 2,
  },
  categoryChip: {
    marginRight: 10,
    backgroundColor: "#d9f7ff",
    paddingVertical: 8,
    borderRadius: 15,
    elevation: 2,
  },

  selectedChip: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingVertical: 8,
    elevation: 2,
    marginRight: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 10,
    borderRadius: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
});

export default HomeScreen;
