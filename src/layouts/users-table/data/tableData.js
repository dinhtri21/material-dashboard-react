import { useState, useEffect, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { fetchUsersAPI } from "../services/usersService";

export default function useTableData() {
  // State quản lý dữ liệu
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");

  // State cho dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    vaiTro: "User",
  });

  // Component hiển thị vai trò với màu sắc
  const VaiTro = ({ vaiTro }) => {
    let color;
    switch (vaiTro) {
      case "Admin":
        color = "error";
        break;
      case "User":
      default:
        color = "info";
        break;
    }

    return (
      <MDTypography variant="caption" color={color} fontWeight="bold" textGradient>
        {vaiTro}
      </MDTypography>
    );
  };

  VaiTro.propTypes = {
    vaiTro: PropTypes.string.isRequired,
  };

  // 1. Tải dữ liệu từ API khi component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersAPI();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 4. Tìm kiếm nâng cao - lọc dữ liệu
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.vaiTro.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // 3. Sắp xếp dữ liệu
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredUsers, orderBy, order]);

  // 2. Phân trang - lấy dữ liệu cho trang hiện tại
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  // Xử lý sắp xếp
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset về trang đầu khi sort
  };

  // Xử lý phân trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CRUD Operations
  // 2. Thêm người dùng mới
  const handleAddUser = () => {
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      ...formData,
    };
    setUsers([...users, newUser]);
    setFormData({ hoTen: "", email: "", vaiTro: "User" });
    setOpenDialog(false);
  };

  // 4. Chỉnh sửa người dùng
  const handleUpdateUser = () => {
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setFormData({ hoTen: "", email: "", vaiTro: "User" });
    setEditingUser(null);
    setOpenDialog(false);
  };

  // 3. Xóa người dùng
  const handleDeleteUser = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Dialog handlers
  const openAddDialog = () => {
    setFormData({ hoTen: "", email: "", vaiTro: "User" });
    setEditingUser(null);
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setFormData({
      hoTen: user.hoTen,
      email: user.email,
      vaiTro: user.vaiTro,
    });
    setEditingUser(user);
    setOpenDialog(true);
  };

  // Tạo header với tính năng sort
  const createSortableHeader = (label, property) => {
    const canSort = ["hoTen", "email"].includes(property);

    if (canSort) {
      return (
        <TableSortLabel
          active={orderBy === property}
          direction={orderBy === property ? order : "asc"}
          onClick={() => handleSort(property)}
          sx={{
            "& .MuiTableSortLabel-icon": {
              fontSize: "1rem !important",
              opacity: "0 !important", // Ẩn icon mặc định
            },
            "&:hover .MuiTableSortLabel-icon": {
              opacity: "0.5 !important", // Hiện icon khi hover
            },
            "&.Mui-active .MuiTableSortLabel-icon": {
              opacity: "1 !important", // Hiện rõ icon khi đang active
            },
          }}
        >
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            color="secondary"
          >
            {label}
          </MDTypography>
        </TableSortLabel>
      );
    }

    return (
      <MDTypography variant="caption" fontWeight="bold" textTransform="uppercase" color="secondary">
        {label}
      </MDTypography>
    );
  };

  // Cấu hình columns cho DataTable
  const columns = [
    {
      Header: createSortableHeader("ID", "id"),
      accessor: "id",
      width: "10%",
      align: "center",
    },
    {
      Header: createSortableHeader("Họ Tên", "hoTen"),
      accessor: "hoTen",
      width: "30%",
      align: "left",
    },
    {
      Header: createSortableHeader("Email", "email"),
      accessor: "email",
      width: "30%",
      align: "left",
    },
    {
      Header: createSortableHeader("Vai Trò", "vaiTro"),
      accessor: "vaiTro",
      width: "15%",
      align: "center",
    },
    {
      Header: (
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          Hành Động
        </MDTypography>
      ),
      accessor: "actions",
      width: "20%",
      align: "center",
    },
  ];

  // Tạo rows từ dữ liệu đã phân trang
  const rows = paginatedUsers.map((user) => ({
    id: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.id}
      </MDTypography>
    ),
    hoTen: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.hoTen}
      </MDTypography>
    ),
    email: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.email}
      </MDTypography>
    ),
    vaiTro: <VaiTro vaiTro={user.vaiTro} />,
    actions: (
      <MDBox display="flex" alignItems="center" justifyContent="center">
        <IconButton size="small" color="info" onClick={() => openEditDialog(user)} sx={{ mr: 1 }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </MDBox>
    ),
  }));

  // Loading state cho rows
  if (loading) {
    return {
      columns,
      rows: [
        {
          id: (
            <MDBox display="flex" justifyContent="center" p={3}>
              <CircularProgress size={40} />
            </MDBox>
          ),
          hoTen: "",
          email: "",
          vaiTro: "",
          actions: "",
        },
      ],
      loading,
      searchTerm,
      setSearchTerm,
      openDialog,
      setOpenDialog,
      editingUser,
      formData,
      setFormData,
      handleAddUser,
      handleUpdateUser,
      openAddDialog,
      // Pagination
      page,
      rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      totalUsers: 0,
      // Sorting
      orderBy,
      order,
      handleSort,
    };
  }

  return {
    columns,
    rows,
    loading,
    searchTerm,
    setSearchTerm,
    openDialog,
    setOpenDialog,
    editingUser,
    formData,
    setFormData,
    handleAddUser,
    handleUpdateUser,
    openAddDialog,
    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    totalUsers: sortedUsers.length,
    // Sorting
    orderBy,
    order,
    handleSort,
  };
}
