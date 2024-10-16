import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import ListOrderScreen from './screens/ListOrderScreen';
import ChatSupport from './screens/ChatSupport'; // Import ChatSupport screen
import Icon from 'react-native-vector-icons/Ionicons';
import EditProfileScreen from './screens/EditProfileScreen';
import EditPasswordScreen from './screens/EditPassword';
import EditAddressScreen from './screens/EditAddressScreen'; // Import EditAddressScreen

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cart-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="List Order"
                component={ListOrderScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cart-outline" color={color} size={size} />
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
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignupScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Main"
                            component={TabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="ProductDetail"
                            component={ProductDetailScreen}
                            options={{ title: 'Chi tiết sản phẩm' }}
                        />
                        <Stack.Screen
                            name="Order"
                            component={OrderScreen}
                            options={{ title: 'Mua hàng' }}
                        />
                        <Stack.Screen
                            name="Payment"
                            component={PaymentScreen}
                            options={{ title: 'Thanh toán' }}
                        />
                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfileScreen}
                            options={{ title: 'Update Profile' }}
                        />
                        <Stack.Screen
                            name="EditAddress" // Thêm route cho EditAddressScreen
                            component={EditAddressScreen}
                            options={{ title: 'Chỉnh sửa địa chỉ' }}
                        />
                        <Stack.Screen
                            name="ChatSupport"
                            component={ChatSupport}
                            options={{ title: 'Hỗ trợ chat' }}
                        />
                        <Stack.Screen 
                            name="OrderDetails" 
                            component={OrderDetailsScreen} 
                            options={{ title: 'Chi tiết Đơn hàng' }} 
                        />
                        <Stack.Screen 
                            name="EditPassword" 
                            component={EditPasswordScreen} 
                            options={{ title: 'Đổi mật khẩu' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </CartProvider>
        </AuthProvider>
    );
};

export default App; 
