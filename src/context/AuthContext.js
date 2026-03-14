import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra xem trước đó user đã đăng nhập chưa
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Lỗi load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    // Demo login cứng cho bài tập
    if (username === "admin" && password === "123456") {
      const userData = {
        username: "admin",
        fullName: "Nguyễn Viết Doanh",
      };

      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    }

    return {
      success: false,
      message: "Sai tài khoản hoặc mật khẩu",
    };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);