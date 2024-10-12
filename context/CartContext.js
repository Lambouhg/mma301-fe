// context/CartContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Giả sử bạn đã có AuthContext

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth(); // Lấy thông tin người dùng

    const fetchCartItems = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`https://mma301.onrender.com/cart/${user.id}`);
            setCartItems(response.data.products || []); // Cập nhật giỏ hàng
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
        }
    };

    const addToCart = async (productId) => {
        if (!user) {
            throw new Error("Người dùng chưa đăng nhập");
        }

        const dataToSend = {
            productId,
            quantity: 1, // Số lượng mặc định là 1
        };

        try {
            const response = await axios.post(`https://mma301.onrender.com/cart/${user.id}`, dataToSend);
            fetchCartItems(); // Cập nhật giỏ hàng sau khi thêm sản phẩm
            return response.data; // Trả về thông tin phản hồi
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            throw new Error(error.response?.data?.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, fetchCartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
