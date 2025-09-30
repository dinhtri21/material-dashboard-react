const API_BASE_URL = "https://reqres.in/api";

export const authApi = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "x-api-key": "reqres-free-v1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // Đăng ký (optional)
  register: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "x-api-key": "reqres-free-v1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error during register:", error);
      throw error;
    }
  },

  // Lấy thông tin user (optional - sử dụng users API)
  getUserInfo: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "x-api-key": "reqres-free-v1",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data.data;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  },
};

// Token management utilities
export const tokenUtils = {
  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem("authToken");
  },

  // Xóa token khỏi localStorage
  removeToken: () => {
    localStorage.removeItem("authToken");
  },

  // Kiểm tra token có tồn tại không
  hasToken: () => {
    return !!localStorage.getItem("authToken");
  },

  // Decode JWT token (basic - không verify signature)
  decodeToken: (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
