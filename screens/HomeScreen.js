import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import ChatIcon from "../components/ChatIcon";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  // Sử dụng useRef để lưu trữ giá trị animation
  const filterAnimation = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    // Cập nhật số lượng filter đang active
    let count = 0;
    if (selectedBrand) count++;
    if (selectedCategory) count++;
    setFilterCount(count);

    // Log để debug
    console.log('Selected Brand:', selectedBrand);
    console.log('Selected Category:', selectedCategory);
    console.log('Filter Count:', count);
  }, [selectedBrand, selectedCategory]);

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
  const categories = ["Giày Chạy Bộ", "Giày Thể Thao", "Giày Bóng Rổ", "Giày Thời Trang", "Giày Sneaker"];

  const toggleFilters = () => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    
    Animated.timing(filterAnimation, {
      toValue: newShowFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBrandSelect = (brand) => {
    console.log('Selecting brand:', brand); // Debug log
    setSelectedBrand(brand);
  };

  const handleCategorySelect = (category) => {
    console.log('Selecting category:', category); // Debug log
    setSelectedCategory(category);
  };

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

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    console.log('Clearing filters'); // Debug log
  };

  const filterHeight = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  // Thêm animation cho margin top của product list
  const listMarginTop = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 220], // Điều chỉnh giá trị này để có khoảng cách phù hợp
  });

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

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tên sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <Icon name="filter" size={20} color="#333" />
          {filterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {showFilters && (
          <Animated.View style={[styles.filterContainer, { maxHeight: filterHeight }]}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Thương hiệu</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedBrand && styles.filterChipSelected,
                  ]}
                  onPress={() => handleBrandSelect("")}
                >
                  <Text style={[
                    styles.filterChipText,
                    !selectedBrand && styles.filterChipTextSelected,
                  ]}>Tất cả</Text>
                </TouchableOpacity>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.filterChip,
                      selectedBrand === brand && styles.filterChipSelected,
                    ]}
                    onPress={() => handleBrandSelect(brand)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedBrand === brand && styles.filterChipTextSelected,
                    ]}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Danh mục</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedCategory && styles.filterChipSelected,
                  ]}
                  onPress={() => handleCategorySelect("")}
                >
                  <Text style={[
                    styles.filterChipText,
                    !selectedCategory && styles.filterChipTextSelected,
                  ]}>Tất cả</Text>
                </TouchableOpacity>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipSelected,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === category && styles.filterChipTextSelected,
                    ]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {filterCount > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {filteredProducts.length === 0 ? (
          <Animated.View style={[styles.emptyContainer, { marginTop: listMarginTop }]}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm.</Text>
          </Animated.View>
        ) : (
          <Animated.View style={{ marginTop: listMarginTop }}>
            <FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContainer}
            />
          </Animated.View>
        )}
      </View>

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
  contentContainer: {
    flex: 1,
    position: 'relative',
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
  searchAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterChipSelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  filterChipText: {
    color: "#333",
    fontSize: 14,
  },
  filterChipTextSelected: {
    color: "#fff",
  },
  clearFiltersButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
    marginTop: 10,
  },
  clearFiltersText: {
    color: "white",
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  listContainer: {
    paddingTop: 10,
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