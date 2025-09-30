// Sử dụng MockAPI.io hoặc JSONPlaceholder
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// Helper function để chuyển đổi data từ JSONPlaceholder sang format của chúng ta
function transformUser(user) {
  return {
    id: user.id,
    hoTen: user.name,
    email: user.email,
    vaiTro: user.id % 3 === 0 ? "Admin" : "User", // Random role
    ngaySinh: new Date(1990 + (user.id % 20), user.id % 12, (user.id % 28) + 1)
      .toISOString()
      .split("T")[0], // Random birth date
  };
}

function transformUserToAPI(user) {
  return {
    id: user.id,
    name: user.hoTen,
    email: user.email,
    username: user.hoTen.toLowerCase().replace(/\s+/g, ""),
  };
}

export const usersApi = {
  // Lấy danh sách users
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();
      return users.map(transformUser);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Thêm user mới (giả lập)
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformUserToAPI(userData)),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const newUser = await response.json();
      return transformUser({ ...newUser, ...userData });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Cập nhật user (giả lập)
  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformUserToAPI(userData)),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      return transformUser({ ...updatedUser, ...userData });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Xóa user (giả lập)
  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
