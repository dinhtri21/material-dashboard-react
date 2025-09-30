const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const usersApi = {
  // GET - Lấy danh sách users từ API
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();

      // Transform data để phù hợp với schema
      return users.map((user) => ({
        id: user.id,
        hoTen: user.name,
        email: user.email,
        vaiTro: user.id <= 3 ? "Admin" : user.id <= 7 ? "User" : "Guest",
        ngaySinh: new Date(
          1970 + Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toISOString().split('T')[0],
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // CREATE - Tạo user mới (chỉ dùng cho reference, không gọi thật)
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.hoTen,
          email: userData.email,
          // API không hỗ trợ vaiTro, ngaySinh
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      
      // Transform response
      return {
        id: newUser.id,
        hoTen: userData.hoTen,
        email: userData.email,
        vaiTro: userData.vaiTro,
        ngaySinh: userData.ngaySinh,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // UPDATE - Cập nhật user (chỉ dùng cho reference, không gọi thật)
  updateUser: async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: userData.hoTen,
          email: userData.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Transform response
      return {
        id: updatedUser.id,
        hoTen: userData.hoTen,
        email: userData.email,
        vaiTro: userData.vaiTro,
        ngaySinh: userData.ngaySinh,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // DELETE - Xóa user (chỉ dùng cho reference, không gọi thật)
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};