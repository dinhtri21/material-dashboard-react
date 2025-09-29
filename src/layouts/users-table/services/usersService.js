export const fetchUsersAPI = async () => {
  // Giả lập loading time
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();

    // Format kiểu riêng
    return users.map((user) => ({
      id: user.id,
      hoTen: user.name,
      email: user.email,
      vaiTro: user.id <= 5 ? "Admin" : "User",
      sdt: user.phone,
      diaChi: `${user.address.street}, ${user.address.city}`,
      website: user.website,
      company: user.company.name,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
