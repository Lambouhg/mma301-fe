import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const OrderStatusBar = ({ status }) => {
  const stages = ["Pending", "Processing", "Shipped", "Completed"];
  const currentIndex = stages.indexOf(status);

  return (
    <View style={styles.statusBarContainer}>
      {stages.map((stage, index) => (
        <View key={stage} style={styles.statusStageContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: index <= currentIndex ? "#4CAF50" : "#E0E0E0",
              },
            ]}
          />
          <Text
            style={[
              styles.statusStageText,
              {
                color: index <= currentIndex ? "#4CAF50" : "#9E9E9E",
                fontWeight: index === currentIndex ? "bold" : "normal",
              },
            ]}
          >
            {stage}
          </Text>
          {index < stages.length - 1 && (
            <View
              style={[
                styles.statusLine,
                {
                  backgroundColor: index < currentIndex ? "#4CAF50" : "#E0E0E0",
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const InfoCard = ({ title, children }) => (
  <View style={styles.infoCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

const ListOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(order);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderDetails) fetchOrderDetails();
    fetchProfile();
  }, [order]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://mma301.onrender.com/orders/${order.id}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOrderDetails(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải thông tin chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://mma301.onrender.com/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfileData(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="search-off" size={48} color="#9E9E9E" />
        <Text style={styles.emptyText}>Không tìm thấy thông tin đơn hàng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <OrderStatusBar status={orderDetails.status} />

        <InfoCard title="Thông tin đơn hàng">
          <View style={styles.infoRow}>
            <MaterialIcons name="receipt" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
            <Text style={styles.infoValue}>{orderDetails.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="date-range" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Ngày đặt:</Text>
            <Text style={styles.infoValue}>{orderDetails.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="payment" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Thanh toán:</Text>
            <Text style={styles.infoValue}>{orderDetails.paymentMethod}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="attach-money" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Tổng tiền:</Text>
            <Text style={styles.infoValue}>
              {orderDetails.totalPrice.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        </InfoCard>

        <InfoCard title="Thông tin người đặt">
          {profileData ? (
            <>
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color="#757575" />
                <Text style={styles.infoLabel}>Họ tên:</Text>
                <Text style={styles.infoValue}>{profileData.username}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={20} color="#757575" />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={20} color="#757575" />
                <Text style={styles.infoLabel}>SĐT:</Text>
                <Text style={styles.infoValue}>{profileData.phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={20} color="#757575" />
                <Text style={styles.infoLabel}>Địa chỉ:</Text>
                <Text style={styles.infoValue}>{profileData.address}</Text>
              </View>
            </>
          ) : (
            <ActivityIndicator size="small" color="#4CAF50" />
          )}
        </InfoCard>

        <InfoCard title="Danh sách sản phẩm">
          <FlatList
            data={orderDetails.products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Chi tiết sản phẩm", { product: item })}
                style={styles.productCard}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')} VND
                  </Text>
                  <View style={styles.productMetaContainer}>
                    <View style={styles.productMeta}>
                      <MaterialIcons name="shopping-cart" size={16} color="#757575" />
                      <Text style={styles.productMetaText}>SL: {item.quantity}</Text>
                    </View>
                    <View style={styles.productMeta}>
                      <MaterialIcons name="category" size={16} color="#757575" />
                      <Text style={styles.productMetaText}>{item.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </InfoCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  statusBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    marginVertical: 10,
  },
  statusStageContainer: {
    alignItems: "center",
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLine: {
    position: "absolute",
    top: 6,
    left: "60%",
    right: 0,
    height: 2,
  },
  statusStageText: {
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#212121",
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    flex: 1,
    color: "#757575",
  },
  infoValue: {
    flex: 2,
    color: "#212121",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 8,
  },
  productMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  productMetaText: {
    fontSize: 13,
    color: "#757575",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    color: "#757575",
  },
  errorText: {
    color: "#F44336",
    marginTop: 8,
  },
  emptyText: {
    color: "#757575",
    marginTop: 8,
  },
});

export default ListOrderDetailScreen;