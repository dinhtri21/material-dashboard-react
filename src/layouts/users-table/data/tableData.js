import { useMemo } from "react";
import { TableSortLabel, IconButton, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useUsers } from "../context/UsersContext";
import PropTypes from "prop-types";

// Component hiển thị vai trò với màu sắc
const VaiTro = ({ vaiTro }) => {
  let color;
  switch (vaiTro) {
    case "Admin":
      color = "error";
      break;
    case "Guest":
      color = "warning";
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

export default function useTableData({ onEdit, onDelete, onSort }) {
  const { users, loading, searchTerm, page, rowsPerPage, orderBy, order } = useUsers();

  // Tạo header với chức năng sort
  const createSortableHeader = (label, accessor) => {
    const canSort = ["hoTen", "email"];

    if (!canSort.includes(accessor)) {
      return (
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          {label}
        </MDTypography>
      );
    }

    return (
      <TableSortLabel
        active={orderBy === accessor}
        direction={orderBy === accessor ? order : "asc"}
        onClick={() => onSort(accessor, orderBy === accessor && order === "asc" ? "desc" : "asc")}
        sx={{
          "& .MuiTableSortLabel-icon": {
            fontSize: "1.2rem !important",
            opacity: orderBy === accessor ? 1 : 0,
          },
          "&:hover .MuiTableSortLabel-icon": {
            opacity: 0.5,
          },
          "&.Mui-active .MuiTableSortLabel-icon": {
            opacity: 1,
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
  };

  // Columns definition
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
      width: "20%",
      align: "left",
    },
    {
      Header: createSortableHeader("Email", "email"),
      accessor: "email",
      width: "25%",
      align: "left",
    },
    {
      Header: createSortableHeader("Vai Trò", "vaiTro"),
      accessor: "vaiTro",
      width: "15%",
      align: "center",
    },
    {
      Header: createSortableHeader("Ngày Sinh", "ngaySinh"),
      accessor: "ngaySinh",
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
          Thao Tác
        </MDTypography>
      ),
      accessor: "actions",
      width: "15%",
      align: "center",
    },
  ];

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.vaiTro.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, orderBy, order]);

  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  // Loading state cho rows
  if (loading) {
    return {
      columns,
      rows: [
        {
          id: (
            <MDBox display="flex" justifyContent="center" p={3} colSpan={6}>
              <CircularProgress size={40} />
            </MDBox>
          ),
          hoTen: "",
          email: "",
          vaiTro: "",
          ngaySinh: "",
          actions: "",
        },
      ],
      loading,
      totalUsers: 0,
    };
  }

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
    ngaySinh: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {new Date(user.ngaySinh).toLocaleDateString("vi-VN")}
      </MDTypography>
    ),
    actions: (
      <MDBox display="flex" alignItems="center" justifyContent="center">
        <IconButton size="small" color="info" onClick={() => onEdit(user)} sx={{ mr: 1 }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(user.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </MDBox>
    ),
  }));

  return {
    columns,
    rows,
    loading,
    totalUsers: filteredUsers.length,
  };
}
