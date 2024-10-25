import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import OrderScreen from "./screens/OrderScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ListOrderScreen from "./screens/ListOrderScreen";
import ChatSupport from "./screens/ChatSupport";
import Icon from "react-native-vector-icons/Ionicons";
import EditProfileScreen from "./screens/EditProfileScreen";
import EditPasswordScreen from "./screens/EditPassword";
import ListOrderDetailScreen from "./screens/ListOrderDetailScreen";
import VerifyAccountScreen from "./screens/VerifyAccountScreen";
import ForgetPasswordScreen from "./screens/ForgetPassword";
import NewPasswordScreen from "./screens/NewPassword";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 15,
          margintop: 10,
        },
        tabBarIconStyle: {
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Đơn hàng"
        component={ListOrderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tôi"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Đăng nhập"
              component={LoginScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Đăng ký"
              component={SignupScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Quên mật khẩu" // Thêm màn hình quên mật khẩu
              component={ForgetPasswordScreen}
              options={{ title: "Quên mật khẩu", headerShown: true }} // Thay đổi tiêu đề nếu cần
            />
            <Stack.Screen
              name="Nhập mật khẩu mới" // Thêm màn hình quên mật khẩu
              component={NewPasswordScreen}
              options={{ title: "Quên mật khẩu", headerShown: true }} // Thay đổi tiêu đề nếu cần
            />
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chi tiết sản phẩm"
              component={ProductDetailScreen}
              options={{ title: "Chi tiết sản phẩm" }}
            />
            <Stack.Screen
              name="Order"
              component={OrderScreen}
              options={{ title: "Mua hàng" }}
            />
            <Stack.Screen
              name="Xác thực tài khoản"
              component={VerifyAccountScreen}
              options={{ title: "Xác thực tài khoản" }}
            />
            <Stack.Screen
              name="Thanh toán"
              component={PaymentScreen}
              options={{ title: "Thanh toán" }}
            />
            <Stack.Screen
              name="Chỉnh sửa hồ sơ"
              component={EditProfileScreen}
              options={{ title: "Update Profile" }}
            />
            <Stack.Screen
              name="Hỗ trợ"
              component={ChatSupport}
              options={{ title: "Hỗ trợ chat" }}
            />
            <Stack.Screen
              name="Chi tiết đơn hàng"
              component={ListOrderDetailScreen}
              options={{ title: "Chi tiết Đơn hàng" }}
            />
            <Stack.Screen
              name="Đổi mật khẩu"
              component={EditPasswordScreen}
              options={{ title: "Đổi mật khẩu" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
