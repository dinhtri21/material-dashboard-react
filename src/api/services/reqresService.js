/**
 * Reqres API Service
 * API documentation: https://reqres.in/
 */

const BASE_URL = "https://reqres.in/api";

const defaultHeaders = {
  "x-api-key": "reqres-free-v1",
  "Content-Type": "application/json",
};

// Get users with pagination
export const getUsers = async (page = 1, perPage = 6) => {
  try {
    const response = await fetch(`${BASE_URL}/users?page=${page}&per_page=${perPage}`, {
      method: "GET",
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Không thể tải danh sách người dùng");
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Không thể tạo người dùng mới");
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Không thể cập nhật người dùng");
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    });

    if (response.status === 204) {
      return { success: true };
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Không thể xóa người dùng");
  }
};

// Get single user
export const getUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Không thể tải thông tin người dùng");
  }
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
};
