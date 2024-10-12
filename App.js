// /App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductDetailScreen from './screens/ProductDetailScreen'; 
import CartScreen from './screens/CartScreen'; 

import Icon from 'react-native-vector-icons/Ionicons';

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
                    </Stack.Navigator>
                </NavigationContainer>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
